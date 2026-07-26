const mongoose = require('mongoose');

const rankingSchema = new mongoose.Schema({
  indicator: { type: mongoose.Schema.Types.ObjectId, ref: 'Indicator', required: true },
  country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true },
  year: { type: Number, required: true },
  rank: { type: Number },
  score: { type: Number },
  totalCountries: { type: Number }
});

// Compound unique index
rankingSchema.index({ indicator: 1, country: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Ranking', rankingSchema);
