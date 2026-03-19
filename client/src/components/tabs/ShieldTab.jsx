import React, { useState } from 'react';

const Icons = {
  Brain: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>,
  Lightning: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Cash: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>,
  Shield: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Flame: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>,
  Alert: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Award: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>,
  Star: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
};

export default function ShieldTab({ setActiveTab }) {
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  if (showHowItWorks) {
    return (
      <div style={{ padding: '20px 20px 100px 20px', background: '#f8f9fa', minHeight: '100vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', marginBottom: '24px', position: 'relative' }}>
          <button onClick={() => setShowHowItWorks(false)} style={{ position: 'absolute', left: 0, background: 'none', border: 'none', cursor: 'pointer', color: '#111827' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <h1 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: '#111827', marginInline: 'auto' }}>How Shield Works</h1>
        </div>

        <div style={{ background: 'linear-gradient(180deg, #ffe4e6 0%, #fff 100%)', borderRadius: '32px', padding: '40px 24px', textAlign: 'center', marginBottom: '32px', boxShadow: '0 8px 30px rgba(226,55,68,0.05)' }}>
          <div style={{ width: '56px', height: '56px', background: '#e23744', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.8rem', margin: '0 auto 16px auto', boxShadow: '0 4px 12px rgba(226,55,68,0.3)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#111827', margin: '0 0 8px 0' }}>Zomato Shield</h2>
          <p style={{ fontSize: '1rem', color: '#6b7280', margin: 0 }}>Your earnings, protected.</p>
        </div>

        <p style={{ textAlign: 'center', fontSize: '1rem', color: '#374151', lineHeight: '1.5', marginBottom: '32px', padding: '0 16px' }}>
          The parametric insurance system designed to protect your earnings during extreme conditions.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
          {[
            { icon: Icons.Brain, title: 'Smart Detection', desc: 'Our AI monitors weather and pollution in your delivery zone in real-time.', color: '#3b82f6', bg: '#eff6ff' },
            { icon: Icons.Lightning, title: 'Automatic Trigger', desc: 'If conditions (like rain >50mm) are met, your claim is triggered automatically.', color: '#f59e0b', bg: '#fef3c7' },
            { icon: Icons.Cash, title: 'Instant Payout', desc: 'Money is credited to your wallet within minutes—no paperwork needed.', color: '#10b981', bg: '#dcfce7' },
            { icon: Icons.Shield, title: 'Stay Protected', desc: 'Continue working safely knowing your earnings are covered regardless of volume.', color: '#ef4444', bg: '#fee2e2' }
          ].map((item, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: '32px', padding: '24px', display: 'flex', alignItems: 'flex-start', gap: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', border: '1px solid #f3f4f6' }}>
              <div style={{ width: '48px', height: '48px', background: item.bg, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, flexShrink: 0 }}>
                {item.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#111827', margin: '0 0 4px 0' }}>{item.title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: 0, lineHeight: '1.4' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#111827', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <div style={{ width: '24px', height: '24px', background: '#e23744', borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: '800' }}>?</div>
          Frequently Asked Questions
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {['What is parametric insurance?', 'When do I get paid?'].map((q, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: '100px', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', border: '1px solid #f3f4f6' }}>
              <span style={{ fontSize: '0.95rem', color: '#374151', fontWeight: '500' }}>{q}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px 20px 100px 20px', background: '#f8f9fa', minHeight: '100vh' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <button style={{ background: '#fff0f1', color: '#e23744', width: '40px', height: '40px', borderRadius: '50%', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        <h1 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: '#111827' }}>Zomato Shield</h1>
        <button style={{ background: '#ffe4e6', color: '#e23744', width: '40px', height: '40px', borderRadius: '50%', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '10px', right: '10px', width: '8px', height: '8px', background: '#e23744', borderRadius: '50%', border: '2px solid #ffe4e6' }}></div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
        </button>
      </div>

      <div style={{ background: '#fff1f2', borderRadius: '32px', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', border: '1px solid #ffe4e6' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <span style={{ color: '#ef4444' }}>{Icons.Alert}</span>
          <div>
            <div style={{ fontSize: '0.9rem', color: '#ef4444', fontWeight: '700' }}>Suspicious activity detected</div>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Stay within service parameters for your safety.</div>
          </div>
        </div>
        <button style={{ background: '#f87171', color: '#fff', border: 'none', borderRadius: '100px', padding: '10px', fontSize: '0.9rem', fontWeight: '700', opacity: 0.9 }}>Dismiss</button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#111827', margin: 0 }}>Live Risk Map</h2>
        <div style={{ background: '#dcfce7', color: '#16a34a', padding: '4px 10px', borderRadius: '100px', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.5px' }}>LIVE UPDATES</div>
      </div>

      {/* Map Card */}
      <div style={{ background: '#fff', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.03)', border: '1px solid #f3f4f6', marginBottom: '32px' }}>
        <div style={{ width: '100%', height: '180px', background: '#e5e7eb', position: 'relative' }}>
          {/* Mock Map Background */}
          <div style={{ position: 'absolute', inset: 0, backgroundColor: '#f1f5f9', opacity: 0.8, backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '16px', height: '16px', background: '#e23744', borderRadius: '50%', border: '4px solid #fff', boxShadow: '0 0 0 8px rgba(226,55,68,0.2)' }}></div>
          <div style={{ position: 'absolute', top: '65%', left: '50%', transform: 'translate(-50%, -50%)', fontWeight: '800', fontSize: '1rem', color: '#111827', textShadow: '0 2px 4px rgba(255,255,255,0.8)' }}>New Delhi</div>
        </div>
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.5px', color: '#6b7280' }}>
            <span>RISK INTENSITY</span>
            <div style={{ display: 'flex', gap: '12px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#22c55e' }}></span> SAFE</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#ef4444' }}></span> HIGH RISK</span>
            </div>
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#111827', margin: '0 0 4px 0' }}>High payout probability zones</h3>
          <div style={{ fontSize: '0.85rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg> 
            Near Connaught Place, New Delhi
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#111827', margin: 0 }}>Your Achievements</h2>
        <span style={{ color: '#e23744', fontSize: '0.85rem', fontWeight: '700' }}>View all</span>
      </div>

      <div style={{ background: '#fff', borderRadius: '32px', padding: '24px', boxShadow: '0 8px 30px rgba(226,55,68,0.05)', border: '1px solid #ffe4e6', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '0.7rem', color: '#e23744', fontWeight: '800', letterSpacing: '1px', marginBottom: '6px' }}>ACTIVE STREAK</div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#111827', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            7-day No-Claim
            <span style={{ display: 'inline-flex', width: '24px', height: '24px', color: '#ef4444' }}>{Icons.Flame}</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0 0 16px 0' }}>You're in the top 5% of safe drivers!</p>
          <div style={{ height: '6px', background: '#e5e7eb', borderRadius: '100px', overflow: 'hidden' }}>
            <div style={{ width: '70%', background: '#e23744', height: '100%' }}></div>
          </div>
        </div>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fff0f1', border: '4px solid #fecdd3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e23744' }}>
          {Icons.Flame}
        </div>
      </div>

      <h3 style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>BADGES EARNED</h3>
      <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '16px', margin: '0 -20px', padding: '0 20px', scrollbarWidth: 'none' }}>
        {[
          { icon: Icons.Award, title: 'Low Risk Hero', color: '#3b82f6' },
          { icon: Icons.Star, title: 'Safe Performer', color: '#f59e0b' },
          { icon: Icons.Shield, title: 'Shield Vet', color: '#16a34a' }
        ].map((badge, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: '50%', width: '100px', height: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #f3f4f6', gap: '4px' }}>
            <div style={{ color: badge.color, background: `${badge.color}15`, width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{badge.icon}</div>
            <span style={{ fontSize: '0.65rem', fontWeight: '800', color: '#111827', textAlign: 'center', maxWidth: '80px' }}>{badge.title}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <button onClick={() => setShowHowItWorks(true)} style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: '0.85rem', fontWeight: '600', textDecoration: 'underline', cursor: 'pointer' }}>
          Learn how Shield works
        </button>
      </div>

    </div>
  );
}
