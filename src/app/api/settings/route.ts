import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Setting from "@/models/Setting";
import { DEFAULT_SETTINGS } from "@/models/Setting";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const conn = await connectDB();
    if (conn) {
      const settingDocs = await Setting.find({});
      const settings: Record<string, unknown> = { ...DEFAULT_SETTINGS };
      for (const doc of settingDocs) {
        settings[doc.key] = doc.value;
      }
      return NextResponse.json({ settings });
    }
  } catch (err) {
    console.warn("Using default settings:", err);
  }

  return NextResponse.json({ settings: DEFAULT_SETTINGS });
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const updates = await req.json();
    await connectDB();
    const ops = Object.entries(updates).map(([key, value]) =>
      Setting.findOneAndUpdate(
        { key },
        { key, value },
        { upsert: true, new: true }
      )
    );
    await Promise.all(ops);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
