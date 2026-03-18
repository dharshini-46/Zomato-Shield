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

  // 1. Multiple claims in same day (Max 2 allowed per day context)
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const recentClaims = db.claims.filter(c => c.userId === userId && c.createdAt > oneDayAgo);
  
  const tooManyClaims = recentClaims.length >= 2;
  checks.push({
    check: 'Abnormal Claim Volume',
    passed: !tooManyClaims,
    detail: tooManyClaims
      ? `Suspicious activity detected: User has already filed ${recentClaims.length} claims in the last 24 hours.`
      : 'Claim frequency within normal bounds.'
  });
  if (tooManyClaims) fraudDetected = true;

  // 2. Duplicate Claims for same condition
  const duplicate = recentClaims.some(c => c.triggerType === triggerType);
  checks.push({
    check: 'Duplicate Condition Prevention',
    passed: !duplicate,
    detail: duplicate
      ? 'Suspicious activity detected: A claim for this exact condition was already filed today.'
      : 'Condition verified as a unique unhandled event.'
  });
  if (duplicate) fraudDetected = true;

  // 3. Unreal Working Hours
  const unrealHours = user.workingHours > 16 || user.workingHours <= 0;
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
