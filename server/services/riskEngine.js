const db = require('../db');

/**
 * AI Risk Engine
 * Calculates weekly premium based on city risk profile and worker parameters.
 * Premium range: ₹10 – ₹50
 */
function calculatePremium(city, avgDailyIncome, workingHours) {
  const cityKey = city.toLowerCase();
  const profile = db.cityRiskProfiles[cityKey];
  if (!profile) {
    // Default moderate risk for unknown cities
    return { premium: 25, riskScore: 0.5, factors: { rain: 0.5, heat: 0.5, aqi: 0.5 } };
  }

  // Weighted risk score
  const riskScore = (
    profile.rain * 0.3 +
    profile.heat * 0.3 +
    profile.aqi * 0.25 +
    profile.baseRisk * 0.15
  );

  // Working hours modifier (more hours = higher risk)
  const hoursModifier = Math.min(workingHours / 12, 1.0);

  // Income modifier (higher income = higher coverage needed = slightly higher premium)
  const incomeModifier = Math.min(avgDailyIncome / 1000, 1.0);

  // Final premium: base 10 + risk-based portion (0–40)
  const rawPremium = 10 + (riskScore * 0.6 + hoursModifier * 0.25 + incomeModifier * 0.15) * 40;
  const premium = Math.round(Math.min(Math.max(rawPremium, 10), 50));

  return {
    premium,
    riskScore: Math.round(riskScore * 100) / 100,
    factors: {
      rain: profile.rain,
      heat: profile.heat,
      aqi: profile.aqi,
    },
    weather: db.weatherData[cityKey] || null,
  };
}

/**
 * Calculate income loss for a given trigger
 */
function calculateIncomeLoss(triggerType, avgDailyIncome, workingHours) {
  const lossFactors = {
    heavy_rain: 0.7,  // 70% income loss on heavy rain day
    high_temp:  0.5,  // 50% income loss on extreme heat day
    poor_aqi:   0.6,  // 60% income loss on poor AQI day
  };

  const factor = lossFactors[triggerType] || 0.5;
  // Loss for affected days (assume 2 days affected per trigger event)
  const dailyLoss = avgDailyIncome * factor;
  const totalLoss = Math.round(dailyLoss * 2);
  return totalLoss;
}

module.exports = { calculatePremium, calculateIncomeLoss };
