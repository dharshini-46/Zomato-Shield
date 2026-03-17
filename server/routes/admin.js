const express = require('express');
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/admin/stats
router.get('/stats', authMiddleware, (req, res) => {
  const totalUsers = db.users.length;
  const totalClaims = db.claims.length;
  const approvedClaims = db.claims.filter((c) => c.status === 'approved').length;
  const rejectedClaims = db.claims.filter((c) => c.status === 'rejected').length;
  const totalPayouts = db.payouts.reduce((sum, p) => sum + p.amount, 0);
  const activePolicies = db.policies.filter((p) => p.status === 'active').length;

  // Risk analytics by city
  const cityClaims = {};
  db.claims.forEach((c) => {
    const user = db.users.find((u) => u.id === c.userId);
    if (user) {
      const city = user.city;
      if (!cityClaims[city]) cityClaims[city] = { total: 0, approved: 0, rejected: 0, totalPayout: 0 };
      cityClaims[city].total++;
      if (c.status === 'approved') cityClaims[city].approved++;
      if (c.status === 'rejected') cityClaims[city].rejected++;
    }
  });

  // Add payout amounts per city
  db.payouts.forEach((p) => {
    const claim = db.claims.find((c) => c.id === p.claimId);
    if (claim) {
      const user = db.users.find((u) => u.id === claim.userId);
      if (user && cityClaims[user.city]) {
        cityClaims[user.city].totalPayout += p.amount;
      }
    }
  });

  // Trigger type distribution
  const triggerDist = {};
  db.claims.forEach((c) => {
    const key = c.triggerType || 'unknown';
    triggerDist[key] = (triggerDist[key] || 0) + 1;
  });

  res.json({
    totalUsers,
    totalClaims,
    approvedClaims,
    rejectedClaims,
    totalPayouts,
    activePolicies,
    cityClaims,
    triggerDistribution: triggerDist,
  });
});

// GET /api/admin/claims — all claims for admin
router.get('/claims', authMiddleware, (req, res) => {
  const claims = db.claims
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((claim) => {
      const user = db.users.find((u) => u.id === claim.userId);
      const payout = db.payouts.find((p) => p.claimId === claim.id);
      return {
        ...claim,
        userName: user ? user.name : 'Unknown',
        userCity: user ? user.city : 'Unknown',
        payout: payout || null,
      };
    });

  res.json({ claims });
});

module.exports = router;
