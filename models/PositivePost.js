import mongoose from "mongoose";

const PositivePostSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.models.PositivePost || mongoose.model("PositivePost", PositivePostSchema);
