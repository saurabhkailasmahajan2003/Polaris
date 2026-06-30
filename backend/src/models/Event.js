import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    source: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        'politics',
        'economics',
        'technology',
        'legal',
        'ethics',
        'human_rights',
        'social',
        'environment',
        'security',
        'general',
      ],
    },
    image: { type: String, default: '' },
    voteCount: { type: Number, default: 0 },
    deployed: { type: Boolean, default: false },
    createdBy: { type: String, default: '' },
  },
  { timestamps: true }
);

eventSchema.index({ voteCount: -1 });
eventSchema.index({ deployed: 1, createdAt: -1 });
eventSchema.index({ category: 1 });

export default mongoose.model('Event', eventSchema);
