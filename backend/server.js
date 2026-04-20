require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// Routes
app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/members'));
app.use('/api', require('./routes/articles'));
app.use('/api', require('./routes/events'));
app.use('/api', require('./routes/products'));
app.use('/api', require('./routes/gallery'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
