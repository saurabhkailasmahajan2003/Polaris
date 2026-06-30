import mongoose from 'mongoose';

const archiveSchema = new mongoose.Schema(
  {
    caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true, unique: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    title: { type: String, required: true },
    category: { type: String, required: true },
    verdict: {
      type: String,
      enum: ['approved', 'rejected', 'approved_with_conditions', 'delayed'],
      required: true,
    },
    verdictStatement: { type: String, required: true },
    topConsequence: { type: String, default: '' },
    participatingAgents: [{ type: String }],
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

archiveSchema.index({ category: 1, completedAt: -1 });
archiveSchema.index({ verdict: 1 });
archiveSchema.index({ participatingAgents: 1 });
archiveSchema.index({ title: 'text', verdictStatement: 'text' });

export default mongoose.model('Archive', archiveSchema);
