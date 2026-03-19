import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { getUser } from '../../api';
import { useApp } from '../../AppContext';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const Icons = {
  Rain: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 16.2A4.5 4.5 0 0 0 17.5 8h-1.8A7 7 0 1 0 4 14.9"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/></svg>,
  Heat: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M4.93 19.07l1.41-1.41"/><path d="M17.66 6.34l1.41-1.41"/></svg>,
  Pollution: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"/><polyline points="14 2 14 8 20 8"/><path d="M2 15h10"/><path d="M2 18h10"/><path d="M2 21h10"/></svg>,
  Storm: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 2v9h4l-3 11v-9H8l3-11z"/></svg>,
  Check: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>,
  XBox: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Info: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  Map: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>,
  Bot: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>,
  Game: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 12h4"/><path d="M8 10v4"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/></svg>,
};

// Fix Leaflet default icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const createColorIcon = (color) => L.divIcon({
  className: '',
  html: `<div style="width:18px;height:18px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.35)"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const CITY_COORDS = {
  chennai:   [13.0827, 80.2707],
  bangalore: [12.9716, 77.5946],
  hyderabad: [17.3850, 78.4867],
  mumbai:    [19.0760, 72.8777],
  delhi:     [28.6139, 77.2090],
};

const RISK_MARKERS_BY_CITY = {
  chennai:   [
    { pos: [13.105,  80.255], color: '#ef4444', label: 'Heavy Rain Area – High Risk' },
    { pos: [13.065,  80.290], color: '#f59e0b', label: 'Medium Traffic – Moderate Risk' },
    { pos: [13.050,  80.220], color: '#22c55e', label: 'Safe Zone – Low Risk' },
  ],
  bangalore: [
    { pos: [12.995,  77.610], color: '#ef4444', label: 'Extreme Heat Zone – High Risk' },
    { pos: [12.945,  77.560], color: '#f59e0b', label: 'Moderate Pollution – Medium Risk' },
    { pos: [13.010,  77.510], color: '#22c55e', label: 'Safe Residential Area' },
  ],
  hyderabad: [
    { pos: [17.430,  78.470], color: '#ef4444', label: 'High AQI Zone – High Risk' },
    { pos: [17.365,  78.500], color: '#f59e0b', label: 'Storm Alert – Moderate Risk' },
    { pos: [17.350,  78.430], color: '#22c55e', label: 'Clear Zone – Safe' },
  ],
  mumbai: [
    { pos: [19.110,  72.880], color: '#ef4444', label: 'Coastal Flooding – High Risk' },
    { pos: [19.050,  72.840], color: '#f59e0b', label: 'Heavy Traffic – Moderate' },
    { pos: [19.030,  72.900], color: '#22c55e', label: 'Safe Zone' },
  ],
  delhi: [
    { pos: [28.650,  77.230], color: '#ef4444', label: 'Severe Pollution – High Risk' },
    { pos: [28.590,  77.200], color: '#f59e0b', label: 'Moderate AQI – Medium Risk' },
    { pos: [28.640,  77.160], color: '#22c55e', label: 'Park Zone – Safe' },
  ],
};

const DEFAULT_CITY = 'chennai';

const RISK_COLORS = ['#3b82f6', '#f97316', '#64748b'];
const RISK_DATA = [
  { name: 'Rain', value: 45 },
  { name: 'Heat', value: 30 },
  { name: 'Pollution', value: 25 },
];

const SIM_TYPES = [
  { label: 'Simulate Rain', icon: Icons.Rain, type: 'Heavy Rain', result: 'approved', amount: 320, color: '#3b82f6', bg: '#eff6ff' },
  { label: 'Simulate Heat', icon: Icons.Heat, type: 'Severe Heat', result: 'approved', amount: 150, color: '#f97316', bg: '#fff7ed' },
  { label: 'Simulate Pollution', icon: Icons.Pollution, type: 'High Pollution', result: 'rejected', amount: 0, color: '#64748b', bg: '#f1f5f9' },
];

function MapCenterUpdater({ center }) {
  const map = useMap();
  useEffect(() => { map.setView(center, 13); }, [center]);
  return null;
}

export default function HomeTab({ setActiveTab }) {
  const user = getUser();
  const { policy, requestClaim } = useApp();
  const [claimModal, setClaimModal] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState('');
  const [simResult, setSimResult] = useState(null);
  const [mapError, setMapError] = useState(false);

  const cityKey = (user?.city || DEFAULT_CITY).toLowerCase().replace(/\s/g, '');
  const cityCoords = CITY_COORDS[cityKey] || CITY_COORDS[DEFAULT_CITY];
  const riskMarkers = RISK_MARKERS_BY_CITY[cityKey] || RISK_MARKERS_BY_CITY[DEFAULT_CITY];

  const weeklyIncome = user ? Number(user.dailyIncome || 800) * 7 : 5600;
  const protectedAmt = policy ? Math.round(weeklyIncome * (policy.plan === 'Basic' ? 0.5 : policy.plan === 'Standard' ? 0.8 : 1.0)) : 0;
  const atRisk = weeklyIncome - protectedAmt;
  const protectedPct = policy ? Math.round((protectedAmt / weeklyIncome) * 100) : 0;

  const CLAIM_TYPES = ['Heavy Rain', 'Severe Heat', 'High Pollution', 'Storm Alert'];

  const getClaimIcon = (type) => {
    switch (type) {
      case 'Heavy Rain': return Icons.Rain;
      case 'Severe Heat': return Icons.Heat;
      case 'High Pollution': return Icons.Pollution;
      case 'Storm Alert': return Icons.Storm;
      default: return Icons.Info;
    }
  };

  const handleClaimRequest = (type) => {
    if (!policy) return;
    requestClaim(type);
    setClaimModal(false);
    setClaimSuccess(`Claim for "${type}" submitted`);
    setTimeout(() => setClaimSuccess(''), 4000);
  };

  const handleSimulate = (sim) => {
    if (!policy) {
      setSimResult({ type: sim.type, result: 'no_policy', msg: 'Subscribe to a plan first to enable claims.' });
      return;
    }
    requestClaim(sim.type);
    setSimResult({ type: sim.type, result: sim.result, amount: sim.amount, icon: sim.icon });
    setTimeout(() => setSimResult(null), 4000);
  };

  return (
    <div style={{ padding: '20px 20px 100px 20px', background: '#f8f9fa', minHeight: '100vh' }}>

      {/* Toast */}
      {claimSuccess && (
        <div style={{ position: 'fixed', top: '16px', left: '50%', transform: 'translateX(-50%)', background: '#22c55e', color: '#fff', padding: '12px 20px', borderRadius: '100px', fontSize: '0.85rem', fontWeight: '700', zIndex: 999, boxShadow: '0 8px 20px rgba(34,197,94,0.3)', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {Icons.Check} {claimSuccess}
        </div>
      )}

      {/* Simulation Result Toast */}
      {simResult && (
        <div style={{ position: 'fixed', top: '16px', left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 40px)', maxWidth: '440px', background: simResult.result === 'approved' ? '#dcfce7' : simResult.result === 'no_policy' ? '#fef3c7' : '#fee2e2', borderRadius: '20px', padding: '16px 20px', zIndex: 999, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}>
          <div style={{ fontWeight: '800', color: simResult.result === 'approved' ? '#166534' : simResult.result === 'no_policy' ? '#92400e' : '#991b1b', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {simResult.result === 'approved' ? Icons.Check : simResult.result === 'no_policy' ? Icons.Info : Icons.XBox}
            {simResult.result === 'approved' ? `Claim Approved – ${simResult.type}` : simResult.result === 'no_policy' ? 'No Active Policy' : `Claim Rejected – ${simResult.type}`}
          </div>
          <div style={{ fontSize: '0.85rem', color: simResult.result === 'approved' ? '#16a34a' : simResult.result === 'no_policy' ? '#d97706' : '#dc2626' }}>
            {simResult.result === 'approved' ? `₹${simResult.amount} will be credited to your wallet.` : simResult.result === 'no_policy' ? simResult.msg : 'AQI threshold not met for this event.'}
          </div>
        </div>
      )}

      {/* Claim Modal */}
      {claimModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={() => setClaimModal(false)}>
          <div style={{ background: '#fff', borderRadius: '32px 32px 0 0', padding: '32px 24px 48px', width: '100%', maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', textAlign: 'center', marginBottom: '8px' }}>Request a Claim</h3>
            <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.85rem', marginBottom: '24px' }}>Select the reason for your claim</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {CLAIM_TYPES.map(type => (
                <button key={type} onClick={() => handleClaimRequest(type)} style={{ width: '100%', padding: '16px', background: '#f8f9fa', border: '1px solid #e5e7eb', borderRadius: '16px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px', color: '#111827' }}>
                  <div style={{ color: '#e23744' }}>{getClaimIcon(type)}</div> {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #e23744, #b91c1c)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '1.1rem' }}>
            {user?.name?.[0]?.toUpperCase() || 'R'}
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#111827', margin: 0 }}>Hi, {user?.name?.split(' ')[0] || 'Ravi'}</h1>
            <div style={{ fontSize: '0.75rem', color: '#e23744', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {user?.city || 'Chennai'} · Earnings protected by AI
            </div>
          </div>
        </div>
        <div style={{ position: 'relative', width: '40px', height: '40px', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ position: 'absolute', top: '10px', right: '10px', width: '8px', height: '8px', background: '#e23744', borderRadius: '50%', border: '2px solid #fff' }}></div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        </div>
      </div>

      {/* User Stats Strip */}
      <div style={{ background: '#fff', borderRadius: '24px', padding: '18px 24px', display: 'flex', justifyContent: 'space-around', marginBottom: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', border: '1px solid #f3f4f6' }}>
        {[{ label: 'Daily Income', value: `₹${user?.dailyIncome || 800}` }, { label: 'City', value: (user?.city || 'CHN').slice(0, 3).toUpperCase() }, { label: 'Hours', value: `${user?.hours || 8}h` }].map((s, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: '600', marginBottom: '2px' }}>{s.label}</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#111827' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Policy Status Banner */}
      {policy ? (
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '20px', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ color: '#d97706' }}>{Icons.Info}</div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#92400e' }}>High risk tomorrow</div>
              <div style={{ fontSize: '0.75rem', color: '#92400e', opacity: 0.8 }}>Est. loss: ₹{Math.round(atRisk * 0.7)}</div>
            </div>
          </div>
          <button onClick={() => setActiveTab('Policy')} style={{ background: '#111827', color: '#fff', border: 'none', borderRadius: '100px', padding: '8px 14px', fontSize: '0.75rem', fontWeight: '700' }}>Upgrade</button>
        </div>
      ) : (
        <div style={{ background: '#fff1f2', border: '1px solid #fda4af', borderRadius: '20px', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ color: '#e23744' }}>{Icons.Info}</div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#9f1239' }}>No active policy</div>
              <div style={{ fontSize: '0.75rem', color: '#9f1239', opacity: 0.8 }}>Subscribe to protect your earnings</div>
            </div>
          </div>
          <button onClick={() => setActiveTab('Policy')} style={{ background: '#e23744', color: '#fff', border: 'none', borderRadius: '100px', padding: '8px 14px', fontSize: '0.75rem', fontWeight: '700' }}>Get Shield</button>
        </div>
      )}

      {/* ─── LIVE RISK MAP ─── */}
      <div style={{ background: '#fff', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', border: '1px solid #f3f4f6', marginBottom: '20px' }}>
        <div style={{ padding: '20px 20px 0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ color: '#111827' }}>{Icons.Map}</div>
            <h2 style={{ fontWeight: '800', color: '#111827', margin: 0, fontSize: '1.1rem' }}>Live Risk Map</h2>
          </div>
          <div style={{ background: '#dcfce7', color: '#16a34a', padding: '4px 10px', borderRadius: '100px', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.5px' }}>LIVE</div>
        </div>
        <div style={{ height: '300px', width: '100%', borderRadius: '0 0 32px 32px', overflow: 'hidden' }}>
          {mapError ? (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px', color: '#9ca3af', background: '#f8f9fa' }}>
              <div style={{ color: '#9ca3af', marginBottom: '4px' }}>{Icons.Map}</div>
              <span style={{ fontWeight: '700' }}>Map unavailable</span>
            </div>
          ) : (
            <React.Suspense fallback={<div style={{ height: '100%', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading map…</div>}>
              <MapContainer center={cityCoords} zoom={13} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
                <MapCenterUpdater center={cityCoords} />
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="© OpenStreetMap contributors"
                />
                {riskMarkers.map((m, i) => (
                  <Marker key={i} position={m.pos} icon={createColorIcon(m.color)}>
                    <Popup><strong>{m.label}</strong></Popup>
                  </Marker>
                ))}
              </MapContainer>
            </React.Suspense>
          )}
        </div>
        <div style={{ padding: '12px 20px 20px 20px', display: 'flex', gap: '16px' }}>
          {[{ c: '#ef4444', l: 'High Risk' }, { c: '#f59e0b', l: 'Medium Risk' }, { c: '#22c55e', l: 'Safe Zone' }].map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: '600', color: '#4b5563' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: b.c, display: 'inline-block' }}></span>{b.l}
            </div>
          ))}
        </div>
      </div>

      {/* ─── AI PREDICTION CARD ─── */}
      <div style={{ background: '#fff', borderRadius: '32px', padding: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', border: '1px solid #f3f4f6', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ background: '#e23744', color: '#fff', padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {Icons.Bot}
          </div>
          <h2 style={{ fontWeight: '800', color: '#111827', margin: 0, fontSize: '1.1rem' }}>AI Prediction</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { icon: Icons.Rain, title: 'Heavy rain expected tomorrow', sub: 'Probability: 82%', loss: 300, color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' },
            { icon: Icons.Heat, title: 'Heatwave alert next 3 days', sub: 'Temperature >42°C', loss: 150, color: '#f97316', bg: '#fff7ed', border: '#fed7aa' },
            { icon: Icons.Pollution, title: 'AQI above 200 predicted', sub: 'Pollution spike expected', loss: 80, color: '#64748b', bg: '#f1f5f9', border: '#cbd5e1' },
          ].map((a, i) => (
            <div key={i} style={{ background: a.bg, borderRadius: '20px', padding: '16px 20px', borderLeft: `4px solid ${a.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <div style={{ color: a.color }}>{a.icon}</div>
                <div>
                  <div style={{ fontWeight: '700', color: '#111827', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ color: '#d97706' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>
                    {a.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', margin: '2px 0 2px 20px' }}>{a.sub}</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#e23744', marginLeft: '20px' }}>Est. loss: ₹{a.loss}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── SIMULATION PANEL ─── */}
      <div style={{ background: '#fff', borderRadius: '32px', padding: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', border: '1px solid #f3f4f6', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{ color: '#111827' }}>{Icons.Game}</div>
          <h2 style={{ fontWeight: '800', color: '#111827', margin: 0, fontSize: '1.1rem' }}>Simulation Panel</h2>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '20px' }}>Simulate conditions to test your coverage and see how claims are processed.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {SIM_TYPES.map((s, i) => (
            <button key={i} onClick={() => handleSimulate(s)} style={{ background: s.bg, border: `1px solid ${s.color}20`, borderRadius: '100px', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'transform 0.1s' }}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ color: s.color }}>{s.icon}</div>
                <span style={{ fontWeight: '800', color: '#111827', fontSize: '1rem' }}>{s.label}</span>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 16 16 12 12 8"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            </button>
          ))}
        </div>
      </div>

      {/* ─── EARNINGS PROTECTION ─── */}
      <div style={{ background: '#fff', borderRadius: '32px', padding: '28px 24px', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', marginBottom: '20px', border: '1px solid #f3f4f6' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ background: '#e23744', color: '#fff', padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          </div>
          <h2 style={{ fontWeight: '800', color: '#111827', margin: 0, fontSize: '1.1rem' }}>Earnings Protection</h2>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '4px' }}>Current Weekly Earnings</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#111827' }}>₹{weeklyIncome.toLocaleString('en-IN')}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: policy ? '#22c55e' : '#e23744', lineHeight: '1' }}>{protectedPct}%</div>
            <div style={{ fontSize: '0.6rem', color: '#9ca3af', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '4px' }}>PROTECTED</div>
          </div>
        </div>
        <div style={{ height: '12px', background: '#f3f4f6', borderRadius: '100px', overflow: 'hidden', display: 'flex', marginBottom: '16px' }}>
          <div style={{ width: `${protectedPct}%`, background: '#22c55e', height: '100%', transition: 'width 0.5s ease' }}></div>
          <div style={{ width: `${100 - protectedPct}%`, background: '#fca5a5', height: '100%' }}></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '20px', borderBottom: '1px dashed #e5e7eb', marginBottom: '20px' }}>
          {[{ label: 'PROTECTED', val: `₹${protectedAmt.toLocaleString('en-IN')}`, color: '#22c55e' }, { label: 'AT RISK', val: `₹${atRisk.toLocaleString('en-IN')}`, color: '#fca5a5' }].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: s.color }}></span>
              <div>
                <div style={{ fontSize: '0.6rem', color: '#6b7280', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
                <div style={{ fontSize: '1rem', fontWeight: '800', color: '#111827' }}>{s.val}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flex: 1, background: '#f8f9fa', borderRadius: '16px', padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: '700', marginBottom: '4px' }}>CLAIM LIMIT</div>
            <div style={{ fontSize: '1rem', fontWeight: '800', color: '#111827' }}>{policy ? '₹2,00,000' : '—'}</div>
          </div>
          <div style={{ flex: 1, background: '#f8f9fa', borderRadius: '16px', padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: '700', marginBottom: '4px' }}>DAYS COVERED</div>
            <div style={{ fontSize: '1rem', fontWeight: '800', color: '#111827' }}>{policy ? '124 Days' : '—'}</div>
          </div>
        </div>
      </div>

      {/* ─── RISK DISTRIBUTION PIE ─── */}
      <div style={{ background: '#fff', borderRadius: '32px', padding: '24px', boxShadow: '0 8px 30px rgba(0,0,0,0.03)', border: '1px solid #f3f4f6', marginBottom: '20px' }}>
        <h3 style={{ fontWeight: '800', color: '#111827', marginBottom: '16px', fontSize: '1rem' }}>Risk Distribution</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={RISK_DATA} cx="50%" cy="50%" innerRadius={38} outerRadius={62} paddingAngle={4} dataKey="value">
                  {RISK_DATA.map((entry, i) => <Cell key={i} fill={RISK_COLORS[i]} />)}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {RISK_DATA.map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: RISK_COLORS[i] }}></span>
                <span style={{ fontSize: '0.85rem', color: '#4b5563', fontWeight: '600' }}>{d.name} ({d.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Request Claim CTA */}
      {policy && (
        <button onClick={() => setClaimModal(true)} style={{ width: '100%', padding: '18px', background: 'linear-gradient(135deg, #e23744, #b91c1c)', color: '#fff', border: 'none', borderRadius: '100px', fontSize: '1rem', fontWeight: '800', cursor: 'pointer', boxShadow: '0 8px 24px rgba(226,55,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Request Claim
        </button>
      )}

    </div>
  );
}
