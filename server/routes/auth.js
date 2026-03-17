const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, city, avgDailyIncome, workingHours } = req.body;

    if (!name || !email || !password || !city || !avgDailyIncome || !workingHours) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Check if user already exists
    const existing = db.users.find((u) => u.email === email);
    if (existing) {
      return res.status(409).json({ error: 'User with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      city: city.toLowerCase(),
      avgDailyIncome: Number(avgDailyIncome),
      workingHours: Number(workingHours),
      role: 'worker', // 'worker' or 'admin'
      createdAt: Date.now(),
    };

    db.users.push(user);

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, city: user.city, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = db.users.find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, city: user.city, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/auth/me
router.get('/me', require('../middleware/auth').authMiddleware, (req, res) => {
  const user = db.users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    city: user.city,
    avgDailyIncome: user.avgDailyIncome,
    workingHours: user.workingHours,
    role: user.role,
  });
});

module.exports = router;
