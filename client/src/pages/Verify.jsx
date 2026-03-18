import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setIsVerified } from '../api';

export default function Verify() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = (e) => {
    e.preventDefault();
    if (otp !== '1234' && otp.length > 0) {
      setError('Invalid OTP. For demo, use 1234 or click "This is me"');
      return;
    }
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setIsVerified(true);
      navigate('/dashboard');
    }, 1000);
  };

  const handleBypass = () => {
    setLoading(true);
    setTimeout(() => {
      setIsVerified(true);
      navigate('/dashboard');
    }, 500);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fcfcfc', display: 'flex', flexDirection: 'column', padding: '24px' }}>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        
        <div style={{ 
          width: '80px', height: '80px', 
          background: '#fff0f1', borderRadius: '50%', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '24px', color: '#e23744', fontSize: '2rem'
        }}>
          ⚠️
        </div>

        <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1c1c1c', marginBottom: '8px', textAlign: 'center' }}>
          Suspicious Activity Detected
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '32px', textAlign: 'center', lineHeight: '1.5' }}>
          We noticed an unusual login attempt. Please verify your identity using the OTP sent to your registered phone number.
        </p>

        {error && <div style={{ width: '100%', background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '12px', fontSize: '0.85rem', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleVerify} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#4b5563' }}>Enter OTP</label>
            <input 
              name="otp" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required
              placeholder="4-digit OTP"
              maxLength={4}
              style={{ width: '100%', padding: '16px', borderRadius: '16px', border: '1px solid #e5e7eb', background: '#fff', fontSize: '1.2rem', textAlign: 'center', outline: 'none', letterSpacing: '8px' }}
              onFocus={(e) => e.target.style.borderColor = '#e23744'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          <button type="submit" disabled={loading} style={{ 
            width: '100%', padding: '18px', background: '#e23744', color: '#fff', 
            border: 'none', borderRadius: '100px', fontSize: '1.1rem', fontWeight: '700', 
            marginTop: '8px', cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 8px 20px rgba(226, 55, 68, 0.25)'
          }}>
             {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <div style={{ marginTop: '32px', width: '100%', borderTop: '1px solid #e5e7eb', paddingTop: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
           <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '16px' }}>Trouble receiving OTP?</p>
           <button onClick={handleBypass} disabled={loading} style={{ 
              width: '100%', padding: '16px', background: '#fff', color: '#1c1c1c', 
              border: '1px solid #e5e7eb', borderRadius: '100px', fontSize: '1rem', fontWeight: '700', 
              cursor: loading ? 'not-allowed' : 'pointer'
            }}>
               "This is me" (Bypass)
            </button>
        </div>

      </div>
    </div>
  );
}
