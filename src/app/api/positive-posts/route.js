// import dbConnect from "../../../../lib/dbConnect";
// import PositivePost from "../../../../models/PositivePost";

// export async function POST(req) {
//   await dbConnect();
//   const body = await req.json();
//   const { user, content, imageUrl } = body;

//   try {
//     const post = await PositivePost.create({ user, content, imageUrl });
//     return new Response(JSON.stringify({ success: true, data: post }), {
//       status: 201,
//     });
//   } catch (err) {
//     return new Response(JSON.stringify({ success: false, error: err.message }), {
//       status: 500,
//     });
//   }
// }

// export async function GET() {
//   await dbConnect();

//   try {
//     const posts = await PositivePost.find().sort({ createdAt: -1 });
//     return new Response(JSON.stringify({ success: true, data: posts }), {
//       status: 200,
//     });
//   } catch (err) {
//     return new Response(JSON.stringify({ success: false, error: err.message }), {
//       status: 500,
//     });
//   }
// }






// import dbConnect from "../../../../lib/dbConnect";
// import PositivePost from "../../../../models/PositivePost";
// import { writeFile } from "fs/promises";
// import path from "path";
// import { v4 as uuidv4 } from "uuid";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   await dbConnect();

//   try {
//     const formData = await req.formData();
//     const content = formData.get("quote");
//     const file = formData.get("image");

//     if (!file || typeof file === "string") {
//       return NextResponse.json({ success: false, error: "Invalid image file" }, { status: 400 });
//     }

//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);

//     const fileName = uuidv4() + path.extname(file.name);
//     const uploadDir = path.join(process.cwd(), "public/uploads");

//     await writeFile(path.join(uploadDir, fileName), buffer);

//     const imageUrl = `/uploads/${fileName}`;

//     const newPost = await PositivePost.create({
//       user: "Anonymous",
//       content,
//       imageUrl,
//     });

//     return NextResponse.json({ success: true, data: newPost });
//   } catch (err) {
//     console.error("Upload error:", err);
//     return NextResponse.json({ success: false, error: err.message }, { status: 500 });
//   }
// }




import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs/promises";
import dbConnect from "../../../../lib/dbConnect";
import PositivePost from "../../../../models/PositivePost";

export const POST = async (req) => {
  try {
    await dbConnect();

    const formData = await req.formData();

    const user = formData.get("user") || "Anonymous";
    const content = formData.get("content") || "";
    const imageFile = formData.get("image");

    if (!imageFile || typeof imageFile === "string") {
      return new Response(JSON.stringify({ success: false, error: "Image is required" }), { status: 400 });
    }

    // Save image to public/uploads/
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${uuidv4()}-${imageFile.name}`;
    const filePath = path.join(process.cwd(), "public/uploads", filename);
    await fs.writeFile(filePath, buffer);

    const imageUrl = `/uploads/${filename}`;

    const newPost = await PositivePost.create({
      user,
      content,
      imageUrl,
    });

    return new Response(JSON.stringify({ success: true, data: newPost }), {
      status: 201,
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
    });
  }
};

export const GET = async () => {
  try {
    await dbConnect();
    const posts = await PositivePost.find().sort({ createdAt: -1 });
    return new Response(JSON.stringify({ success: true, data: posts }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
};
