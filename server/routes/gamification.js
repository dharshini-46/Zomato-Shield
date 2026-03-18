const express = require('express');
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/gamification/status
router.get('/status', authMiddleware, (req, res) => {
  const userId = req.user.id;
  const user = db.users.find(u => u.id === userId);
  
  if (!user) return res.status(404).json({ error: 'User not found' });

  // Calculate if they had any claims in the last 7 days
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recentClaims = db.claims.filter(
    (c) => c.userId === userId && c.status === 'approved' && c.createdAt > sevenDaysAgo
  );

  let bonus = 0;
  let badges = [];

  if (recentClaims.length === 0) {
    bonus = 20; // ₹20 bonus for no claims
    badges.push({ id: 'safe_performer', icon: '⭐', label: 'Safe Performer' });
  }

  // Award Low Risk Hero badge if user city risk is < 30% average across all factors
  const cityKey = user.city.toLowerCase();
  if (db.cityRiskProfiles[cityKey]) {
    const cp = db.cityRiskProfiles[cityKey];
    if ((cp.rain + cp.heat + cp.aqi) / 3 < 0.4) {
      badges.push({ id: 'low_risk_hero', icon: '🦸‍♂️', label: 'Low Risk Hero' });
    }
  }

  res.json({
    bonus,
    badges,
    recentClaimsCount: recentClaims.length
  });
});

module.exports = router;
