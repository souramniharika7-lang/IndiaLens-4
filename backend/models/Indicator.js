const mongoose = require('mongoose');

const indicatorSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  methodology: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  source: {
    name: { type: String },
    url: { type: String }
  },
  unit: { type: String },
  higherIsBetter: { type: Boolean, default: true }
});

// Text index for search
indicatorSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Indicator', indicatorSchema);
