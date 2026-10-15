import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const source = "C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\251564c4-118c-4ed5-b5d6-d053fa6b3c90\\heart_anatomical_1792059562598.jpg";
  const target = path.join(process.cwd(), "public", "heart.png");
  
  try {
    if (fs.existsSync(source) && !fs.existsSync(target)) {
      fs.copyFileSync(source, target);
    }
    if (fs.existsSync(target)) {
      const file = fs.readFileSync(target);
      return new NextResponse(file, {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=31536000",
        },
      });
    }
  } catch (e) {
    console.error("Error reading heart image", e);
  }
  return NextResponse.json({ error: "Image not found" }, { status: 404 });
}
