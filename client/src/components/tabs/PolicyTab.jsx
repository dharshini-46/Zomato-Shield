import React, { useState } from 'react';
import { useApp } from '../../AppContext';

const Icons = {
  Rain: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 16.2A4.5 4.5 0 0 0 17.5 8h-1.8A7 7 0 1 0 4 14.9"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/></svg>,
  Heat: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M4.93 19.07l1.41-1.41"/><path d="M17.66 6.34l1.41-1.41"/></svg>,
  Star: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Shield: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Check: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
};

const PLANS = [
  { id: 'Basic', price: 29, icon: Icons.Rain, coverage: '50% income protection', features: ['Covers heavy rain', 'Instant payout', 'AI risk detection'], recommended: false },
  { id: 'Standard', price: 49, icon: Icons.Heat, coverage: '80% income protection', features: ['Rain + extreme heat cover', 'Instant payout', 'AI risk detection', 'Weekly reports'], recommended: true },
  { id: 'Premium', price: 79, icon: Icons.Star, coverage: '100% income protection', features: ['Rain, heat & pollution cover', 'Instant payout', 'AI risk detection', 'Priority claims', '24/7 support'], recommended: false },
];

export default function PolicyTab({ setActiveTab }) {
  const { policy, subscribePolicy } = useApp();
  const [selectedPlan, setSelectedPlan] = useState('Standard');
  const [success, setSuccess] = useState(false);

  const handleSubscribe = () => {
    subscribePolicy(selectedPlan);
    setSuccess(true);
  };

  return (
    <div style={{ padding: '20px 20px 100px 20px', background: '#f8f9fa', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button onClick={() => setActiveTab('Home')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#111827' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h1 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: '#111827' }}>
          {policy ? 'My Policy' : 'Choose Your Shield Plan'}
        </h1>
      </div>

      {/* SUCCESS STATE */}
      {success && (
        <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: '24px', padding: '20px 24px', marginBottom: '24px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>{Icons.Check}</div>
          <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#166534' }}>Policy subscribed successfully!</div>
          <div style={{ fontSize: '0.85rem', color: '#16a34a', marginTop: '4px' }}>Your {selectedPlan} Shield plan is now active.</div>
        </div>
      )}

      {/* ACTIVE POLICY DISPLAY */}
      {policy ? (
        <div style={{ background: '#fff', borderRadius: '32px', padding: '28px 24px', boxShadow: '0 12px 40px rgba(0,0,0,0.04)', border: '1px solid #f3f4f6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>ACTIVE POLICY</div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#111827', margin: 0 }}>{policy.plan} Shield</h2>
            </div>
            <div style={{ background: '#dcfce7', color: '#166534', padding: '6px 14px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a' }}></span> ACTIVE
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { label: 'Premium', val: `₹${policy.premium} / week` },
              { label: 'Coverage', val: policy.coverage, accent: true },
              { label: 'Policy ID', val: policy.policyId },
              { label: 'Subscribed', val: new Date(policy.subscribedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #f3f4f6' }}>
                <div style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: '500' }}>{r.label}</div>
                <div style={{ fontSize: '0.9rem', fontWeight: '700', color: r.accent ? '#e23744' : '#111827' }}>{r.val}</div>
              </div>
            ))}
          </div>

          <button onClick={() => setActiveTab('Home')} style={{ marginTop: '24px', width: '100%', padding: '16px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '100px', fontWeight: '700', cursor: 'pointer' }}>
            Back to Dashboard
          </button>
        </div>
      ) : (
        <>
          {/* Icon + Intro */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ width: '56px', height: '56px', background: '#fff0f1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e23744', margin: '0 auto 16px auto' }}>
              {Icons.Shield}
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#111827', margin: '0 0 8px 0' }}>Protect Your Earnings</h2>
            <p style={{ fontSize: '0.9rem', color: '#6b7280', lineHeight: '1.5', padding: '0 16px', margin: 0 }}>Get paid even when weather stops you. Choose a plan that fits.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
            {PLANS.map((plan) => {
              const active = selectedPlan === plan.id;
              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  style={{
                    background: '#fff', borderRadius: '32px', padding: '24px', position: 'relative',
                    cursor: 'pointer', transition: 'all 0.2s',
                    border: active ? '2px solid #e23744' : '1px solid #f3f4f6',
                    boxShadow: active ? '0 12px 40px rgba(226,55,68,0.12)' : '0 4px 20px rgba(0,0,0,0.02)',
                  }}
                >
                  {plan.recommended && (
                    <div style={{ position: 'absolute', top: 0, right: 0, background: '#e23744', color: '#fff', fontSize: '0.6rem', fontWeight: '800', padding: '6px 16px', borderBottomLeftRadius: '16px', borderTopRightRadius: '30px', letterSpacing: '0.5px' }}>RECOMMENDED</div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#111827', margin: '0 0 4px 0' }}>{plan.id} Shield</h3>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#e23744' }}>₹{plan.price}</span>
                        <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '500' }}>/week</span>
                      </div>
                    </div>
                    <div style={{ width: '44px', height: '44px', color: '#111827', borderRadius: '50%', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{plan.icon}</div>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {plan.features.map((f, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#4b5563', fontWeight: '500' }}>
                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#22c55e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <button onClick={handleSubscribe} style={{
            width: '100%', padding: '18px', background: 'linear-gradient(135deg, #e23744, #b91c1c)',
            color: '#fff', border: 'none', borderRadius: '100px', fontSize: '1rem', fontWeight: '800',
            cursor: 'pointer', boxShadow: '0 8px 24px rgba(226,55,68,0.3)'
          }}>
            Subscribe – {PLANS.find(p => p.id === selectedPlan)?.id} ₹{PLANS.find(p => p.id === selectedPlan)?.price}/wk
          </button>
          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#9ca3af', marginTop: '16px' }}>Cancel anytime. No long-term commitment.</p>
        </>
      )}
    </div>
  );
}
