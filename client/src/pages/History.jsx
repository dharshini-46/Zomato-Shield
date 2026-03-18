import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api';

export default function History() {
  const navigate = useNavigate();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClaims();
  }, []);

  const loadClaims = async () => {
    try {
      const data = await apiFetch('/claims');
      setClaims(data.claims || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const triggerIcons = {
    heavy_rain: '🌧️',
    high_temp: '🔥',
    poor_aqi: '💨',
  };

  if (loading) {
    return <div className="page-loader"><div className="spinner-lg"></div></div>;
  }

  return (
    <div className="dashboard-mobile-view" style={{ paddingBottom: '30px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#1c1c1c' }}>←</button>
        <h1 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: '#1c1c1c' }}>Payout & Claim History</h1>
      </div>

      {/* SHIELD ACTIVE Banner */}
      <div style={{ 
        background: 'linear-gradient(135deg, #e23744 0%, #b91c1c 100%)', 
        padding: '24px 20px', 
        borderRadius: '20px', 
        color: '#fff', 
        marginBottom: '32px',
        boxShadow: '0 8px 24px rgba(226, 55, 68, 0.25)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span style={{ fontSize: '0.85rem', fontWeight: '800', letterSpacing: '1px' }}>SHIELD ACTIVE</span>
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '4px' }}>All trips protected</div>
        <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Your active policy covers up to ₹500/day.</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1c1c1c' }}>Recent Claims</h2>
        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#e23744' }}>Filter</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
        {claims.length === 0 ? (
          <div style={{ padding: '32px 24px', textAlign: 'center', color: '#9ca3af', fontSize: '0.95rem', background: '#f9fafb', borderRadius: '20px', border: '1px dashed #e5e7eb' }}>
            No claims history available yet.
          </div>
        ) : (
          claims.map((claim) => (
            <div key={claim.id} style={{ 
              background: '#fff', 
              padding: '18px', 
              borderRadius: '20px', 
              display: 'flex', 
              alignItems: 'flex-start', 
              justifyContent: 'space-between', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              border: '1px solid #f3f4f6'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: claim.status === 'approved' ? '#f0fdf4' : '#fefce8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                  {triggerIcons[claim.triggerType] || '📋'}
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px', color: '#1c1c1c' }}>
                    {claim.triggerLabel} Coverage
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '500', marginBottom: '8px' }}>
                    {new Date(claim.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  
                  {/* Status Pill */}
                  <div style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    padding: '4px 8px', 
                    borderRadius: '8px',
                    background: claim.status === 'approved' ? '#f0fdf4' : '#fefce8',
                    color: claim.status === 'approved' ? '#166534' : '#b45309',
                    fontSize: '0.7rem', 
                    fontWeight: '700',
                  }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: claim.status === 'approved' ? '#22c55e' : '#f59e0b' }}></span>
                    {claim.status === 'approved' ? 'PAID' : claim.status.toUpperCase()}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: claim.status === 'approved' ? '#16a34a' : '#1c1c1c', marginBottom: '4px' }}>
                  ₹{claim.payout ? claim.payout.amount : claim.incomeLoss}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <button className="btn" style={{ 
        width: '100%', 
        background: '#f9fafb', 
        color: '#1c1c1c', 
        border: '1px solid #e5e7eb',
        padding: '18px', 
        borderRadius: '20px', 
        fontSize: '0.95rem', 
        fontWeight: '700', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        gap: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
      }}>
        Need Help with a Claim?
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
      </button>

      {/* Padding for Bottom Nav */}
      <div style={{ height: '40px' }}></div>
    </div>
  );
}
