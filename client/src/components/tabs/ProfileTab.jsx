import React from 'react';
import { getUser, clearAuth } from '../../api';
import { useApp } from '../../AppContext';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

const BADGES = [
  { icon: '🎖️', label: 'Low Risk Hero', desc: 'Stayed safe for 7+ days' },
  { icon: '⭐', label: 'Safe Performer', desc: 'Top 5% of safe workers' },
  { icon: '🛡️', label: 'Shield Veteran', desc: 'Active policy for 30+ days' },
  { icon: '💰', label: 'Smart Earner', desc: 'Claimed 3+ payouts' },
];

export default function ProfileTab() {
  const user = getUser();
  const { claims, earnings } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    localStorage.removeItem('zs_policy');
    localStorage.removeItem('zs_claims');
    localStorage.removeItem('zs_earnings');
    navigate('/login');
  };

  const fields = [
    { label: 'Name', value: user?.name || 'Ravi Kumar' },
    { label: 'City', value: user?.city || 'Chennai' },
    { label: 'Daily Income', value: `₹${user?.dailyIncome || '800'}` },
    { label: 'Working Hours', value: `${user?.hours || '8'} hours/day` },
  ];

  // Build claims trend from last 7 days
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const trendData = days.map((day, i) => ({
    day,
    amount: claims.length > i ? (claims[i]?.status === 'Accepted' ? claims[i].amount : 0) : 0,
  }));

  return (
    <div style={{ padding: '20px 20px 100px 20px', background: '#f8f9fa', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#111827', margin: 0 }}>My Profile</h1>
      </div>

      {/* Avatar */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '28px' }}>
        <div style={{ width: '88px', height: '88px', borderRadius: '50%', background: 'linear-gradient(135deg, #e23744, #b91c1c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem', color: '#fff', fontWeight: '800', marginBottom: '12px', boxShadow: '0 8px 24px rgba(226,55,68,0.25)' }}>
          {user?.name?.[0]?.toUpperCase() || 'R'}
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#111827', margin: '0 0 8px 0' }}>{user?.name || 'Ravi Kumar'}</h2>
        <div style={{ background: '#dcfce7', color: '#16a34a', padding: '4px 12px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: '800' }}>
          🛡️ Zomato Partner
        </div>
      </div>

      {/* Details Card */}
      <div style={{ background: '#fff', borderRadius: '28px', padding: '24px', boxShadow: '0 8px 30px rgba(0,0,0,0.03)', border: '1px solid #f3f4f6', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '20px' }}>Work Details</h3>
        {fields.map((f, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: i < fields.length - 1 ? '16px' : 0, borderBottom: i < fields.length - 1 ? '1px solid #f3f4f6' : 'none', marginBottom: i < fields.length - 1 ? '16px' : 0 }}>
            <div style={{ color: '#6b7280', fontSize: '0.9rem', fontWeight: '500' }}>{f.label}</div>
            <div style={{ color: '#111827', fontSize: '0.9rem', fontWeight: '700', textTransform: 'capitalize' }}>{f.value}</div>
          </div>
        ))}
      </div>

      {/* Claims Trend Chart */}
      <div style={{ background: '#fff', borderRadius: '28px', padding: '24px', boxShadow: '0 8px 30px rgba(0,0,0,0.03)', border: '1px solid #f3f4f6', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#111827', marginBottom: '16px' }}>📊 Claims Trend</h3>
        {claims.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', color: '#9ca3af' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📋</div>
            <div style={{ fontWeight: '600' }}>No claims data yet</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={trendData} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip formatter={(v) => `₹${v}`} contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6', fontSize: '0.8rem' }} />
              <Bar dataKey="amount" fill="#e23744" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
          {[
            { label: 'Accepted', val: claims.filter(c => c.status === 'Accepted').length, color: '#22c55e', bg: '#dcfce7' },
            { label: 'Rejected', val: claims.filter(c => c.status === 'Rejected').length, color: '#ef4444', bg: '#fee2e2' },
            { label: 'Pending', val: claims.filter(c => c.status === 'Processing').length, color: '#f59e0b', bg: '#fef3c7' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px auto' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: '800', color: s.color }}>{s.val}</span>
              </div>
              <div style={{ fontSize: '0.65rem', color: '#6b7280', fontWeight: '600' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements / Badges */}
      <div style={{ background: '#fff', borderRadius: '28px', padding: '24px', boxShadow: '0 8px 30px rgba(0,0,0,0.03)', border: '1px solid #f3f4f6', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#111827', marginBottom: '16px' }}>🏆 Achievements</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {BADGES.map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 16px', background: '#f8f9fa', borderRadius: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fff', border: '2px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0 }}>{b.icon}</div>
              <div>
                <div style={{ fontWeight: '800', color: '#111827', fontSize: '0.95rem' }}>{b.label}</div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{b.desc}</div>
              </div>
              <div style={{ marginLeft: 'auto', background: '#dcfce7', color: '#16a34a', padding: '4px 10px', borderRadius: '100px', fontSize: '0.6rem', fontWeight: '800' }}>EARNED</div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleLogout} style={{ width: '100%', padding: '16px', background: '#fff', color: '#e23744', border: '1.5px solid #fda4af', borderRadius: '100px', fontSize: '1rem', fontWeight: '800', cursor: 'pointer' }}>
        Log Out
      </button>

    </div>
  );
}
