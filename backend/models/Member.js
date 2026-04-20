const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  phone:     { type: String, required: true },
  age:       { type: Number, required: true },
  eloRating: { type: Number, default: 1200 },
  paid:      { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);
