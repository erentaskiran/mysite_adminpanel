import { NextRequest, NextResponse } from "next/server";
import { doc, setDoc } from "firebase/firestore";
import { db, storage } from "../../../../fireabse";
import { ref, uploadBytes } from "firebase/storage";
import multer from "multer";
import fs from "fs";

// Set up multer to store uploaded files in memory
const upload = multer({ storage: multer.memoryStorage() });

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const slug = formData.get("slug") as string;
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const language = formData.get("language") as string;
    const details = formData.get("details") as string;
    const image = formData.get("image") as File;

    //write md
    if (typeof content === "string") {
      fs.writeFileSync(`${slug}.md`, content, "utf-8");
    }

    // write image and upload firebase
    if (image) {
      const filePath = `images/${slug}.jpg`;
      const blogRef = ref(storage, filePath);
      const metadata = {
        contentType: "image/jpeg",
      };
      await uploadBytes(blogRef, image, metadata);
    }

    // write to database
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const date_now = `${day}/${month}/${year}`;

    setDoc(doc(db, "blogs", slug), {
      title: title,
      slug: slug,
      date: date_now,
      details: details,
      image: `${slug}.jpg`,
      lang: language,
    });

    // write to storage
    const filePath = `blogs/${slug}.md`;
    const blogRef = ref(storage, filePath);
    const metadata = {
      contentType: "text/plain",
    };
    await uploadBytes(blogRef, fs.readFileSync(`${slug}.md`), metadata);

    // delete file
    fs.unlinkSync(`./${slug}.md`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Hata oluştu:", error);
    return NextResponse.json({ success: false, error: "Bir hata oluştu." });
  }
}
