const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

exports.loginAdmin = async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  if (!admin || !(await admin.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token });
};

exports.createAdmin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const newAdmin = new Admin({ username, password });
    await newAdmin.save();
    res.status(201).json({ message: 'Admin created' });
  } catch {
    res.status(400).json({ message: 'Username exists or error' });
  }
};
