import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Milestone from "@/models/Milestone";
import { auth } from "@/lib/auth";

const DEFAULT_MILESTONES = [
  {
    date: "31/01/2025",
    title: "Lần Đầu Gặp Gỡ",
    description: "Một buổi chiều bình thường bỗng trở nên đặc biệt khi hai ánh mắt vô tình chạm nhau. Không ai ngờ rằng khoảnh khắc ngẫu nhiên ấy lại là khởi đầu của một tình yêu đẹp đến vậy.",
    imageUrls: [],
    imagePublicIds: [],
    order: 1,
  },
  {
    date: "23/01/2026",
    title: "Lời Cầu Hôn",
    description: "Dưới bầu trời đêm lấp lánh, anh quỳ xuống với chiếc nhẫn kim cương trong tay. Câu hỏi \"Em có đồng ý lấy anh không?\" khiến tim em ngừng đập một nhịp trước khi thốt lên \"Có\".",
    imageUrls: [],
    imagePublicIds: [],
    order: 2,
  },
  {
    date: "26/01/2026",
    title: "Lễ Dạm Ngõ",
    description: "Hai gia đình gặp nhau trong không khí ấm áp và hân hoan. Từ hôm nay, hai người trẻ chính thức được hai bên gia đình công nhận và bước đầu chuẩn bị cho ngày trọng đại.",
    imageUrls: [],
    imagePublicIds: [],
    order: 3,
  },
  {
    date: "29/01/2026",
    title: "Lễ Ăn Hỏi",
    description: "Mâm lễ đỏ thắm, hoa tươi rực rỡ — lễ ăn hỏi diễn ra trong niềm vui của hai gia đình. Từng thủ tục truyền thống mang theo ý nghĩa thiêng liêng, nhắc nhở đôi trẻ về tình yêu bền vững.",
    imageUrls: [],
    imagePublicIds: [],
    order: 4,
  },
  {
    date: "19 – 20/09/2026",
    title: "Mãi Về Sau",
    description: "Ngày hạnh phúc nhất trong cuộc đời — lễ thành hôn của Minh Đông và Diệu Linh. Hai trái tim, một nhà, một cuộc đời. Hành trình mới bắt đầu từ đây, mãi mãi bên nhau.",
    imageUrls: [],
    imagePublicIds: [],
    order: 5,
  },
];

export async function GET() {
  try {
    const conn = await connectDB();
    if (conn) {
      let milestones = await Milestone.find().sort({ order: 1 });
      if (milestones.length === 0) {
        milestones = await Milestone.insertMany(DEFAULT_MILESTONES);
      }
      return NextResponse.json({ milestones });
    }
  } catch (err) {
    console.warn("Using default milestones:", err);
  }

  return NextResponse.json({
    milestones: DEFAULT_MILESTONES.map((m, i) => ({ ...m, _id: `m_${i + 1}` })),
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    await connectDB();
    const milestone = await Milestone.create(data);
    return NextResponse.json({ milestone }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create milestone" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const targetId = body._id || body.id;
    if (!targetId) {
      return NextResponse.json({ error: "Missing milestone ID" }, { status: 400 });
    }

    const { id, _id, __v, createdAt, updatedAt, ...data } = body;
    await connectDB();
    const milestone = await Milestone.findByIdAndUpdate(targetId, data, { new: true });
    return NextResponse.json({ milestone });
  } catch (err) {
    console.error("Failed to update milestone:", err);
    return NextResponse.json({ error: "Failed to update milestone" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const targetId = body._id || body.id;
    if (!targetId) {
      return NextResponse.json({ error: "Missing milestone ID" }, { status: 400 });
    }

    await connectDB();
    await Milestone.findByIdAndDelete(targetId);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to delete milestone:", err);
    return NextResponse.json({ error: "Failed to delete milestone" }, { status: 500 });
  }
}
