import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch, getUser } from '../api';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getUser();
  const [premium, setPremium] = useState(null);
  const [policy, setPolicy] = useState(null);
  const [claims, setClaims] = useState([]);
  const [triggerResult, setTriggerResult] = useState(null);
  const [loading, setLoading] = useState({ page: true, subscribe: false, trigger: false });
  const [selectedTrigger, setSelectedTrigger] = useState('heavy_rain');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    loadData();
  }, []);

  const loadData = useCallback(async () => {
    try {
      const [premData, polData, clData] = await Promise.all([
        apiFetch('/policy/premium'),
        apiFetch('/policy/active'),
        apiFetch('/claims'),
      ]);
      setPremium(premData);
      setPolicy(polData.policy);
      setClaims(clData.claims);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(prev => ({ ...prev, page: false }));
    }
  }, []);

  const handleSubscribe = async () => {
    setLoading(prev => ({ ...prev, subscribe: true }));
    try {
      const data = await apiFetch('/policy/subscribe', { method: 'POST' });
      setPolicy(data.policy);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(prev => ({ ...prev, subscribe: false }));
    }
  };

  const handleTrigger = async () => {
    setLoading(prev => ({ ...prev, trigger: true }));
    setTriggerResult(null);
    try {
      const data = await apiFetch('/triggers/simulate', {
        method: 'POST',
        body: JSON.stringify({ triggerType: selectedTrigger }),
      });
      setTriggerResult(data);
      // Refresh claims
      const clData = await apiFetch('/claims');
      setClaims(clData.claims);
    } catch (e) {
      setTriggerResult({ message: '❌ ' + e.message });
    } finally {
      setLoading(prev => ({ ...prev, trigger: false }));
    }
  };

  if (loading.page) {
    return <div className="page-loader"><div className="spinner-lg"></div></div>;
  }

  const triggerLabels = {
    heavy_rain: { icon: '🌧️', label: 'Heavy Rain (>50mm)', color: '#3b82f6' },
    high_temp: { icon: '🔥', label: 'High Temp (>40°C)', color: '#ef4444' },
    poor_aqi: { icon: '💨', label: 'Poor AQI (>300)', color: '#a855f7' },
  };

  return (
    <div className="dashboard">
      {/* Welcome Section */}
      <div className="welcome-banner">
        <div className="welcome-text">
          <h1>Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
          <p>City: <strong>{user?.city}</strong> &nbsp;·&nbsp; Your insurance at a glance</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="stats-row">
        <div className="stat-card stat-premium">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <span className="stat-value">₹{premium?.premium || '--'}</span>
            <span className="stat-label">Weekly Premium</span>
          </div>
        </div>
        <div className="stat-card stat-risk">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <span className="stat-value">{premium?.riskScore ? (premium.riskScore * 100).toFixed(0) + '%' : '--'}</span>
            <span className="stat-label">Risk Score</span>
          </div>
        </div>
        <div className="stat-card stat-claims">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <span className="stat-value">{claims.length}</span>
            <span className="stat-label">Total Claims</span>
          </div>
        </div>
        <div className="stat-card stat-payouts">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <span className="stat-value">{claims.filter(c => c.status === 'approved').length}</span>
            <span className="stat-label">Approved</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Left Column */}
        <div className="dashboard-col">
          {/* Policy Card */}
          <div className="card">
            <div className="card-header">
              <h2>🛡️ Active Policy</h2>
              <span className={`badge ${policy ? 'badge-success' : 'badge-warning'}`}>
                {policy ? 'Active' : 'No Policy'}
              </span>
            </div>
            <div className="card-body">
              {policy ? (
                <div className="policy-details">
                  <div className="policy-row"><span>Policy ID</span><span className="mono">{policy.id.slice(0, 8)}...</span></div>
                  <div className="policy-row"><span>Weekly Premium</span><span className="text-bold">₹{policy.weeklyPremium}</span></div>
                  <div className="policy-row"><span>Start Date</span><span>{new Date(policy.startDate).toLocaleDateString('en-IN')}</span></div>
                  <div className="policy-row"><span>End Date</span><span>{new Date(policy.endDate).toLocaleDateString('en-IN')}</span></div>
                  <div className="policy-row"><span>Status</span><span className="badge badge-success">Active</span></div>
                </div>
              ) : (
                <div className="no-policy">
                  <p>You don't have an active policy yet.</p>
                  <p className="text-muted">Weekly premium: <strong>₹{premium?.premium}</strong></p>
                  <button className="btn btn-primary" onClick={handleSubscribe} disabled={loading.subscribe}>
                    {loading.subscribe ? <span className="spinner"></span> : '🔒 Subscribe Now'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Risk Factors */}
          {premium?.factors && (
            <div className="card">
              <div className="card-header"><h2>🌍 Risk Factors</h2></div>
              <div className="card-body">
                <div className="risk-bars">
                  <div className="risk-bar-item">
                    <span className="risk-label">🌧️ Rain Risk</span>
                    <div className="risk-bar"><div className="risk-fill rain" style={{ width: `${premium.factors.rain * 100}%` }}></div></div>
                    <span className="risk-pct">{(premium.factors.rain * 100).toFixed(0)}%</span>
                  </div>
                  <div className="risk-bar-item">
                    <span className="risk-label">🔥 Heat Risk</span>
                    <div className="risk-bar"><div className="risk-fill heat" style={{ width: `${premium.factors.heat * 100}%` }}></div></div>
                    <span className="risk-pct">{(premium.factors.heat * 100).toFixed(0)}%</span>
                  </div>
                  <div className="risk-bar-item">
                    <span className="risk-label">💨 AQI Risk</span>
                    <div className="risk-bar"><div className="risk-fill aqi" style={{ width: `${premium.factors.aqi * 100}%` }}></div></div>
                    <span className="risk-pct">{(premium.factors.aqi * 100).toFixed(0)}%</span>
                  </div>
                </div>
                {premium.weather && (
                  <div className="weather-current">
                    <h3>Current Conditions</h3>
                    <div className="weather-items">
                      <span>🌧️ {premium.weather.rainfall}mm</span>
                      <span>🌡️ {premium.weather.temperature}°C</span>
                      <span>💨 AQI {premium.weather.aqi}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="dashboard-col">
          {/* Trigger Simulator */}
          <div className="card card-highlight">
            <div className="card-header"><h2>⚡ Trigger Simulator</h2></div>
            <div className="card-body">
              <p className="text-muted">Simulate a weather event to test parametric triggers.</p>
              <div className="trigger-buttons">
                {Object.entries(triggerLabels).map(([key, t]) => (
                  <button
                    key={key}
                    className={`trigger-btn ${selectedTrigger === key ? 'selected' : ''}`}
                    style={{ '--btn-color': t.color }}
                    onClick={() => setSelectedTrigger(key)}
                  >
                    <span className="trigger-icon">{t.icon}</span>
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
              <button className="btn btn-danger btn-block" onClick={handleTrigger} disabled={loading.trigger || !policy}>
                {loading.trigger ? <span className="spinner"></span> : '🚨 Simulate Trigger'}
              </button>
              {!policy && <p className="text-muted text-sm">Subscribe to a policy first</p>}

              {triggerResult && (
                <div className={`trigger-result ${triggerResult.claim?.status === 'approved' ? 'result-success' : triggerResult.claim?.status === 'rejected' ? 'result-error' : 'result-info'}`}>
                  <p className="result-msg">{triggerResult.message}</p>
                  {triggerResult.payout && (
                    <div className="payout-card">
                      <span className="payout-icon">💸</span>
                      <div>
                        <div className="payout-amount">₹{triggerResult.payout.amount} credited</div>
                        <div className="payout-method">via {triggerResult.payout.method} • {triggerResult.payout.upiId}</div>
                      </div>
                    </div>
                  )}
                  {triggerResult.fraudChecks && (
                    <div className="fraud-checks">
                      <h4>🔍 Fraud Detection Results</h4>
                      {triggerResult.fraudChecks.map((fc, i) => (
                        <div key={i} className={`fraud-check-item ${fc.passed ? 'passed' : 'failed'}`}>
                          <span className="fc-icon">{fc.passed ? '✅' : '❌'}</span>
                          <div>
                            <div className="fc-name">{fc.check}</div>
                            <div className="fc-detail">{fc.detail}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Claims History */}
          <div className="card">
            <div className="card-header"><h2>📜 Claims History</h2></div>
            <div className="card-body">
              {claims.length === 0 ? (
                <p className="text-muted text-center">No claims yet. Simulate a trigger to create one!</p>
              ) : (
                <div className="claims-list">
                  {claims.map((claim) => (
                    <div key={claim.id} className={`claim-item ${claim.status}`}>
                      <div className="claim-top">
                        <span className="claim-type">{triggerLabels[claim.triggerType]?.icon} {claim.triggerLabel}</span>
                        <span className={`badge ${claim.status === 'approved' ? 'badge-success' : 'badge-error'}`}>
                          {claim.status}
                        </span>
                      </div>
                      <div className="claim-bottom">
                        <span>Loss: ₹{claim.incomeLoss}</span>
                        {claim.payout && <span className="text-success">Paid: ₹{claim.payout.amount}</span>}
                        <span className="text-muted">{new Date(claim.createdAt).toLocaleDateString('en-IN')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
