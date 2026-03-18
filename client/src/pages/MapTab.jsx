import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api';

export default function MapTab() {
  const navigate = useNavigate();
  const [gamification, setGamification] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const gmData = await apiFetch('/gamification/status');
      setGamification(gmData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="page-loader"><div className="spinner-lg"></div></div>;
  }

  return (
    <div className="dashboard-mobile-view" style={{ paddingBottom: '30px', background: '#f8f9fa', minHeight: '100vh' }}>
      
      {/* Top Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', position: 'sticky', top: 0, background: '#f8f9fa', zIndex: 10, padding: '16px 0' }}>
        <button style={{ width: '36px', height: '36px', background: '#fee2e2', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e23744', cursor: 'pointer' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1c1c1c' }}>Zomato Shield</span>
        <button style={{ width: '36px', height: '36px', background: '#fee2e2', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e23744', cursor: 'pointer', position: 'relative' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          <span style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, background: '#e23744', borderRadius: '50%', border: '2px solid #fee2e2' }}></span>
        </button>
      </div>

      {/* Suspicious Activity Banner */}
      <div style={{ background: '#fff0f1', borderRadius: '24px', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', border: '1px solid #fee2e2' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{ color: '#e23744', marginTop: '2px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L1 21h22M12 9v4m0 4h.01"/></svg>
          </div>
          <div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#e23744', margin: '0 0 4px 0' }}>Suspicious activity detected</h3>
            <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: 0, lineHeight: '1.4' }}>Stay within service parameters for your safety.</p>
          </div>
        </div>
        <button style={{ background: '#f87171', color: '#fff', border: 'none', borderRadius: '100px', padding: '10px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', width: '100%' }}>
          Dismiss
        </button>
      </div>

      {/* Live Risk Map Area */}
      <div style={{ background: '#fff', borderRadius: '32px', padding: '24px 20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1c1c1c', margin: 0 }}>Live Risk Map</h2>
          <div style={{ background: '#dcfce7', color: '#16a34a', padding: '6px 10px', borderRadius: '100px', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.5px' }}>
            LIVE UPDATES
          </div>
        </div>
        
        <div style={{ height: '200px', borderRadius: '24px', overflow: 'hidden', position: 'relative', marginBottom: '16px', border: '1px solid #f3f4f6' }}>
          <img src="https://maps.googleapis.com/maps/api/staticmap?center=New+Delhi&zoom=11&size=600x300&maptype=roadmap&style=feature:poi|visibility:off&style=feature:transit|visibility:off&style=feature:road|element:labels|visibility:off" alt="Map" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
          
          {/* Mock Red Pulse Area */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '48px', height: '48px', background: 'rgba(226, 55, 68, 0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <div style={{ width: '12px', height: '12px', background: '#e23744', borderRadius: '50%', border: '2px solid #fff' }}></div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.9)', padding: '4px 8px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800', color: '#1c1c1c', marginTop: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
               New Delhi
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '16px', marginBottom: '16px' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#6b7280', letterSpacing: '1px' }}>RISK INTENSITY</span>
          <div style={{ display: 'flex', gap: '12px', fontSize: '0.7rem', fontWeight: '800', color: '#6b7280', letterSpacing: '0.5px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ color: '#22c55e', fontSize: '1rem' }}>●</span> SAFE</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ color: '#e23744', fontSize: '1rem' }}>●</span> HIGH RISK</div>
          </div>
        </div>

        <div>
           <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#1c1c1c', margin: '0 0 6px 0' }}>High payout probability zones</h3>
           <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#6b7280', fontWeight: '500' }}>
             <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
             Near Connaught Place, New Delhi
           </div>
        </div>
      </div>

      {/* Your Achievements */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1c1c1c', margin: 0 }}>Your Achievements</h2>
        <span style={{ fontSize: '0.85rem', color: '#e23744', fontWeight: '700' }}>View all</span>
      </div>

      <div style={{ background: '#fff0f1', borderRadius: '32px', padding: '24px', position: 'relative', overflow: 'hidden', border: '1px solid #fee2e2', marginBottom: '24px' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '0.65rem', fontWeight: '800', color: '#e23744', letterSpacing: '1px', marginBottom: '8px' }}>ACTIVE STREAK</div>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1c1c1c', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {gamification?.streak || 7}-day No-Claim <span>🔥</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0 0 16px 0' }}>You're in the top 5% of safe drivers!</p>
          
          <div style={{ height: '6px', background: '#fee2e2', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: '70%', height: '100%', background: '#e23744' }}></div>
          </div>
        </div>
        
        <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', width: '64px', height: '64px', background: '#fff', borderRadius: '50%', border: '4px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', boxShadow: '0 4px 15px rgba(226, 55, 68, 0.15)' }}>
          <span style={{ color: '#e23744' }}>🔥</span>
        </div>
      </div>

      {/* Badges Earned */}
      <h3 style={{ fontSize: '0.8rem', fontWeight: '800', color: '#6b7280', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>Badges Earned</h3>
      <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
        <BadgeCard icon="🏅" title="Low Risk Hero" bg="#eff6ff" border="#bfdbfe" />
        <BadgeCard icon="⭐" title="Safe Performer" bg="#fefce8" border="#fef08a" />
        <BadgeCard icon="🛡️" title="Shield Veteran" bg="#fff0f1" border="#fecaca" />
      </div>

      <div style={{ height: '80px' }}></div>
    </div>
  );
}

function BadgeCard({ icon, title, bg, border }) {
  return (
    <div style={{ minWidth: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#fff', border: `1px solid #f3f4f6`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', position: 'relative' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
          {icon}
        </div>
      </div>
      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#1c1c1c', textAlign: 'center' }}>{title}</span>
    </div>
  );
}
