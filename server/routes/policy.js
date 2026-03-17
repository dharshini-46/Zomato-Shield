const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');
const { calculatePremium } = require('../services/riskEngine');

const router = express.Router();

// GET /api/policy/premium — calculate premium for current user
router.get('/premium', authMiddleware, (req, res) => {
  const user = db.users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });

  const result = calculatePremium(user.city, user.avgDailyIncome, user.workingHours);
  res.json(result);
});

// POST /api/policy/subscribe — subscribe to weekly plan
router.post('/subscribe', authMiddleware, (req, res) => {
  const user = db.users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });

  // Check if user already has an active policy
  const activePolicy = db.policies.find(
    (p) => p.userId === user.id && p.status === 'active'
  );
  if (activePolicy) {
    return res.status(400).json({ error: 'You already have an active policy.', policy: activePolicy });
  }

  const { premium } = calculatePremium(user.city, user.avgDailyIncome, user.workingHours);

  const policy = {
    id: uuidv4(),
    userId: user.id,
    city: user.city,
    weeklyPremium: premium,
    status: 'active',
    startDate: Date.now(),
    endDate: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 week
    createdAt: Date.now(),
  };

  db.policies.push(policy);
  res.status(201).json({ message: 'Policy activated successfully!', policy });
});

// GET /api/policy/active — get current active policy
router.get('/active', authMiddleware, (req, res) => {
  const policy = db.policies.find(
    (p) => p.userId === req.user.id && p.status === 'active'
  );
  if (!policy) {
    return res.json({ policy: null });
  }
  res.json({ policy });
});

module.exports = router;
