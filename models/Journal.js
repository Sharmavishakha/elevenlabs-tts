// models/Journal.js
import mongoose from 'mongoose';

const JournalSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Journal || mongoose.model('Journal', JournalSchema);
