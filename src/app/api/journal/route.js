import dbConnect from "../../../../lib/dbConnect";
import Journal from "../../../../models/Journal";

export async function POST(req) {
  await dbConnect();

  const body = await req.json();
  const { user, content } = body;

  try {
    const entry = await Journal.create({ user, content });
    return new Response(JSON.stringify({ success: true, data: entry }), {
      status: 201,
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
    });
  }
}

export async function GET() {
  await dbConnect();

  try {
    const entries = await Journal.find().sort({ createdAt: -1 });
    return new Response(JSON.stringify({ success: true, data: entries }), {
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
    });
  }
}

export async function DELETE(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response(JSON.stringify({ success: false, error: "No ID provided" }), {
      status: 400,
    });
  }

  try {
    await Journal.findByIdAndDelete(id);
    return new Response(JSON.stringify({ success: true, message: "Entry deleted" }), {
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
    });
  }
}