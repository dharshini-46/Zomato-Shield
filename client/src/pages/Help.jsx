import { useNavigate } from 'react-router-dom';

export default function Help() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#fcfcfc', paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', position: 'sticky', top: 0, background: '#fcfcfc', zIndex: 10 }}>
        <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1c1c1c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        </button>
        <h1 style={{ flex: 1, textAlign: 'center', fontSize: '1.1rem', fontWeight: '700', color: '#1c1c1c', margin: 0, marginLeft: '-24px' }}>
          How Shield Works
        </h1>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Banner */}
        <div style={{ 
          background: 'linear-gradient(135deg, #fce4e5 0%, #faecee 100%)', 
          borderRadius: '32px', padding: '32px 20px', 
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          textAlign: 'center', position: 'relative', overflow: 'hidden',
          marginBottom: '24px'
        }}>
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: '#e23744'
          }} />
          <div style={{
            width: '48px', height: '48px', background: '#e23744', borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1c1c1c', marginBottom: '8px' }}>Zomato Shield</h2>
          <p style={{ fontSize: '0.9rem', color: '#4b5563', margin: 0 }}>Your earnings, protected.</p>
        </div>

        <p style={{ fontSize: '0.95rem', color: '#374151', textAlign: 'center', lineHeight: '1.6', marginBottom: '32px', padding: '0 8px' }}>
          The parametric insurance system designed to protect your earnings during extreme conditions.
        </p>

        {/* Features List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
          <FeatureItem 
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e23744" strokeWidth="2"><path d="M12 2a5 5 0 0 0-5 5v2H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5z"></path></svg>}
            background="#fee2e2"
            title="Smart Detection"
            desc="Our AI monitors weather and pollution in your delivery zone in real-time."
          />
          <FeatureItem 
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e23744" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>}
            background="#fee2e2"
            title="Automatic Trigger"
            desc="If conditions (like rain >50mm) are met, your claim is triggered automatically."
          />
          <FeatureItem 
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e23744" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>}
            background="#fee2e2"
            title="Instant Payout"
            desc="Money is credited to your wallet within minutes—no paperwork needed."
          />
          <FeatureItem 
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e23744" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>}
            background="#fee2e2"
            title="Stay Protected"
            desc="Continue working safely knowing your earnings are covered regardless of volume."
          />
        </div>

        {/* FAQs */}
        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '24px', height: '24px', background: '#e23744', borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 'bold' }}>?</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1c1c1c', margin: 0 }}>Frequently Asked Questions</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <FAQItem title="What is parametric insurance?" />
          <FAQItem title="When do I get paid?" />
        </div>

      </div>
    </div>
  );
}

function FeatureItem({ icon, background, title, desc }) {
  return (
    <div style={{ background: '#fff', borderRadius: '24px', padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#1c1c1c', margin: '0 0 6px 0' }}>{title}</h4>
        <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: 0, lineHeight: '1.5' }}>{desc}</p>
      </div>
    </div>
  );
}

function FAQItem({ title }) {
  return (
    <div style={{ background: '#fff', borderRadius: '20px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
      <span style={{ fontSize: '0.95rem', color: '#374151', fontWeight: '500' }}>{title}</span>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
    </div>
  );
}
