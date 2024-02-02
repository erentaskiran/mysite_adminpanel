import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { doc, setDoc } from "firebase/firestore";
import { db, storage } from "../../../../fireabse";
import { ref, uploadBytes } from "firebase/storage";


export async function POST(req: NextRequest) {

  try {
    const formData = await req.formData();
    const slug = formData.get("slug") as string;
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const language = formData.get("language") as string;
    const details = formData.get("details") as string;

    const data = {
      slug: slug,
      title: title,
      content: content,
      language: language,
      details: details,
    };
   
    // write file
    if (typeof data.content === "string") {
      fs.writeFileSync(`${data.slug}.md`, data.content, "utf-8");
    }

    // write to database
    const now = new Date();
    const gun = String(now.getDate()).padStart(2, '0');
    const ay = String(now.getMonth() + 1).padStart(2, '0'); // Ay 0 ile başlar, bu nedenle +1 ekliyoruz.
    const yil = now.getFullYear();
    const date_now = `${gun}/${ay}/${yil}`;
    setDoc(doc(db, "blogs", data.slug), {
      date: date_now,
      details: data.details,
      image: "default.jpg",
      lang: data.language,
      slug: data.slug,
      title: data.title,
    });

    // write to storage
    const filePath = `blogs/${data.slug}.md`;
    const blogRef = ref(storage, filePath);
    const metadata = {
      contentType: "text/plain",
    };
    await uploadBytes(blogRef, fs.readFileSync(`${data.slug}.md`), metadata);

    // delete file
    fs.unlinkSync(`./${data.slug}.md`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Hata oluştu:", error);
    return NextResponse.json({ success: false, error: "Bir hata oluştu." });
  }
}