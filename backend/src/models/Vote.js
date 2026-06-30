import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

voteSchema.index({ eventId: 1, userId: 1 }, { unique: true });
voteSchema.index({ eventId: 1 });

export default mongoose.model('Vote', voteSchema);
