const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true }, // ISO-3166-1 alpha-3
  region: { type: String },
  flagUrl: { type: String }
});

module.exports = mongoose.model('Country', countrySchema);
