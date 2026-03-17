const express = require('express');
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/claims — list claims for current user
router.get('/', authMiddleware, (req, res) => {
  const claims = db.claims
    .filter((c) => c.userId === req.user.id)
    .sort((a, b) => b.createdAt - a.createdAt);

  // Attach payout info
  const claimsWithPayouts = claims.map((claim) => {
    const payout = db.payouts.find((p) => p.claimId === claim.id);
    return { ...claim, payout: payout || null };
  });

  res.json({ claims: claimsWithPayouts });
});

module.exports = router;
