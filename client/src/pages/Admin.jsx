import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch, getUser } from '../api';

export default function Admin() {
  const navigate = useNavigate();
  const user = getUser();
  const [stats, setStats] = useState(null);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    loadAdmin();
  }, []);

  const loadAdmin = async () => {
    try {
      const [sData, cData] = await Promise.all([
        apiFetch('/admin/stats'),
        apiFetch('/admin/claims'),
      ]);
      setStats(sData);
      setClaims(cData.claims);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="page-loader"><div className="spinner-lg"></div></div>;
  }

  const maxCityClaims = stats?.cityClaims
    ? Math.max(...Object.values(stats.cityClaims).map((c) => c.total), 1)
    : 1;

  const triggerColors = {
    heavy_rain: '#3b82f6',
    high_temp: '#ef4444',
    poor_aqi: '#a855f7',
  };
  const triggerLabels = {
    heavy_rain: '🌧️ Rain',
    high_temp: '🔥 Heat',
    poor_aqi: '💨 AQI',
  };
  const totalTriggers = stats?.triggerDistribution
    ? Object.values(stats.triggerDistribution).reduce((a, b) => a + b, 0)
    : 0;

  return (
    <div className="admin-page">
      <div className="welcome-banner">
        <div className="welcome-text">
          <h1>Admin Dashboard</h1>
          <p>Platform overview and risk analytics</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-row">
        <div className="stat-card stat-premium">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <span className="stat-value">{stats?.totalUsers || 0}</span>
            <span className="stat-label">Total Users</span>
          </div>
        </div>
        <div className="stat-card stat-risk">
          <div className="stat-icon">🛡️</div>
          <div className="stat-info">
            <span className="stat-value">{stats?.activePolicies || 0}</span>
            <span className="stat-label">Active Policies</span>
          </div>
        </div>
        <div className="stat-card stat-claims">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <span className="stat-value">{stats?.totalClaims || 0}</span>
            <span className="stat-label">Total Claims</span>
          </div>
        </div>
        <div className="stat-card stat-payouts">
          <div className="stat-icon">💸</div>
          <div className="stat-info">
            <span className="stat-value">₹{stats?.totalPayouts?.toLocaleString('en-IN') || 0}</span>
            <span className="stat-label">Total Payouts</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-col">
          {/* Risk Analytics by City */}
          <div className="card">
            <div className="card-header"><h2>🏙️ Claims by City</h2></div>
            <div className="card-body">
              {stats?.cityClaims && Object.keys(stats.cityClaims).length > 0 ? (
                <div className="chart-bars">
                  {Object.entries(stats.cityClaims).map(([city, data]) => (
                    <div key={city} className="chart-bar-row">
                      <span className="chart-label">{city.charAt(0).toUpperCase() + city.slice(1)}</span>
                      <div className="chart-bar-track">
                        <div
                          className="chart-bar-fill approved"
                          style={{ width: `${(data.approved / maxCityClaims) * 100}%` }}
                        ></div>
                        <div
                          className="chart-bar-fill rejected"
                          style={{ width: `${(data.rejected / maxCityClaims) * 100}%`, marginLeft: `${(data.approved / maxCityClaims) * 100}%` }}
                        ></div>
                      </div>
                      <span className="chart-value">{data.total}</span>
                    </div>
                  ))}
                  <div className="chart-legend">
                    <span className="legend-item"><span className="dot approved"></span> Approved</span>
                    <span className="legend-item"><span className="dot rejected"></span> Rejected</span>
                  </div>
                </div>
              ) : (
                <p className="text-muted text-center">No city-level data yet</p>
              )}
            </div>
          </div>

          {/* Trigger Distribution */}
          <div className="card">
            <div className="card-header"><h2>⚡ Trigger Distribution</h2></div>
            <div className="card-body">
              {totalTriggers > 0 ? (
                <div className="trigger-dist">
                  {Object.entries(stats.triggerDistribution).map(([type, count]) => (
                    <div key={type} className="trigger-dist-item">
                      <div className="trigger-dist-header">
                        <span>{triggerLabels[type] || type}</span>
                        <span className="text-bold">{count}</span>
                      </div>
                      <div className="trigger-dist-bar">
                        <div
                          className="trigger-dist-fill"
                          style={{ width: `${(count / totalTriggers) * 100}%`, background: triggerColors[type] || '#888' }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-center">No triggers simulated yet</p>
              )}
            </div>
          </div>
        </div>

        <div className="dashboard-col">
          {/* Approval Rate & Risk Prediction Grid */}
          <div className="form-row">
            {/* Approval Rate */}
            <div className="card">
              <div className="card-header"><h2>📊 Approval Rate</h2></div>
              <div className="card-body">
                <div className="approval-ring">
                  <svg viewBox="0 0 120 120" className="ring-svg">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
                    <circle
                      cx="60" cy="60" r="50" fill="none"
                      stroke="#22c55e"
                      strokeWidth="10"
                      strokeDasharray={`${((stats?.approvedClaims || 0) / Math.max(stats?.totalClaims || 1, 1)) * 314} 314`}
                      strokeLinecap="round"
                      transform="rotate(-90 60 60)"
                    />
                    <text x="60" y="56" textAnchor="middle" fill="white" fontSize="22" fontWeight="700">
                      {stats?.totalClaims
                        ? Math.round((stats.approvedClaims / stats.totalClaims) * 100)
                        : 0}%
                    </text>
                    <text x="60" y="74" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">
                      approved
                    </text>
                  </svg>
                </div>
                <div className="approval-details">
                  <span className="text-success">✅ {stats?.approvedClaims || 0}</span>
                  <span className="text-error">❌ {stats?.rejectedClaims || 0}</span>
                </div>
              </div>
            </div>

            {/* Next-Day Risk Predictions */}
            <div className="card prediction-card alert-high">
              <div className="card-header"><h2>🔮 System Alert Map</h2></div>
              <div className="card-body p-4">
                 <p className="text-sm text-error font-medium mb-2">High-Risk Zones (Next 24 Hrs)</p>
                 <ul className="text-sm mt-3" style={{ listStyle: 'none', lineHeight: '2' }}>
                   <li>🔥 <strong>Delhi:</strong> Extreme Heat forecasted</li>
                   <li>🌧️ <strong>Mumbai:</strong> Heavy Rainfall warning</li>
                   <li>💨 <strong>Gurgaon:</strong> Severe AQI degradation</li>
                 </ul>
                 <p className="suggestion-text text-xs mt-3">Expected +35% rise in parametric approvals.</p>
              </div>
            </div>
          </div>

          {/* Recent Fraud Alerts */}
          <div className="card mt-4">
            <div className="card-header">
              <div className="flex justify-between align-center">
                <h2>🚨 Recent Fraud Alerts</h2>
                <span className="badge badge-error">Top Priority</span>
              </div>
            </div>
            <div className="card-body p-0">
              {claims.filter(c => c.reason && c.reason.toLowerCase().includes('fraud')).length === 0 ? (
                <div className="empty-state p-6 text-center text-muted">
                  <p>No active fraud intercepts.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>City</th>
                        <th>Claim Attempt</th>
                        <th>AI Flag Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {claims
                        .filter(c => c.reason && c.reason.toLowerCase().includes('fraud'))
                        .slice(0, 5)
                        .map((c) => (
                          <tr key={c.id}>
                            <td className="font-medium text-error">{c.userName}</td>
                            <td>{c.userCity}</td>
                            <td>{triggerLabels[c.triggerType] || c.triggerType}</td>
                            <td className="text-xs text-muted">
                                {c.fraudChecks?.find(fc => !fc.passed)?.detail || 'AI Check Failed'}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Recent Claims Table */}
          <div className="card mt-4">
            <div className="card-header"><h2>📜 Recent Claims</h2></div>
            <div className="card-body">
              {claims.length === 0 ? (
                <p className="text-muted text-center">No claims yet</p>
              ) : (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>City</th>
                        <th>Trigger</th>
                        <th>Loss</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {claims.slice(0, 10).map((c) => (
                        <tr key={c.id}>
                          <td>{c.userName}</td>
                          <td>{c.userCity}</td>
                          <td>{triggerLabels[c.triggerType] || c.triggerType}</td>
                          <td>₹{c.incomeLoss}</td>
                          <td>
                            <span className={`badge ${c.status === 'approved' ? 'badge-success' : 'badge-error'}`}>
                              {c.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
