import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { apiFetch, getUser } from '../api';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getUser();
  const [premium, setPremium] = useState(null);
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState({ page: true, subscribe: false });

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    loadData();
  }, []);

  const loadData = useCallback(async () => {
    try {
      const [premData, polData] = await Promise.all([
        apiFetch('/policy/premium'),
        apiFetch('/policy/active'),
      ]);
      setPremium(premData);
      setPolicy(polData.policy);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(prev => ({ ...prev, page: false }));
    }
  }, []);

  const isPolicyActive = !!(policy && (policy.status === 'active' || policy.status === 'ACTIVE'));

  if (loading.page) {
    return <div className="page-loader"><div className="spinner-lg"></div></div>;
  }

  const riskData = [
    { name: 'Rain', value: 45, color: '#3b82f6' },
    { name: 'Heat', value: 30, color: '#f97316' },
    { name: 'Pollution', value: 25, color: '#64748b' }
  ];

  const trendData = [
    { name: 'MON', received: 20, target: 10 },
    { name: 'TUE', received: 45, target: 20 },
    { name: 'WED', received: 85, target: 30 },
    { name: 'THU', received: 60, target: 40 },
    { name: 'FRI', received: 30, target: 20 },
    { name: 'SAT', received: 50, target: 20 },
    { name: 'SUN', received: 20, target: 30 },
  ];

  return (
    <div className="dashboard-mobile-view" style={{ paddingBottom: '30px', background: '#f8f9fa', minHeight: '100vh' }}>
      
      {/* Top Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', position: 'sticky', top: 0, background: '#f8f9fa', zIndex: 10, padding: '16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', background: '#e23744', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1rem' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1c1c1c' }}>Zomato Shield</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button style={{ background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer', position: 'relative' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          </button>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#ffeedc', overflow: 'hidden', border: '2px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
             <img src="https://i.pravatar.cc/100?img=11" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </div>

      {/* User Greeting Card */}
      <div style={{ background: '#fff', borderRadius: '24px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#1c1c1c', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          Hi, {user?.name?.split(' ')[0] || 'Rahul'} <span>👋</span>
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#e23744', fontSize: '0.8rem', fontWeight: '700', marginBottom: '24px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Your earnings are protected by AI
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flex: 1, background: '#f8f9fa', borderRadius: '16px', padding: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', color: '#6b7280', fontWeight: '700', letterSpacing: '0.5px', marginBottom: '4px' }}>DAILY INCOME</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#e23744' }}>₹850</div>
          </div>
          <div style={{ flex: 1, background: '#f8f9fa', borderRadius: '16px', padding: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', color: '#6b7280', fontWeight: '700', letterSpacing: '0.5px', marginBottom: '4px' }}>CITY</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1c1c1c' }}>{user?.city?.substring(0,3).toUpperCase() || 'BLR'}</div>
          </div>
          <div style={{ flex: 1, background: '#f8f9fa', borderRadius: '16px', padding: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', color: '#6b7280', fontWeight: '700', letterSpacing: '0.5px', marginBottom: '4px' }}>HOURS</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1c1c1c' }}>9h</div>
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      <div style={{ background: '#fef9c3', borderRadius: '20px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div style={{ color: '#eab308' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L1 21h22M12 9v4m0 4h.01"/></svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#1c1c1c' }}>High risk tomorrow</div>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#e23744' }}>Est. loss: ₹120</div>
        </div>
        <button style={{ background: '#0f172a', color: '#fff', border: 'none', borderRadius: '100px', padding: '8px 16px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}>
          Upgrade Coverage
        </button>
      </div>

      {/* Policy Details */}
      <div style={{ background: '#fff', borderRadius: '24px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1c1c1c', margin: 0 }}>Policy Details</h2>
          {isPolicyActive ? (
            <div style={{ background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '100px', fontSize: '0.65rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#166534' }}></span> ACTIVE
            </div>
          ) : (
            <div style={{ background: '#fee2e2', color: '#991b1b', padding: '4px 10px', borderRadius: '100px', fontSize: '0.65rem', fontWeight: '800' }}>INACTIVE</div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: '500' }}>Premium</span>
            <span style={{ fontSize: '0.9rem', color: '#1c1c1c', fontWeight: '800' }}>{premium?.amount ? `₹${premium.amount}/week` : '₹49 / week'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: '500' }}>Coverage</span>
            <span style={{ fontSize: '0.85rem', color: '#e23744', fontWeight: '700' }}>Full Income Protection</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: '500' }}>Policy ID</span>
            <span style={{ background: '#f3f4f6', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', color: '#4b5563', fontWeight: '700' }}>{policy?.id ? policy.id.split('-')[0].toUpperCase() : 'ZS-88291'}</span>
          </div>
        </div>
      </div>

      {/* Earnings Protection */}
      <div style={{ background: '#fff', borderRadius: '24px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1c1c1c', margin: '0 0 16px 0' }}>Earnings Protection</h2>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '600' }}>Weekly Total: ₹5,800</span>
          <span style={{ fontSize: '0.75rem', color: '#e23744', fontWeight: '800' }}>68% protected</span>
        </div>

        {/* Progress Bar */}
        <div style={{ height: '8px', background: '#fce4e5', borderRadius: '4px', overflow: 'hidden', display: 'flex', marginBottom: '16px' }}>
          <div style={{ width: '68%', background: '#22c55e', height: '100%' }}></div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.65rem', color: '#6b7280', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}></span> PROTECTED
            </div>
            <span style={{ fontSize: '1rem', fontWeight: '800', color: '#1c1c1c', marginTop: '4px' }}>₹4,200</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.65rem', color: '#6b7280', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e23744' }}></span> AT-RISK
            </div>
            <span style={{ fontSize: '1rem', fontWeight: '800', color: '#1c1c1c', marginTop: '4px' }}>₹1,600</span>
          </div>
        </div>
      </div>

      {/* Risk Distribution */}
      <div style={{ background: '#fff', borderRadius: '24px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1c1c1c', margin: '0 0 16px 0' }}>Risk Distribution</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '120px', height: '120px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={riskData} cx="50%" cy="50%" innerRadius={0} outerRadius={60} dataKey="value" stroke="none">
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            {riskData.map(item => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#4b5563', fontWeight: '500' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }}></span>
                {item.name} ({item.value}%)
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Claims Trend */}
      <div style={{ background: '#fff', borderRadius: '24px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1c1c1c', margin: '0 0 24px 0' }}>Claims Trend</h2>
        <div style={{ height: '160px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280', fontWeight: '600' }} />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="received" stackId="a" fill="#e23744" radius={[0, 0, 4, 4]} barSize={24} />
              <Bar dataKey="target" stackId="a" fill="#fce4e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p style={{ textAlign: 'center', fontSize: '0.65rem', color: '#9ca3af', marginTop: '16px', margin: 0 }}>
          Darker bars: Claims Received | Lighter: Target Protection
        </p>
      </div>

      {/* Claims Summary */}
      <div style={{ background: '#fff', borderRadius: '24px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1c1c1c', margin: '0 0 16px 0' }}>Claims Summary</h2>
        <div style={{ background: '#f8f9fa', borderRadius: '20px', padding: '24px', textAlign: 'center', marginBottom: '16px' }}>
          <div style={{ fontSize: '0.65rem', color: '#9ca3af', fontWeight: '800', letterSpacing: '1px', marginBottom: '4px' }}>TOTAL AMOUNT RECEIVED</div>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#22c55e' }}>₹2,450</div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flex: 1, background: '#dcfce7', borderRadius: '16px', padding: '16px 8px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#166534' }}>12</div>
            <div style={{ fontSize: '0.6rem', color: '#166534', fontWeight: '800', letterSpacing: '0.5px' }}>ACCEPTED</div>
          </div>
          <div style={{ flex: 1, background: '#fee2e2', borderRadius: '16px', padding: '16px 8px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#991b1b' }}>2</div>
            <div style={{ fontSize: '0.6rem', color: '#991b1b', fontWeight: '800', letterSpacing: '0.5px' }}>REJECTED</div>
          </div>
          <div style={{ flex: 1, background: '#fef9c3', borderRadius: '16px', padding: '16px 8px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#a16207' }}>3</div>
            <div style={{ fontSize: '0.6rem', color: '#a16207', fontWeight: '800', letterSpacing: '0.5px' }}>PENDING</div>
          </div>
        </div>
      </div>

      {/* Padding for Bottom Nav */}
      <div style={{ height: '80px' }}></div>
    </div>
  );
}
