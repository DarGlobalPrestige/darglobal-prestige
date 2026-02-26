import { NextRequest, NextResponse } from "next/server";
import { getWixClient } from "@/lib/wix";

function findCollection(list: any[], names: string[]): string | null {
  for (const name of names) {
    const match = list.find((c: any) => {
      const n = (c.displayName || c._id || "").toLowerCase();
      return n.includes(name.toLowerCase());
    });
    if (match?._id) return match._id;
  }
  return list[0]?._id || null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, agreed, bank, shortlist } = body;

    if (!email?.trim()) {
      return NextResponse.json({ message: "Email is required." }, { status: 400 });
    }

    if (!agreed) {
      return NextResponse.json({ message: "You must accept the investor agreement." }, { status: 400 });
    }

    if (!bank?.accountHolder || !bank?.bankName || !bank?.iban) {
      return NextResponse.json({ message: "Bank details are required." }, { status: 400 });
    }

    const agreementData = {
      memberEmail: String(email).toLowerCase(),
      agreed: true,
      accountHolder: String(bank.accountHolder),
      bankName: String(bank.bankName),
      iban: String(bank.iban).replace(/\s/g, ""),
      swift: String(bank.swift || "").replace(/\s/g, ""),
      shortlist: Array.isArray(shortlist) ? JSON.stringify(shortlist) : "[]",
      submittedAt: new Date().toISOString(),
    };

    const wix = getWixClient();
    if (wix) {
      try {
        const { collections } = await (wix.collections as any).listDataCollections({});
        const list = collections || [];
        const agreementsId = findCollection(list, ["agreement", "agreements", "investor agreement"]);

        if (agreementsId) {
          await wix.items.insert(agreementsId, agreementData as any);
        }
      } catch (e) {
        console.error("[agreement] Wix error:", e);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[agreement] Error:", err);
    return NextResponse.json(
      { message: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}
