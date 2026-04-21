const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const Member = require('../models/Member');

// POST /api/admin/login
router.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '8h' });
    return res.json({ token });
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

// POST /api/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const member = await Member.findOne({ email: String(email).toLowerCase().trim() });
    if (!member) return res.status(401).json({ error: 'Invalid credentials' });

    let valid = false;

    // Backward-compatible fallback for legacy members that do not yet have a password.
    if (member.passwordHash) {
      valid = await bcrypt.compare(password, member.passwordHash);
    } else {
      valid = member.phone === password;
    }

    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { role: 'member', memberId: member._id, email: member.email, name: member.name },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    return res.json({
      token,
      user: { role: 'member', memberId: member._id, name: member.name, email: member.email },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Login failed' });
  }
});

module.exports = router;
