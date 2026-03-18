import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api';

export default function ShieldTab() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('Standard');
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      id: 'Basic',
      price: '₹29/week',
      features: ['50% income protection', 'Covers heavy rain'],
      recommended: false
    },
    {
      id: 'Standard',
      price: '₹49/week',
      features: ['80% income protection', 'Covers rain and extreme heat'],
      recommended: true
    },
    {
      id: 'Premium',
      price: '₹79/week',
      features: ['100% income protection', 'Rain, heat & severe pollution'],
      recommended: false
    }
  ];

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      await apiFetch('/policy/subscribe', { method: 'POST' });
      navigate('/dashboard');
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-mobile-view" style={{ paddingBottom: '30px', background: '#fcfcfc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', padding: '16px 0' }}>
        <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>←</button>
        <h1 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, color: '#1c1c1c' }}>Choose Your Shield Plan</h1>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ width: '48px', height: '48px', background: '#fff0f1', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 16px auto', boxShadow: '0 4px 15px rgba(226, 55, 68, 0.1)' }}>
          🛡️
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#1c1c1c', marginBottom: '8px' }}>Protect Your Earnings</h2>
        <p style={{ fontSize: '0.9rem', color: '#6b7280', lineHeight: '1.4', padding: '0 16px' }}>
          Get paid even when the weather stops you.<br/>Choose a plan that fits your needs.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {plans.map((plan) => (
          <div 
            key={plan.id}
            onClick={() => setSelectedPlan(plan.id)}
            style={{ 
              background: '#fff', 
              borderRadius: '24px', 
              padding: '24px', 
              position: 'relative',
              cursor: 'pointer',
              border: selectedPlan === plan.id ? '2px solid #e23744' : '1px solid #e5e7eb',
              boxShadow: selectedPlan === plan.id ? '0 10px 30px rgba(226, 55, 68, 0.1)' : '0 4px 15px rgba(0,0,0,0.03)',
              transition: 'all 0.2s ease-in-out'
            }}
          >
            {plan.recommended && (
              <div style={{ position: 'absolute', top: '-12px', right: '24px', background: '#e23744', color: '#fff', fontSize: '0.65rem', fontWeight: '800', padding: '4px 12px', borderRadius: '12px', letterSpacing: '0.5px' }}>
                RECOMMENDED
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1c1c1c', marginBottom: '2px' }}>{plan.id} Shield</h3>
                <div style={{ fontSize: '1rem', fontWeight: '700', color: '#e23744' }}>{plan.price}</div>
              </div>
              {selectedPlan === plan.id ? (
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#e23744', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>✓</div>
              ) : (
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid #e5e7eb' }}></div>
              )}
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {plan.features.map((f, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#4b5563' }}>
                  <span style={{ color: '#2fa84b', fontSize: '1rem' }}>✓</span> {f}
                </li>
              ))}
            </ul>

            {selectedPlan === plan.id && (
              <button 
                onClick={(e) => { e.stopPropagation(); handleSubscribe(); }}
                disabled={loading}
                style={{ 
                  width: '100%', padding: '16px', background: '#e23744', color: '#fff', 
                  border: 'none', borderRadius: '100px', fontSize: '1rem', fontWeight: '700', 
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? <span className="spinner"></span> : 'Select Plan'}
              </button>
            )}
          </div>
        ))}
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#9ca3af', marginTop: '24px' }}>
        Cancel anytime. No long-term commitment.
      </p>

      {/* Padding for Bottom Nav */}
      <div style={{ height: '80px' }}></div>
    </div>
  );
}
