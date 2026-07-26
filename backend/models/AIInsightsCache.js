const mongoose = require('mongoose');

const aiInsightsCacheSchema = new mongoose.Schema({
  scope: { type: String, required: true }, // 'global' | category slug | indicator slug
  content: { type: String, required: true },
  recommendations: [{ type: String }],
  generatedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }
});

aiInsightsCacheSchema.index({ scope: 1, expiresAt: 1 });

module.exports = mongoose.model('AIInsightsCache', aiInsightsCacheSchema);
