const mongoose = require('mongoose');

const historicalDataSchema = new mongoose.Schema({
  indicator: { type: mongoose.Schema.Types.ObjectId, ref: 'Indicator', required: true },
  country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true },
  dataPoints: [{
    year: { type: Number, required: true },
    rank: { type: Number },
    score: { type: Number }
  }]
});

// Compound unique index
historicalDataSchema.index({ indicator: 1, country: 1 }, { unique: true });

module.exports = mongoose.model('HistoricalData', historicalDataSchema);
