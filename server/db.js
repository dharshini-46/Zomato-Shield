// In-memory mock database
const db = {
  users: [],
  policies: [],
  claims: [],
  payouts: [],
  triggers: [],

  cityRiskProfiles: {
    mumbai:    { rain: 0.8, heat: 0.5, aqi: 0.6, baseRisk: 0.7 },
    delhi:     { rain: 0.4, heat: 0.7, aqi: 0.9, baseRisk: 0.75 },
    bangalore: { rain: 0.6, heat: 0.4, aqi: 0.4, baseRisk: 0.45 },
    chennai:   { rain: 0.7, heat: 0.8, aqi: 0.5, baseRisk: 0.65 },
    hyderabad: { rain: 0.5, heat: 0.7, aqi: 0.5, baseRisk: 0.55 },
    kolkata:   { rain: 0.7, heat: 0.6, aqi: 0.7, baseRisk: 0.65 },
    pune:      { rain: 0.6, heat: 0.5, aqi: 0.5, baseRisk: 0.50 },
    jaipur:    { rain: 0.3, heat: 0.9, aqi: 0.6, baseRisk: 0.60 },
    ahmedabad: { rain: 0.3, heat: 0.8, aqi: 0.6, baseRisk: 0.55 },
    lucknow:   { rain: 0.4, heat: 0.7, aqi: 0.8, baseRisk: 0.65 },
  },

  // Mock weather data per city (updated on trigger simulation)
  weatherData: {
    mumbai:    { rainfall: 30, temperature: 33, aqi: 180 },
    delhi:     { rainfall: 10, temperature: 38, aqi: 280 },
    bangalore: { rainfall: 15, temperature: 29, aqi: 120 },
    chennai:   { rainfall: 25, temperature: 36, aqi: 150 },
    hyderabad: { rainfall: 12, temperature: 35, aqi: 160 },
    kolkata:   { rainfall: 28, temperature: 34, aqi: 200 },
    pune:      { rainfall: 20, temperature: 31, aqi: 140 },
    jaipur:    { rainfall: 5,  temperature: 42, aqi: 190 },
    ahmedabad: { rainfall: 8,  temperature: 40, aqi: 175 },
    lucknow:   { rainfall: 12, temperature: 37, aqi: 250 },
  }
};

module.exports = db;
