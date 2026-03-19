import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch, setAuth } from '../api';

export default function Login() {
  const navigate = useNavigate();
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [form, setForm] = useState({ name: '', city: '', dailyIncome: '', hours: '' });
  const [error, setError] = useState('');
  const [demoMessage, setDemoMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const CITIES = ["Chennai", "Bangalore", "Hyderabad", "Mumbai", "Delhi"];

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async () => {
    if (!form.name || !form.city || !form.dailyIncome || !form.hours) {
      throw new Error("Please fill all fields");
    }
    if (form.city === "") {
      throw new Error("Please select a city");
    }

    const payload = {
      name: form.name,
      email: form.name.replace(/\s+/g, '').toLowerCase() + '@zomato.com',
      password: 'password123',
      city: form.city.toLowerCase(),
      dailyIncome: Number(form.dailyIncome),
      hoursPerDay: Number(form.hours)
    };

    let data;
    try {
      data = await apiFetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    } catch (err) {
      // If backend fails or gives error
      if (err.message.includes('Network Error')) {
        setDemoMessage('Backend not connected, running in demo mode');
        // Offline fallback: mockup a user and token
        const mockUser = { ...payload, isVerified: true, id: 'demo_' + Date.now() };
        data = { token: 'demo_token_123', user: mockUser };
      } else {
        // Maybe try login if already exists
        try {
          data = await apiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email: payload.email, password: payload.password })
          });
        } catch (loginErr) {
           throw err; // throw original signup error if login also fails
        }
      }
    }

    // Force user data to exactly what was entered, ensuring isVerified is true for smooth flow
    const userData = {
      ...(data?.user || {}),
      name: form.name,
      city: form.city,
      dailyIncome: form.dailyIncome,
      hours: form.hours,
      isVerified: true
    };

    // Save offline map of users for strictly "Login" mode local check
    const existingUsers = JSON.parse(localStorage.getItem('zs_users_db') || '{}');
    existingUsers[form.name.toLowerCase()] = userData;
    localStorage.setItem('zs_users_db', JSON.stringify(existingUsers));

    setAuth(data?.token || 'demo_token_123', userData);
  };

  const handleLogin = async () => {
    if (!form.name) {
      throw new Error("Please enter your Name");
    }

    const userNameKey = form.name.toLowerCase();
    
    // First try backend if possible
    try {
      const email = userNameKey.replace(/\s+/g, '') + '@zomato.com';
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password: 'password123' })
      });
      const userData = { ...data.user, isVerified: true };
      setAuth(data.token, userData);
      return;
    } catch (err) {
      if (err.message.includes('Network Error')) {
        setDemoMessage('Backend not connected, running in demo mode');
      }
      
      // Fallback: Check local storage
      const existingUsers = JSON.parse(localStorage.getItem('zs_users_db') || '{}');
      const foundUser = existingUsers[userNameKey];
      
      if (foundUser) {
        setAuth('demo_token_123', { ...foundUser, isVerified: true });
        return; // success
      } else {
        throw new Error("User not found");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setDemoMessage('');
    setLoading(true);
    
    try {
      if (isLoginMode) {
        await handleLogin();
      } else {
        await handleSignup();
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fcfcfc', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <button style={{ position: 'absolute', left: '20px', background: '#fff0f1', color: '#e23744', border: 'none', width: '32px', height: '32px', borderRadius: '50%', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', cursor: 'pointer' }}>×</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '24px', height: '24px', background: '#e23744', borderRadius: '6px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>🛡️</div>
          <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1c1c1c' }}>Zomato Shield</span>
        </div>
      </div>

      <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Shield Graphic Banner */}
        <div style={{ 
          width: '100%', 
          background: '#fff0f1', 
          borderRadius: '32px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '40px 20px',
          marginBottom: '32px',
          border: '1px solid #ffe4e6'
        }}>
          <div style={{ width: '48px', height: '48px', background: '#e23744', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.5rem', marginBottom: '12px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1c1c1c' }}>AI Protection</span>
        </div>

        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#141414', marginBottom: '8px' }}>Secure Your Pay</h1>
        <p style={{ fontSize: '0.95rem', color: '#4b5563', marginBottom: '24px' }}>Protect your daily earnings with AI</p>

        {error && <div style={{ width: '100%', background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '12px', fontSize: '0.85rem', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}
        {demoMessage && <div style={{ width: '100%', background: '#fef3c7', color: '#92400e', padding: '12px', borderRadius: '12px', fontSize: '0.85rem', marginBottom: '16px', textAlign: 'center' }}>{demoMessage}</div>}

        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151' }}>Name</label>
            <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '0 16px', overflow: 'hidden' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <input 
                name="name" type="text" value={form.name} onChange={handleChange} required
                placeholder="Your Name"
                style={{ width: '100%', padding: '16px 12px', border: 'none', background: 'transparent', fontSize: '1rem', outline: 'none' }}
              />
            </div>
          </div>

          {!isLoginMode && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                 <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151' }}>City</label>
                 <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '0 16px', overflow: 'hidden' }}>
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                   <select 
                     name="city" value={form.city} onChange={handleChange} required
                     style={{ width: '100%', padding: '16px 12px', border: 'none', background: 'transparent', fontSize: '1rem', outline: 'none', appearance: 'none' }}
                   >
                     <option value="" disabled>Select City</option>
                     {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                   </select>
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" style={{ pointerEvents: 'none' }}><polyline points="6 9 12 15 18 9"/></svg>
                 </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                   <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151' }}>Daily Income</label>
                   <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '0 16px', overflow: 'hidden' }}>
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
                     <span style={{ color: '#6b7280', fontSize: '1rem', marginLeft: '8px' }}>₹</span>
                     <input 
                       name="dailyIncome" type="number" value={form.dailyIncome} onChange={handleChange} required
                       placeholder="800"
                       style={{ width: '100%', padding: '16px 8px', border: 'none', background: 'transparent', fontSize: '1rem', outline: 'none' }}
                     />
                   </div>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                   <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151' }}>Hours</label>
                   <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '0 16px', overflow: 'hidden' }}>
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                     <input 
                       name="hours" type="number" value={form.hours} onChange={handleChange} required
                       placeholder="8 hrs"
                       style={{ width: '100%', padding: '16px 12px', border: 'none', background: 'transparent', fontSize: '1rem', outline: 'none' }}
                     />
                   </div>
                </div>
              </div>
            </>
          )}

          <button type="submit" disabled={loading} style={{ 
            width: '100%', padding: '20px', background: '#dd3333', color: '#fff', 
            border: 'none', borderRadius: '100px', fontSize: '1.15rem', fontWeight: '800', 
            marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 8px 20px rgba(226, 55, 68, 0.3)'
          }}>
             {loading ? <span className="spinner"></span> : <>
               <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
               {isLoginMode ? 'Login' : 'Start Protection'}
             </>}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button 
            type="button" 
            onClick={() => { setIsLoginMode(!isLoginMode); setError(''); setDemoMessage(''); }}
            style={{ background: 'none', border: 'none', color: '#e23744', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isLoginMode ? "New user? Create account" : "Already have account? Login"}
          </button>
        </div>

        <p style={{ marginTop: '24px', fontSize: '0.85rem', color: '#6b7280' }}>
          By continuing, you agree to our <span style={{ color: '#e23744', fontWeight: '700' }}>Terms of Service</span>
        </p>

      </div>
    </div>
  );
}
