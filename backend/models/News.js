const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  headline: { type: String, required: true },
  summary: { type: String },
  content: { type: String },
  sourceUrl: { type: String },
  sourceName: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  publishedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('News', newsSchema);
