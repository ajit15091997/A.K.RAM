const express = require('express');
const { loginAdmin, createAdmin } = require('../controllers/adminController');
const router = express.Router();
router.post('/login', loginAdmin);
router.post('/register', createAdmin); // Optional: First time only
module.exports = router;
