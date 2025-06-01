const Question = require('../models/Question');

exports.addQuestion = async (req, res) => {
  const { subject, chapter, question, options, correct } = req.body;
  const q = new Question({ subject, chapter, question, options, correct });
  await q.save();
  res.status(201).json({ message: 'Added' });
};

exports.getQuestionsBySubjectAndChapter = async (req, res) => {
  const questions = await Question.find(req.query);
  res.json(questions);
};

exports.deleteQuestion = async (req, res) => {
  await Question.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};

exports.updateQuestion = async (req, res) => {
  await Question.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: 'Updated' });
};
