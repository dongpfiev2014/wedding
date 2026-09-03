import mongoose, { Schema, Document } from "mongoose";

export interface IWish extends Document {
  name: string;
  message: string;
  createdAt: Date;
  approved: boolean;
}

const WishSchema = new Schema<IWish>(
  {
    name: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    approved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Wish ||
  mongoose.model<IWish>("Wish", WishSchema);
