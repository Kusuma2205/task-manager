import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password) return setError('All fields are required');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      const res = await API.post('/auth/register', form);
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '10px', color: 'white',
    fontSize: '14px', outline: 'none', boxSizing: 'border-box'
  };

  const labelStyle = {
    color: 'rgba(255,255,255,0.8)', fontSize: '13px',
    fontWeight: '600', display: 'block', marginBottom: '8px'
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            background: 'rgba(255,255,255,0.1)', borderRadius: '16px',
            padding: '12px 20px', display: 'inline-flex', alignItems: 'center',
            gap: '10px', marginBottom: '16px'
          }}>
            <div style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '8px', padding: '6px 10px' }}>
              <span style={{ color: 'white', fontWeight: '900', fontSize: '14px' }}>TM</span>
            </div>
            <span style={{ color: 'white', fontWeight: '800', fontSize: '18px' }}>TaskFlow</span>
          </div>
          <h1 style={{ color: 'white', fontSize: '26px', fontWeight: '800', margin: '0 0 8px' }}>Create account</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', margin: 0 }}>Join your team on TaskFlow</p>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '32px'
        }}>
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#fca5a5', padding: '12px 16px', borderRadius: '10px',
              marginBottom: '20px', fontSize: '14px'
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Full Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" style={inputStyle} />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" style={inputStyle} />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min 6 characters" style={inputStyle} />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Your Role</label>
              <select name="role" value={form.role} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="member" style={{ background: '#1e1b4b' }}>👤 Member — View and update assigned tasks</option>
                <option value="admin" style={{ background: '#1e1b4b' }}>👑 Admin — Full access to all features</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '13px',
                background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                border: 'none', borderRadius: '10px', color: 'white',
                fontSize: '15px', fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer', boxSizing: 'border-box'
              }}
            >
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginTop: '20px', marginBottom: 0 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#a5b4fc', fontWeight: '600', textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;