const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const auth = require('../middleware/auth');

// POST /api/register — public
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, age } = req.body;
    const existing = await Member.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const member = await Member.create({ name, email, phone, age });
    res.status(201).json(member);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/members — public (leaderboard: sorted by ELO)
router.get('/members', async (req, res) => {
  try {
    const members = await Member.find().sort({ eloRating: -1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/members/:id — admin: update ELO / paid status
router.patch('/members/:id', auth, async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json(member);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/members/:id — admin
router.delete('/members/:id', auth, async (req, res) => {
  try {
    await Member.findByIdAndDelete(req.params.id);
    res.json({ message: 'Member deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
