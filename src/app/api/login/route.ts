import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcryptjs";
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
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password required." }, { status: 400 });
    }

    const emailLower = String(email).toLowerCase();

    const wix = getWixClient();
    if (!wix) {
      return NextResponse.json({ message: "Login temporarily unavailable." }, { status: 503 });
    }

    const { collections } = await (wix.collections as any).listDataCollections({});
    const list = collections || [];
    const membersId = findCollection(list, ["member", "members"]);
    if (!membersId) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    const results = await wix.items
      .query(membersId)
      .eq("email" as any, emailLower)
      .limit(1)
      .find();

    const items = results?.items || [];
    if (!items.length) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    const member = items[0] as Record<string, unknown>;
    const data = (member?.data as Record<string, unknown>) || member || {};
    const hash = typeof data.passwordHash === "string" ? data.passwordHash : "";
    if (!hash) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    const valid = await compare(password, hash);
    if (!valid) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    const fullName = (typeof data.fullName === "string" ? data.fullName : "Investor") as string;
    const tags = (Array.isArray(data.tags) ? data.tags : []) as string[];
    const isAdmin = Array.isArray(tags) && tags.some((t: string) => String(t).toLowerCase() === "admin");

    return NextResponse.json({
      redirect: isAdmin ? "/admin" : "/dashboard",
      fullName,
      email: emailLower,
      isAdmin,
    });
  } catch (err) {
    console.error("[login] Error:", err);
    return NextResponse.json({ message: "An error occurred." }, { status: 500 });
  }
}
