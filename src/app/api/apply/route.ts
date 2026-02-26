import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
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
    const {
      fullName,
      email,
      phone,
      country,
      password,
      path,
      properties,
      cities,
      budgetRange,
      shareRange,
      investmentGoals,
      timeline,
      propertyTypes,
      riskTolerance,
      budgetMin,
      budgetMax,
    } = body;

    if (!fullName || !email || !password || password.length < 8) {
      return NextResponse.json(
        { message: "Full name, email, and password (min 8 chars) are required." },
        { status: 400 },
      );
    }

    const emailLower = String(email).toLowerCase();
    const passwordHash = await hash(password, 10);

    const memberData = {
      fullName: String(fullName),
      email: emailLower,
      phone: String(phone || ""),
      country: String(country || ""),
      passwordHash,
    };

    const applicationData = {
      memberEmail: emailLower,
      fullName: String(fullName),
      path: String(path || ""),
      properties: Array.isArray(properties) ? JSON.stringify(properties) : "",
      cities: Array.isArray(cities) ? JSON.stringify(cities) : "",
      budgetRange: String(budgetRange || ""),
      shareRange: Number(shareRange) || 0,
      investmentGoals: Array.isArray(investmentGoals) ? JSON.stringify(investmentGoals) : "",
      timeline: String(timeline || ""),
      propertyTypes: Array.isArray(propertyTypes) ? JSON.stringify(propertyTypes) : "",
      riskTolerance: String(riskTolerance || ""),
      budgetMin: Number(budgetMin) || 0,
      budgetMax: Number(budgetMax) || 0,
      status: "pending",
      kycStatus: "pending",
      documentsStatus: "pending",
    };

    const wix = getWixClient();
    if (wix) {
      try {
        const { collections } = await (wix.collections as any).listDataCollections({});
        const list = collections || [];

        const membersId = findCollection(list, ["member", "members"]);
        const applicationsId = findCollection(list, ["application", "applications", "investor", "property application"]);

        if (membersId) {
          await wix.items.insert(membersId, memberData as any);
        }

        if (applicationsId) {
          await wix.items.insert(applicationsId, applicationData as any);
        }
      } catch (e) {
        console.error("[apply] Wix error:", e);
        return NextResponse.json({ message: "Could not save application. Please try again." }, { status: 500 });
      }
    } else {
      console.warn("[apply] Wix not configured. Application would be saved to CMS.");
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[apply] Error:", err);
    return NextResponse.json(
      { message: "An error occurred. Please try again." },
      { status: 500 },
    );
  }
}
