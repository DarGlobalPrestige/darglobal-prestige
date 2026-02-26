import { NextRequest, NextResponse } from "next/server";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const email = formData.get("email") as string | null;
    const passport = formData.get("passport") as File | null;
    const address = formData.get("address") as File | null;
    const tax = formData.get("tax") as File | null;
    const source = formData.get("source") as File | null;

    if (!email?.trim()) {
      return NextResponse.json({ message: "Email is required." }, { status: 400 });
    }

    const files = [
      { key: "passport", file: passport },
      { key: "address", file: address },
      { key: "tax", file: tax },
      { key: "source of funds", file: source },
    ];

    for (const { key, file } of files) {
      if (!file || file.size === 0) {
        return NextResponse.json(
          { message: `All four documents are required. Missing: ${key}.` },
          { status: 400 }
        );
      }
      if (file.size > MAX_SIZE) {
        return NextResponse.json(
          { message: `${key}: File must be under 5MB.` },
          { status: 400 }
        );
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { message: `${key}: Only PDF, JPG, and PNG are allowed.` },
          { status: 400 }
        );
      }
    }

    // In production: upload to Wix Media, Vercel Blob, or S3
    // For now we validate and return success
    // TODO: Integrate with Wix Media Manager or storage provider
    return NextResponse.json({
      success: true,
      message: "Documents received. We'll review and notify you.",
    });
  } catch (err) {
    console.error("[kyc/upload] Error:", err);
    return NextResponse.json(
      { message: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}
