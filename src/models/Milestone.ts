import mongoose, { Schema, Document } from "mongoose";

export interface IMilestone extends Document {
  date: string;
  title: string;
  description: string;
  imageUrl: string;
  imagePublicId: string;
  order: number;
}

const MilestoneSchema = new Schema<IMilestone>(
  {
    date: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, default: "" },
    imagePublicId: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Milestone ||
  mongoose.model<IMilestone>("Milestone", MilestoneSchema);
