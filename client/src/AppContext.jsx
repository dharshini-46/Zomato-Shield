import React, { createContext, useContext, useState } from 'react';
import { getUser } from './api';

const AppContext = createContext(null);

const INITIAL_CLAIMS = [
  { id: 1, type: 'Heavy Rain', date: 'Jul 12', status: 'Accepted', amount: 320 },
  { id: 2, type: 'Severe Heat', date: 'Jul 08', status: 'Accepted', amount: 150 },
  { id: 3, type: 'High Pollution', date: 'Jun 30', status: 'Rejected', amount: 0 },
  { id: 4, type: 'Storm Alert', date: 'Jun 25', status: 'Processing', amount: 200 },
];

const INITIAL_EARNINGS = [
  { id: 1, date: 'Jul 12', amount: 320, reason: 'Heavy Rain Claim' },
  { id: 2, date: 'Jul 08', amount: 150, reason: 'Severe Heat Claim' },
];

export function AppProvider({ children }) {
  const [policy, setPolicy] = useState(() => {
    const saved = localStorage.getItem('zs_policy');
    return saved ? JSON.parse(saved) : null;
  });
  const [claims, setClaims] = useState(() => {
    const saved = localStorage.getItem('zs_claims');
    return saved ? JSON.parse(saved) : INITIAL_CLAIMS;
  });
  const [earnings, setEarnings] = useState(() => {
    const saved = localStorage.getItem('zs_earnings');
    return saved ? JSON.parse(saved) : INITIAL_EARNINGS;
  });

  const subscribePolicy = (plan) => {
    const newPolicy = {
      plan,
      status: 'ACTIVE',
      subscribedAt: new Date().toISOString(),
      premium: plan === 'Basic' ? 29 : plan === 'Standard' ? 49 : 79,
      coverage: plan === 'Basic' ? '50% income protection' : plan === 'Standard' ? '80% income protection' : '100% income protection',
      policyId: 'ZS-' + Math.floor(10000 + Math.random() * 90000),
    };
    setPolicy(newPolicy);
    localStorage.setItem('zs_policy', JSON.stringify(newPolicy));
    return newPolicy;
  };

  const requestClaim = (type) => {
    const types = {
      'Heavy Rain': { amount: 320 },
      'Severe Heat': { amount: 150 },
      'High Pollution': { amount: 200 },
      'Storm Alert': { amount: 250 },
    };

    const info = types[type] || { amount: 100 };
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

    const newClaim = {
      id: Date.now(),
      type,
      date: dateStr,
      status: 'Processing',
      amount: info.amount,
    };

    const updatedClaims = [newClaim, ...claims];
    setClaims(updatedClaims);
    localStorage.setItem('zs_claims', JSON.stringify(updatedClaims));

    // After 1 second simulate acceptance
    setTimeout(() => {
      const accepted = updatedClaims.map(c =>
        c.id === newClaim.id ? { ...c, status: 'Accepted' } : c
      );
      setClaims(accepted);
      localStorage.setItem('zs_claims', JSON.stringify(accepted));

      // Add to earnings
      const newEarning = { id: Date.now(), date: dateStr, amount: info.amount, reason: `${type} Claim` };
      const updatedEarnings = [newEarning, ...earnings];
      setEarnings(updatedEarnings);
      localStorage.setItem('zs_earnings', JSON.stringify(updatedEarnings));
    }, 1500);

    return newClaim;
  };

  return (
    <AppContext.Provider value={{ policy, subscribePolicy, claims, earnings, requestClaim }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
