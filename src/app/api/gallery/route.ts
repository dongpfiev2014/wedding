import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Gallery from "@/models/Gallery";
import { auth } from "@/lib/auth";
import { deleteImage } from "@/lib/cloudinary";

export async function GET() {
  try {
    await connectDB();
    const photos = await Gallery.find().sort({ order: 1, createdAt: 1 });
    return NextResponse.json({ photos });
  } catch {
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    await connectDB();
    const photo = await Gallery.create(data);
    return NextResponse.json({ photo }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to add photo" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const targetId = body.id || body._id;
    await connectDB();
    if (body.imagePublicId) await deleteImage(body.imagePublicId);
    await Gallery.findByIdAndDelete(targetId);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete photo" }, { status: 500 });
  }
}
