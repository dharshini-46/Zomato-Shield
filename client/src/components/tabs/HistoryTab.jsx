import React from 'react';
import { useApp } from '../../AppContext';

const STATUS_CONFIG = {
  Accepted: { color: '#059669', bg: '#dcfce7', label: 'ACCEPTED', emoji: '✅' },
  Rejected: { color: '#dc2626', bg: '#fee2e2', label: 'REJECTED', emoji: '❌' },
  Processing: { color: '#d97706', bg: '#fef3c7', label: 'PROCESSING', emoji: '⏳' },
};

export default function HistoryTab({ setActiveTab }) {
  const { claims } = useApp();

  const totalPaid = claims.filter(c => c.status === 'Accepted').reduce((s, c) => s + c.amount, 0);

  return (
    <div style={{ padding: '20px 20px 100px 20px', background: '#f8f9fa', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => setActiveTab('Home')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#111827' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <h1 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: '#111827' }}>Claim History</h1>
        </div>
        <div style={{ background: '#ffe4e6', color: '#e23744', padding: '4px 12px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: '800' }}>
          {claims.length} Claims
        </div>
      </div>

      {/* Summary Banner */}
      <div style={{ background: 'linear-gradient(135deg, #e23744 0%, #b91c1c 100%)', padding: '28px 24px', borderRadius: '32px', color: '#fff', marginBottom: '24px', boxShadow: '0 12px 30px rgba(226,55,68,0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.65rem', fontWeight: '800' }}>SHIELD ACTIVE</div>
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', margin: '0 0 4px 0' }}>₹{totalPaid.toLocaleString('en-IN')} earned 💰</h2>
        <p style={{ fontSize: '0.85rem', opacity: 0.85, margin: 0 }}>Total amount from all accepted claims</p>

        <div style={{ display: 'flex', gap: '24px', paddingTop: '20px', marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          {[
            { label: 'Accepted', val: claims.filter(c => c.status === 'Accepted').length },
            { label: 'Rejected', val: claims.filter(c => c.status === 'Rejected').length },
            { label: 'Pending', val: claims.filter(c => c.status === 'Processing').length },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: '1.4rem', fontWeight: '800' }}>{s.val}</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#111827', marginBottom: '16px' }}>All Claims</h2>

      {claims.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 24px', color: '#9ca3af' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📋</div>
          <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>No claims yet</div>
          <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>When you request a claim, it will appear here.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {claims.map((claim) => {
            const sc = STATUS_CONFIG[claim.status] || STATUS_CONFIG.Processing;
            return (
              <div key={claim.id} style={{ background: '#fff', padding: '20px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', border: '1px solid #f3f4f6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                    {claim.icon}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#111827', margin: '0 0 2px 0' }}>{claim.date}: {claim.type}</h4>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '500', marginBottom: '4px' }}>
                      {claim.status === 'Accepted' ? `₹${claim.amount} credited` : claim.status === 'Processing' ? `Est. ₹${claim.amount}` : 'Claim not eligible'}
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '800', color: claim.status === 'Accepted' ? '#059669' : claim.status === 'Rejected' ? '#9ca3af' : '#d97706' }}>
                      {claim.status === 'Accepted' ? `+ ₹${claim.amount}` : claim.status === 'Rejected' ? '₹0.00' : `~ ₹${claim.amount}`}
                    </div>
                  </div>
                </div>
                <div style={{ background: sc.bg, color: sc.color, padding: '5px 10px', borderRadius: '100px', fontSize: '0.6rem', fontWeight: '800', whiteSpace: 'nowrap' }}>
                  {sc.emoji} {sc.label}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
