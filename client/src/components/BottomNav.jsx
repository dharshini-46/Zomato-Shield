import React from 'react';

const TABS = [
  { id: 'Home', label: 'Home', icon: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.2">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )},
  { id: 'History', label: 'History', icon: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <circle cx="12" cy="12" r="10" fill={active ? "currentColor" : "none"} stroke="currentColor"/>
      {active && <polyline points="12 6 12 12 16 14" stroke="white" strokeWidth="2"/>}
      {!active && <polyline points="12 6 12 12 16 14"/>}
    </svg>
  )},
  { id: 'Policy', label: 'Policy', icon: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  )},
  { id: 'Earnings', label: 'Earnings', icon: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <line x1="12" y1="1" x2="12" y2="23" stroke={active ? "#e23744" : "currentColor"}/>
      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke={active ? "#e23744" : "currentColor"}/>
    </svg>
  )},
  { id: 'Profile', label: 'Profile', icon: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.2">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  )},
];

export default function BottomNav({ activeTab, setActiveTab }) {
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: '480px',
      background: '#fff', boxShadow: '0 -1px 0 #f3f4f6, 0 -8px 30px rgba(0,0,0,0.04)',
      borderTop: '1px solid #f3f4f6', display: 'flex', zIndex: 100,
      paddingBottom: 'env(safe-area-inset-bottom)'
    }}>
      {TABS.map(tab => {
        const active = activeTab === tab.id;
        return (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', padding: '10px 4px 12px 4px', cursor: 'pointer',
              color: active ? '#e23744' : '#9ca3af',
              transition: 'color 0.2s ease',
            }}
          >
            {tab.icon(active)}
            <span style={{ fontSize: '0.65rem', fontWeight: active ? '800' : '600', marginTop: '4px', letterSpacing: '0.5px' }}>
              {tab.label}
            </span>
          </div>
        );
      })}
    </nav>
  );
}
