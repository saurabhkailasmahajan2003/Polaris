import mongoose from 'mongoose';

const consequenceSchema = new mongoose.Schema(
  {
    timeframe: { type: String, enum: ['6_months', '1_year', '2_years'], required: true },
    socialImpact: { type: String, default: '' },
    economicEffect: { type: String, default: '' },
    institutionalIntegrity: { type: String, default: '' },
    longTermStability: { type: String, default: '' },
  },
  { _id: false }
);

const agentFinalPositionSchema = new mongoose.Schema(
  {
    agentId: { type: String, required: true },
    agentName: { type: String, required: true },
    finalPosition: { type: String, default: '' },
    confidence: { type: Number, default: 50 },
  },
  { _id: false }
);

const verdictSchema = new mongoose.Schema(
  {
    caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true, unique: true },
    decision: {
      type: String,
      enum: ['approved', 'rejected', 'approved_with_conditions', 'delayed'],
      required: true,
    },
    statement: { type: String, required: true },
    justification: { type: String, required: true },
    confidence: { type: Number, min: 0, max: 100, default: 50 },
    consequences: [consequenceSchema],
    agentPositions: [agentFinalPositionSchema],
    keyDebateMoments: [{ type: String }],
  },
  { timestamps: true }
);

verdictSchema.index({ decision: 1, createdAt: -1 });

export default mongoose.model('Verdict', verdictSchema);
