import mongoose, { Schema, Document } from "mongoose";

export interface IMilestone extends Document {
  date: string;
  title: string;
  description: string;
  imageUrls: string[];
  imagePublicIds: string[];
  /** @deprecated use imageUrls */
  imageUrl?: string;
  /** @deprecated use imagePublicIds */
  imagePublicId?: string;
  order: number;
}

const MilestoneSchema = new Schema<IMilestone>(
  {
    date: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrls: { type: [String], default: [] },
    imagePublicIds: { type: [String], default: [] },
    // Keep old single-image fields so existing documents still serialize correctly
    imageUrl: { type: String, default: "" },
    imagePublicId: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// In Next.js dev mode the module is re-evaluated on every hot-reload but the
// Mongoose connection (and its model registry) persists. If the schema changed
// since the model was first compiled we must delete the stale cache entry so
// mongoose.model() re-compiles with the new schema.
if (process.env.NODE_ENV !== "production" && mongoose.models.Milestone) {
  delete mongoose.models.Milestone;
}

export default mongoose.models.Milestone as mongoose.Model<IMilestone> ??
  mongoose.model<IMilestone>("Milestone", MilestoneSchema);

