const express = require('express');
const {
  addQuestion, getQuestionsBySubjectAndChapter,
  deleteQuestion, updateQuestion
} = require('../controllers/quizController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getQuestionsBySubjectAndChapter);
router.post('/', auth, addQuestion);
router.put('/:id', auth, updateQuestion);
router.delete('/:id', auth, deleteQuestion);

module.exports = router;
