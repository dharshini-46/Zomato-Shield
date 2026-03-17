const db = require('../db');

/**
 * Fraud Detection Engine
 * Simulates three fraud checks:
 *   1. GPS Mismatch — random 5% chance
 *   2. Duplicate Claims — checks if same user + same trigger type in last 24h
 *   3. Unreal Working Hours — flags if reported hours > 16
 */
function runFraudChecks(userId, triggerType, user) {
  const checks = [];
  let fraudDetected = false;

  // 1. GPS Mismatch (simulated — 5% random flag)
  const gpsMismatch = Math.random() < 0.05;
  checks.push({
    check: 'GPS Location Verification',
    passed: !gpsMismatch,
    detail: gpsMismatch
      ? 'GPS location does not match registered city'
      : 'GPS location verified — matches registered city',
  });
  if (gpsMismatch) fraudDetected = true;

  // 2. Duplicate Claims
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const duplicate = db.claims.some(
    (c) =>
      c.userId === userId &&
      c.triggerType === triggerType &&
      c.createdAt > oneDayAgo
  );
  checks.push({
    check: 'Duplicate Claim Detection',
    passed: !duplicate,
    detail: duplicate
      ? 'A claim for this trigger type was already filed in the last 24 hours'
      : 'No duplicate claims found within 24-hour window',
  });
  if (duplicate) fraudDetected = true;

  // 3. Unreal Working Hours
  const unrealHours = user.workingHours > 16;
  checks.push({
    check: 'Working Hours Validation',
    passed: !unrealHours,
    detail: unrealHours
      ? `Reported ${user.workingHours} hrs/day exceeds realistic threshold (16 hrs)`
      : `Reported ${user.workingHours} hrs/day is within acceptable range`,
  });
  if (unrealHours) fraudDetected = true;

  return { fraudDetected, checks };
}

module.exports = { runFraudChecks };
