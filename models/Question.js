const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  chapter: { type: String, required: true },
  question: { type: String, required: true },
  options: [{ type: String }],
  correct: { type: String }
});

module.exports = mongoose.model('Question', questionSchema);
