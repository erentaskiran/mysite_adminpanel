import { NextResponse } from "next/server";

import fs from "fs";


type Post = {
  content: string;
};

export async function POST(req: Request) {
  try {
    const data = await req.json();
    if (typeof data.content === "string") {
      fs.writeFileSync("output.md", data.content, "utf-8");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Hata oluştu:", error);
    return NextResponse.json({ success: false, error: "Bir hata oluştu." });
  }
}
