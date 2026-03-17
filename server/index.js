const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const policyRoutes = require('./routes/policy');
const triggerRoutes = require('./routes/triggers');
const claimRoutes = require('./routes/claims');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/policy', policyRoutes);
app.use('/api/triggers', triggerRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Zomato Shield API', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🛡️  Zomato Shield API running on http://localhost:${PORT}`);
});
