import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const SOURCE_PATH =
  "C:/Users/Asus/.gemini/antigravity-ide/brain/aecb00b3-97b8-42c0-83b1-423063861ba1/.user_uploaded/media_1791827103589.png";

export async function GET() {
  const destPath = path.join(process.cwd(), "public", "images", "patient-journey.png");

  try {
    if (fs.existsSync(SOURCE_PATH)) {
      if (!fs.existsSync(destPath)) {
        const destDir = path.dirname(destPath);
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }
        fs.copyFileSync(SOURCE_PATH, destPath);
      }
      const buffer = fs.readFileSync(SOURCE_PATH);
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    if (fs.existsSync(destPath)) {
      const buffer = fs.readFileSync(destPath);
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }
  } catch (error) {
    console.error("Error serving journey image:", error);
  }

  return new NextResponse("Not Found", { status: 404 });
}
