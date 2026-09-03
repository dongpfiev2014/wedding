import mongoose, { Schema, Document } from "mongoose";

export interface ISetting extends Document {
  key: string;
  value: string | object;
}

const SettingSchema = new Schema<ISetting>(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Setting ||
  mongoose.model<ISetting>("Setting", SettingSchema);

// Default settings
export const DEFAULT_SETTINGS = {
  groomName: "Minh Đông",
  brideName: "Diệu Linh",
  weddingDate: "2026-09-20",
  weddingTime: "11:35",
  saveTheDate: "20.09.2026",
  heroImageUrl: "",
  heroVideoUrl: "",
  musicUrl: "",

  // Nhà Trai event
  groomVenueTitle: "TƯ GIA NHÀ TRAI",
  groomVenueAddress: "Thôn Hồng Thái – Xã Lập Thạch – Tỉnh Phú Thọ",
  groomPartyDate: "19/09/2026",
  groomPartyTime: "",
  groomPartyDay: "Thứ Bảy",
  groomWeddingTime: "11 Giờ 35",
  groomWeddingDay: "Chủ Nhật",
  groomWeddingDate: "20/09/2026",
  groomLunarParty: "Tức ngày 09 tháng 08 năm Bính Ngọ",
  groomLunarWedding: "Tức ngày 10 tháng 08 năm Bính Ngọ",
  groomMapEmbed: "https://maps.google.com/maps?q=Thôn+Hồng+Thái,+Xã+Lập+Thạch,+Phú+Thọ&output=embed",
  groomMapUrl: "https://maps.google.com/?q=Thôn+Hồng+Thái,+Xã+Lập+Thạch,+Phú+Thọ",

  // Nhà Gái event
  brideVenueTitle: "TƯ GIA NHÀ GÁI",
  brideVenueAddress: "Khu 4 – Ngã Ba Đồng Xuân – Thôn Thành Công – Tỉnh Phú Thọ",
  bridePartyDate: "19/09/2026",
  bridePartyTime: "",
  bridePartyDay: "Thứ Bảy",
  brideWeddingTime: "10 Giờ 20",
  brideWeddingDay: "Chủ Nhật",
  brideWeddingDate: "20/09/2026",
  brideLunarParty: "Tức ngày 09 tháng 08 năm Bính Ngọ",
  brideLunarWedding: "Tức ngày 10 tháng 08 năm Bính Ngọ",
  brideMapEmbed: "https://maps.google.com/maps?q=Khu+4,+Ngã+Ba+Đồng+Xuân,+Thôn+Thành+Công,+Phú+Thọ&output=embed",
  brideMapUrl: "https://maps.google.com/?q=Khu+4,+Ngã+Ba+Đồng+Xuân,+Thôn+Thành+Công,+Phú+Thọ",

  // Family info
  groomFatherName: "Khổng Cao Đăng",
  groomMotherName: "Nguyễn Thị Hồng",
  brideFatherName: "Nguyễn Quốc Cường",
  brideMotherName: "Nguyễn Thị Kim Anh",

  // QR & Bank & Photos
  groomPhotoUrl: "",
  groomBankName: "Ngân hàng ...",
  groomBankAccount: "...",
  groomBankOwner: "Khổng Minh Đông",
  groomQrUrl: "",
  bridePhotoUrl: "",
  brideBankName: "Ngân hàng ...",
  brideBankAccount: "...",
  brideBankOwner: "Lê Diệu Linh",
  brideQrUrl: "",

  // OG
  ogImageUrl: "",
  siteDescription: "Trân trọng kính mời bạn đến dự lễ thành hôn của Minh Đông & Diệu Linh ngày 20.09.2026",

  // Thank you
  thankYouMessage: "Cảm ơn bạn đã dành thời gian đến chung vui với chúng mình. Sự hiện diện của bạn là món quà ý nghĩa nhất!",
};
