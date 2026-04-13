import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Home, Book, MapPin, Save, Loader2, Camera } from 'lucide-react';
import { authApi } from '../api';

const Profile = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('mps_user') || '{}'));
  const [formData, setFormData] = useState({ ...user });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      // Assuming you have an updateProfile endpoint
      // const response = await authApi.updateProfile(formData);
      // setUser(response.data);
      // localStorage.setItem('user', JSON.stringify(response.data));
      // For now, mock success:
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage('Error updating profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', padding: '3rem' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>My <span className="text-gradient">Profile</span></h1>

        <form onSubmit={handleUpdate} className="glass-card" style={{ padding: '3rem' }}>
          <div className="centered" style={{ marginBottom: '3rem', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <img src={user.profile_image_url || 'https://ui-avatars.com/api/?name=' + user.name} style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid var(--primary)' }} />
              <button type="button" className="glass centered" style={{ position: 'absolute', bottom: 0, right: 0, width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer' }}>
                <Camera size={18} />
              </button>
            </div>
            <div>
               <h2 style={{ fontSize: '1.5rem' }}>{user.name}</h2>
               <p style={{ color: 'var(--text-sub)', textAlign: 'center' }}>Student • {user.grade?.name || 'N/A'}</p>
            </div>
          </div>

          {message && <div className="glass" style={{ padding: '1rem', marginBottom: '2rem', borderColor: message.includes('Error') ? '#ef4444' : '#10b981', color: message.includes('Error') ? '#f87171' : '#10b981' }}>{message}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
             <div className="input-group">
                <label className="input-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                   <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                   <input className="input-field" style={{ paddingLeft: '3rem' }} value={formData.Name || ''} onChange={e => setFormData({...formData, Name: e.target.value})} />
                </div>
             </div>
             
             <div className="input-group">
                <label className="input-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                   <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                   <input className="input-field" style={{ paddingLeft: '3rem' }} value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
             </div>

             <div className="input-group">
                <label className="input-label">Phone Number</label>
                <div style={{ position: 'relative' }}>
                   <Phone size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                   <input className="input-field" style={{ paddingLeft: '3rem' }} value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
             </div>

             <div className="input-group">
                <label className="input-label">Parent Phone</label>
                <div style={{ position: 'relative' }}>
                   <Phone size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                   <input className="input-field" style={{ paddingLeft: '3rem' }} value={formData.parent_phone || ''} onChange={e => setFormData({...formData, parent_phone: e.target.value})} />
                </div>
             </div>

             <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                <label className="input-label">School Name</label>
                <div style={{ position: 'relative' }}>
                   <Book size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                   <input className="input-field" style={{ paddingLeft: '3rem' }} value={formData.school_name || ''} onChange={e => setFormData({...formData, school_name: e.target.value})} />
                </div>
             </div>

             <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                <label className="input-label">Address</label>
                <div style={{ position: 'relative' }}>
                   <Home size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                   <input className="input-field" style={{ paddingLeft: '3rem' }} value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} />
                </div>
             </div>
          </div>

          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '2rem', padding: '1rem' }} disabled={loading}>
             {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
             {loading ? 'Saving Changes...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
