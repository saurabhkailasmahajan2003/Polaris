import mongoose from 'mongoose';

const caseHistorySchema = new mongoose.Schema(
  {
    caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case' },
    caseTitle: { type: String, default: '' },
    position: { type: String, default: '' },
    outcome: { type: String, default: '' },
    wasAccurate: { type: Boolean, default: null },
    confidence: { type: Number, default: 50 },
    participatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const agentSchema = new mongoose.Schema(
  {
    agentId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    expertise: [{ type: String }],
    personality: { type: String, default: '' },
    reasoningStyle: { type: String, default: '' },
    avatar: { type: String, default: '' },
    color: { type: String, default: '#4f6ef7' },
    categories: [{ type: String }],
    keywords: [{ type: String }],
    confidenceScore: { type: Number, default: 75 },
    accuracyRate: { type: Number, default: 0 },
    casesParticipated: { type: Number, default: 0 },
    caseHistory: [caseHistorySchema],
    activeCaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', default: null },
    isJudge: { type: Boolean, default: false },
  },
  { timestamps: true }
);

agentSchema.index({ categories: 1 });

export default mongoose.model('Agent', agentSchema);
