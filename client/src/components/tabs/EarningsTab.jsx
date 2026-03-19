import React from 'react';
import { useApp } from '../../AppContext';

const Icons = {
  Banknote: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>,
};

export default function EarningsTab({ setActiveTab }) {
  const { earnings } = useApp();
  const total = earnings.reduce((s, e) => s + e.amount, 0);

  return (
    <div style={{ padding: '20px 20px 100px 20px', background: '#f8f9fa', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button onClick={() => setActiveTab('Home')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#111827' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h1 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: '#111827' }}>Earnings</h1>
      </div>

      {/* Total Credited Banner */}
      <div style={{ background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)', padding: '32px 24px', borderRadius: '32px', color: '#fff', marginBottom: '28px', boxShadow: '0 12px 30px rgba(0,0,0,0.12)' }}>
        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>TOTAL AMOUNT CREDITED</div>
        <h2 style={{ fontSize: '2.6rem', fontWeight: '800', margin: '0 0 4px 0' }}>₹{total.toLocaleString('en-IN')}</h2>
        <p style={{ fontSize: '0.85rem', opacity: 0.7, margin: 0 }}>From all accepted claims and payouts</p>

        <div style={{ display: 'flex', gap: '16px', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div>
            <div style={{ fontSize: '1.3rem', fontWeight: '800' }}>{earnings.length}</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Total Payouts</div>
          </div>
          <div>
            <div style={{ fontSize: '1.3rem', fontWeight: '800' }}>₹{earnings.length > 0 ? Math.round(total / earnings.length).toLocaleString('en-IN') : 0}</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Avg. Payout</div>
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#111827', marginBottom: '16px' }}>Payout Breakdown</h2>

      {earnings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 24px', color: '#9ca3af', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div style={{ color: '#9ca3af' }}>{Icons.Banknote}</div>
          <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>No payouts yet</div>
          <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>When a claim is accepted, payouts will appear here.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {earnings.map((e) => (
            <div key={e.id} style={{ background: '#fff', borderRadius: '24px', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', border: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#111827', marginBottom: '2px' }}>{e.reason}</div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '500' }}>{e.date} · Wallet</div>
                </div>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#059669' }}>+ ₹{e.amount}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
