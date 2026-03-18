import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch, setAuth } from '../api';

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', city: 'Mumbai' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setAuth(data.token, data.user);
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
        <button onClick={() => navigate('/login')} style={{ position: 'absolute', left: '20px', background: '#fff0f1', color: '#e23744', border: 'none', width: '32px', height: '32px', borderRadius: '50%', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', cursor: 'pointer' }}>×</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '24px', height: '24px', background: '#e23744', borderRadius: '6px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>🛡️</div>
          <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1c1c1c' }}>Zomato Shield</span>
        </div>
      </div>

      <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Shield Graphic */}
        <div style={{ 
          width: '80px', height: '80px', 
          background: '#fff0f1', borderRadius: '24px', 
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 10px 30px rgba(226, 55, 68, 0.1)', marginBottom: '24px' 
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '4px' }}>🛡️</div>
          <span style={{ fontSize: '0.55rem', fontWeight: '700', color: '#1c1c1c' }}>AI Protection</span>
        </div>

        <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#1c1c1c', marginBottom: '8px' }}>Secure Your Pay</h1>
        <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '24px' }}>Protect your daily earnings with AI</p>

        {error && <div style={{ width: '100%', background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '12px', fontSize: '0.85rem', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280' }}>Name</label>
            <input 
              name="name" type="text" value={form.name} onChange={handleChange} required
              placeholder="Your Name"
              style={{ width: '100%', padding: '14px', borderRadius: '16px', border: '1px solid #e5e7eb', background: '#fff', fontSize: '1rem', outline: 'none' }}
              onFocus={(e) => e.target.style.borderColor = '#e23744'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
             <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280' }}>Email</label>
             <input 
               name="email" type="email" value={form.email} onChange={handleChange} required
               placeholder="rajesh@zomato.com"
               style={{ width: '100%', padding: '14px', borderRadius: '16px', border: '1px solid #e5e7eb', background: '#fff', fontSize: '1rem', outline: 'none' }}
               onFocus={(e) => e.target.style.borderColor = '#e23744'}
               onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
             />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
             <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280' }}>Password</label>
             <input 
               name="password" type="password" value={form.password} onChange={handleChange} required
               placeholder="••••••••"
               style={{ width: '100%', padding: '14px', borderRadius: '16px', border: '1px solid #e5e7eb', background: '#fff', fontSize: '1rem', outline: 'none' }}
               onFocus={(e) => e.target.style.borderColor = '#e23744'}
               onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
             />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
             <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280' }}>City</label>
             <select 
               name="city" value={form.city} onChange={handleChange} required
               style={{ width: '100%', padding: '14px', borderRadius: '16px', border: '1px solid #e5e7eb', background: '#fff', fontSize: '1rem', outline: 'none', appearance: 'none' }}
               onFocus={(e) => e.target.style.borderColor = '#e23744'}
               onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
             >
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Bangalore">Bangalore</option>
             </select>
          </div>

          <button type="submit" disabled={loading} style={{ 
            width: '100%', padding: '16px', background: '#e23744', color: '#fff', 
            border: 'none', borderRadius: '100px', fontSize: '1.1rem', fontWeight: '700', 
            marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 8px 20px rgba(226, 55, 68, 0.25)'
          }}>
             {loading ? <span className="spinner"></span> : <>
               ⚡ Start Protection
             </>}
          </button>
        </form>

        <p style={{ marginTop: '20px', fontSize: '0.75rem', color: '#9ca3af' }}>
          By continuing, you agree to our <span style={{ color: '#e23744', fontWeight: '600' }}>Terms of Service</span>
        </p>

        <p style={{ marginTop: '16px', fontSize: '0.9rem', color: '#4b5563', paddingBottom: '20px' }}>
          Already have an account? <Link to="/login" style={{ color: '#e23744', fontWeight: '700', textDecoration: 'none' }}>Log In</Link>
        </p>
      </div>
    </div>
  );
}
