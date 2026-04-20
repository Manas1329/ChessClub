const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const auth = require('../middleware/auth');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const uploadDir = path.join(__dirname, '..', 'uploads', 'articles');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const safeName = `${Date.now()}-${file.originalname}`.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, safeName);
  },
});

const upload = multer({ storage });

function getImageUrl(req) {
  if (!req.file) return req.body.imageUrl || '';
  return `/uploads/articles/${req.file.filename}`;
}

// GET /api/articles — public
router.get('/articles', async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/articles — admin
router.post('/articles', auth, upload.single('imageFile'), async (req, res) => {
  try {
    const article = await Article.create({
      ...req.body,
      imageUrl: getImageUrl(req),
      featured: req.body.featured === 'true' || req.body.featured === true,
    });
    res.status(201).json(article);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/articles/:id — admin
router.put('/articles/:id', auth, upload.single('imageFile'), async (req, res) => {
  try {
    const update = {
      ...req.body,
      imageUrl: req.file ? getImageUrl(req) : req.body.imageUrl,
      featured: req.body.featured === 'true' || req.body.featured === true,
    };
    const article = await Article.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json(article);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/articles/:id — admin
router.delete('/articles/:id', auth, async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: 'Article deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
