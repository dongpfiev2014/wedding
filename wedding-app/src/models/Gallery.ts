import mongoose, { Schema, Document } from "mongoose";

export interface IGallery extends Document {
  imageUrl: string;
  imagePublicId: string;
  caption: string;
  order: number;
}

const GallerySchema = new Schema<IGallery>(
  {
    imageUrl: { type: String, required: true },
    imagePublicId: { type: String, required: true },
    caption: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Gallery ||
  mongoose.model<IGallery>("Gallery", GallerySchema);
