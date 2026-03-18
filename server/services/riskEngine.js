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

  // Generate explainability string based on primary risk factors
  let primaryRisk = [];
  if (profile.rain > 0.6) primaryRisk.push("heavy rainfall");
  if (profile.heat > 0.6) primaryRisk.push("extreme heat");
  if (profile.aqi > 0.6) primaryRisk.push("poor air quality");
  const reasonText = primaryRisk.length > 0 
    ? `Your premium is ₹${premium} because your area has high risks for ${primaryRisk.join(' and ')}.`
    : `Your premium is ₹${premium} based on a standard risk profile for your area.`;

  return {
    premium,
    message: reasonText,
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
  // Determine hours effectively lost due to the disaster severity
  const lostHoursMap = {
    heavy_rain: Math.min(workingHours, 6),  // e.g. 6 hours unable to deliver
    high_temp:  Math.min(workingHours, 4),  // e.g. 4 hours afternoon heat blocked
    poor_aqi:   Math.min(workingHours, 5),  // e.g. 5 hours smog blocked
  };

  const hoursLost = lostHoursMap[triggerType] || 4;
  
  // Calculate exact hourly rate
  const hourlyIncome = avgDailyIncome / workingHours;
  
  // Total projected loss
  const totalLoss = Math.round(hourlyIncome * hoursLost);
  
  return {
    totalLoss,
    hoursLost,
    hourlyIncome: Math.round(hourlyIncome)
  };
}

/**
 * Predictive Intelligence Mock
 * Forecast 24-hour future risk and calculate estimated vulnerability.
 */
function predictNextDayRisk(city, avgDailyIncome, workingHours) {
  const cityKey = city.toLowerCase();
  const profile = db.cityRiskProfiles[cityKey];
  
  if (!profile) return null;

  // Add some randomness to predict tomorrow
  const mockPredictions = [
    { type: 'heavy_rain', risk: profile.rain + Math.random()*0.3, label: "Heavy Rain", impactFactor: 6 },
    { type: 'high_temp', risk: profile.heat + Math.random()*0.3, label: "High Temperature", impactFactor: 4 },
    { type: 'poor_aqi', risk: profile.aqi + Math.random()*0.3, label: "Poor AQI", impactFactor: 5 }
  ];
  
  // Find highest risk
  mockPredictions.sort((a,b) => b.risk - a.risk);
  const topRisk = mockPredictions[0];
  
  if (topRisk.risk > 0.65) {
    const hourlyIncome = avgDailyIncome / workingHours;
    const estLoss = Math.round(hourlyIncome * topRisk.impactFactor);
    return {
      alert: true,
      message: `High chance of ${topRisk.label.toLowerCase()} tomorrow. Estimated income loss ₹${estLoss}.`,
      suggestion: `Increase your coverage for tomorrow`,
      estLoss
    };
  }
  
  return { alert: false, message: "Weather looks clear tomorrow. Safe deliveries!", suggestion: "" };
}

module.exports = { calculatePremium, calculateIncomeLoss, predictNextDayRisk };
