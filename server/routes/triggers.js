const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');
const { calculateIncomeLoss } = require('../services/riskEngine');
const { runFraudChecks } = require('../services/fraudDetection');

const router = express.Router();

const TRIGGER_THRESHOLDS = {
  heavy_rain: { field: 'rainfall', threshold: 50, unit: 'mm', label: 'Heavy Rain (>50mm)' },
  high_temp:  { field: 'temperature', threshold: 40, unit: '°C', label: 'High Temperature (>40°C)' },
  poor_aqi:   { field: 'aqi', threshold: 300, unit: 'AQI', label: 'Poor AQI (>300)' },
};

// POST /api/triggers/simulate — simulate a parametric trigger
router.post('/simulate', authMiddleware, (req, res) => {
  const { triggerType } = req.body;

  if (!triggerType || !TRIGGER_THRESHOLDS[triggerType]) {
    return res.status(400).json({
      error: 'Invalid trigger type. Must be one of: heavy_rain, high_temp, poor_aqi',
    });
  }

  const user = db.users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });

  // Check active policy
  const policy = db.policies.find(
    (p) => p.userId === user.id && p.status === 'active'
  );
  if (!policy) {
    return res.status(400).json({ error: 'No active policy found. Please subscribe first.' });
  }

  const triggerConfig = TRIGGER_THRESHOLDS[triggerType];
  const cityKey = user.city.toLowerCase();

  // Simulate weather event — set the value above threshold
  const simulatedValues = {
    heavy_rain: { rainfall: 55 + Math.floor(Math.random() * 40) },
    high_temp:  { temperature: 41 + Math.floor(Math.random() * 8) },
    poor_aqi:   { aqi: 310 + Math.floor(Math.random() * 150) },
  };

  // Update mock weather
  if (db.weatherData[cityKey]) {
    Object.assign(db.weatherData[cityKey], simulatedValues[triggerType]);
  }

  const currentValue = simulatedValues[triggerType][triggerConfig.field];

  // 1. Strict Parametric Validation
  const conditionMet = currentValue > triggerConfig.threshold;

  // Run fraud checks (only relevant if condition met, but we can run it anyway to log)
  const fraudResult = runFraudChecks(user.id, triggerType, user);

  // Calculate income loss
  const lossDetails = calculateIncomeLoss(triggerType, user.avgDailyIncome, user.workingHours);
  const incomeLoss = lossDetails.totalLoss;
  // Create trigger record
  const trigger = {
    id: uuidv4(),
    userId: user.id,
    type: triggerType,
    label: triggerConfig.label,
    value: currentValue,
    threshold: triggerConfig.threshold,
    unit: triggerConfig.unit,
    city: user.city,
    createdAt: Date.now(),
  };
  db.triggers.push(trigger);

  // If fraud detected, reject
  if (fraudResult.fraudDetected) {
    const claim = {
      id: uuidv4(),
      userId: user.id,
      policyId: policy.id,
      triggerId: trigger.id,
      triggerType,
      triggerLabel: triggerConfig.label,
      incomeLoss,
      status: 'rejected',
      fraudChecks: fraudResult.checks,
      reason: 'Fraud detected',
      createdAt: Date.now(),
    };
    db.claims.push(claim);

    return res.json({
      trigger,
      claim,
      payout: null,
      message: '⚠️ Claim rejected due to fraud detection.',
      fraudChecks: fraudResult.checks,
      currentValue,
      threshold: triggerConfig.threshold
    });
  }

  // If condition not met, reject
  if (!conditionMet) {
    const claim = {
      id: uuidv4(),
      userId: user.id,
      policyId: policy.id,
      triggerId: trigger.id,
      triggerType,
      triggerLabel: triggerConfig.label,
      incomeLoss: 0,
      status: 'rejected',
      fraudChecks: fraudResult.checks,
      reason: 'Threshold not met',
      createdAt: Date.now(),
    };
    db.claims.push(claim);

    return res.json({
      trigger,
      claim,
      payout: null,
      message: `Condition not met (${currentValue}${triggerConfig.unit} vs required >${triggerConfig.threshold}${triggerConfig.unit}). No payout.`,
      fraudChecks: fraudResult.checks,
      currentValue,
      threshold: triggerConfig.threshold
    });
  }

  // Auto-approve claim
  const claim = {
    id: uuidv4(),
    userId: user.id,
    policyId: policy.id,
    triggerId: trigger.id,
    triggerType,
    triggerLabel: triggerConfig.label,
    incomeLoss,
    status: 'approved',
    fraudChecks: fraudResult.checks,
    createdAt: Date.now(),
  };
  db.claims.push(claim);

  // Instant payout
  const payout = {
    id: uuidv4(),
    userId: user.id,
    claimId: claim.id,
    amount: incomeLoss,
    method: 'UPI',
    upiId: `${user.name.toLowerCase().replace(/\s/g, '')}@upi`,
    status: 'credited',
    createdAt: Date.now(),
  };
  db.payouts.push(payout);

  res.json({
    trigger,
    claim,
    payout,
    lossDetails,
    currentValue,
    threshold: triggerConfig.threshold,
    message: `✅ Claim approved! You lost ${lossDetails.hoursLost} hours today. ₹${incomeLoss} credited to your UPI account.`,
    fraudChecks: fraudResult.checks,
  });
});

// GET /api/triggers/types
router.get('/types', (req, res) => {
  res.json(
    Object.entries(TRIGGER_THRESHOLDS).map(([key, val]) => ({
      id: key,
      label: val.label,
      threshold: val.threshold,
      unit: val.unit,
    }))
  );
});

module.exports = router;
