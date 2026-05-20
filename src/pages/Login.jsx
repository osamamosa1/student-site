import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Loader2, Globe } from 'lucide-react';
import axios from 'axios';
import logo from '../assets/logo.png';
import { authApi } from '../api';

const Login = () => {
  const [formData, setFormData] = useState({ login: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get('/api/v1/settings/1');
        setSettings(res.data.data);
      } catch (err) {
        console.error("Settings load failed");
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Static Device Fingerprinting
      const getFingerprint = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = "top";
        ctx.font = "14px 'Arial'";
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = "#f60";
        ctx.fillRect(125,1,62,20);
        ctx.fillStyle = "#069";
        ctx.fillText("mps_platform_fp", 2, 15);
        ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
        ctx.fillText("mps_platform_fp", 4, 17);
        const b64 = canvas.toDataURL().replace("data:image/png;base64,","");
        const bin = atob(b64);
        const crc = (str) => {
          let hash = 0;
          for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0;
          }
          return hash;
        };
        return crc(bin + navigator.userAgent + screen.width + screen.height).toString();
      };

      let deviceUuid = localStorage.getItem('device_uuid');
      if (!deviceUuid) {
        deviceUuid = getFingerprint();
        localStorage.setItem('device_uuid', deviceUuid);
      }
      
      const response = await authApi.login({ ...formData, device_uuid: deviceUuid });
      if (response.status === 'success' || response.token) {
        localStorage.setItem('mps_token', response.token);
        localStorage.setItem('mps_user', JSON.stringify(response.data || {}));
        navigate('/');
      }
    } catch (err) {
      setError(err.message || (err.response?.data?.message) || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container centered" style={{ minHeight: '100vh', padding: '2rem' }}>
      <div className="glass-card login-card fade-in" style={{ width: '100%', maxWidth: '420px', padding: '3rem 2.5rem' }}>
        <div className="centered" style={{ marginBottom: '2rem', flexDirection: 'column', gap: '0.8rem' }}>
          <div className="glass centered" style={{ width: '80px', height: '80px', borderRadius: '1.25rem', overflow: 'hidden', background: 'white' }}>
            {settings?.logo_url ? (
                <img src={settings.logo_url} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="Logo" />
            ) : (
                <Globe size={40} color="var(--primary)" />
            )}
          </div>
          <h2 style={{ fontSize: '1.75rem', textAlign: 'center' }}>{settings?.app_name || "Welcome Back"}</h2>
          <p style={{ color: 'var(--text-sub)', fontSize: '0.875rem' }}>Login to your student account</p>
        </div>

        {error && (
          <div className="glass" style={{ padding: '0.75rem 1rem', marginBottom: '1.5rem', borderColor: '#ef4444', background: 'rgba(239, 68, 68, 0.05)', color: '#f87171', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Email or Phone</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                className="input-field"
                style={{ paddingLeft: '3rem' }}
                type="text"
                placeholder="Enter your email or phone"
                value={formData.login}
                onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <div className="space-between" style={{ marginBottom: '0.5rem' }}>
              <label className="input-label" style={{ marginBottom: '0' }}>Password</label>
              <a href="#" style={{ fontSize: '0.75rem', color: 'var(--primary)', textDecoration: 'none' }}>Forgot password?</a>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                className="input-field"
                style={{ paddingLeft: '3rem' }}
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </div>

          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : <LogIn size={20} />}
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-sub)', fontSize: '0.875rem' }}>
          Don't have an account? <a href="#" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Join now</a>
        </p>
      </div>

      <style>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Login;
