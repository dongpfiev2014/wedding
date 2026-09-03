import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadMedia } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "wedding";
    const resourceTypeRaw = (formData.get("resourceType") as string) || "image";
    // Cloudinary only accepts 'image' or 'video' as resource_type
    const resourceType: "image" | "video" = resourceTypeRaw === "video" ? "video" : "image";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await uploadMedia(base64, folder, resourceType);
    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
