import mongoose from 'mongoose';

const caseSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    source: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    currentPhase: {
      type: String,
      enum: [
        'pre_discussion',
        'round1',
        'round2',
        'round3',
        'round4',
        'verdict',
        'completed',
      ],
      default: 'pre_discussion',
    },
    currentAgent: { type: String, default: '' },
    participatingAgents: [{ type: String }],
    verifiedEvidence: { type: mongoose.Schema.Types.Mixed, default: null },
    summary: { type: String, default: '' },
  },
  { timestamps: true }
);

caseSchema.index({ status: 1, createdAt: -1 });
caseSchema.index({ eventId: 1 });

export default mongoose.model('Case', caseSchema);
