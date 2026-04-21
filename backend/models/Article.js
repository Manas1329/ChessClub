const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  body:     { type: String, required: true },
  fullBody: { type: String, default: '' },
  type:     { type: String, enum: ['news', 'event', 'puzzle', 'workshop', 'achievement', 'strategy'], default: 'news' },
  imageUrl: { type: String, default: '' },
  meta:     { type: String, default: '' }, // e.g. "April 20, 2025 • Club Events"
  featured: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Article', articleSchema);
