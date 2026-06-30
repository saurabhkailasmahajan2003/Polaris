import mongoose from 'mongoose';

const agentMessageSchema = new mongoose.Schema(
  {
    agentId: { type: String, required: true },
    agentName: { type: String, required: true },
    position: { type: String, default: '' },
    reasoning: { type: String, default: '' },
    oneLineReasoning: { type: String, default: '' },
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    confidence: { type: Number, min: 0, max: 100, default: 50 },
    viewChanged: { type: Boolean, default: false },
    changeReason: { type: String, default: '' },
    factCheckFlags: [{ type: String }],
    evidenceReferences: [{ type: String }],
    rawOutput: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

const roundSchema = new mongoose.Schema(
  {
    caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true },
    roundNumber: { type: Number, required: true },
    phase: {
      type: String,
      enum: ['pre_discussion', 'round1', 'round2', 'round3', 'round4'],
      required: true,
    },
    messages: [agentMessageSchema],
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

roundSchema.index({ caseId: 1, roundNumber: 1 }, { unique: true });
roundSchema.index({ caseId: 1, phase: 1 });

export default mongoose.model('Round', roundSchema);
