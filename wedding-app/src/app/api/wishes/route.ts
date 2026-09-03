import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Wish from "@/models/Wish";
import { auth } from "@/lib/auth";
import { getMemoryWishes } from "@/lib/mockStore";

export async function GET() {
  try {
    const conn = await connectDB();
    if (conn) {
      const wishes = await Wish.find({ approved: true }).sort({ createdAt: -1 });
      return NextResponse.json({ wishes });
    }
  } catch (err) {
    console.warn("Using memory store for wishes GET:", err);
  }

  const memory = getMemoryWishes();
  return NextResponse.json({ wishes: memory.filter((w) => w.approved) });
}

export async function POST(req: NextRequest) {
  try {
    const { name, message } = await req.json();
    if (!name || !message) {
      return NextResponse.json({ error: "Name and message are required" }, { status: 400 });
    }

    const conn = await connectDB();
    if (conn) {
      const wish = await Wish.create({ name, message });
      return NextResponse.json({ wish }, { status: 201 });
    }

    // In-memory fallback
    const memory = getMemoryWishes();
    const newWish = {
      _id: "w_" + Date.now(),
      name: name.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
      approved: true,
    };
    memory.unshift(newWish);
    return NextResponse.json({ wish: newWish }, { status: 201 });
  } catch (err) {
    console.error("Failed to create wish:", err);
    return NextResponse.json({ error: "Failed to create wish" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const targetId = body.id || body._id;
    const conn = await connectDB();
    if (conn) {
      await Wish.findByIdAndDelete(targetId);
      return NextResponse.json({ success: true });
    }

    const memory = getMemoryWishes();
    const idx = memory.findIndex((w) => w._id === targetId);
    if (idx !== -1) memory.splice(idx, 1);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to delete wish:", err);
    return NextResponse.json({ error: "Failed to delete wish" }, { status: 500 });
  }
}
