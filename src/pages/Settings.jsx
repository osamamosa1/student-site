import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Settings as SettingsIcon, 
  ChevronRight, 
  Phone, 
  ShieldCheck, 
  Info, 
  FileText, 
  Globe, 
  Award, 
  LogOut,
  ChevronLeft,
  ArrowLeft
} from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('mps_user') || '{}');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const sections = [
    {
      title: 'Settings & Support',
      items: [
        { id: '1', title: 'Contact Us', icon: <Phone size={20} />, path: '/support' },
        { id: '2', title: 'Privacy & Security', icon: <ShieldCheck size={20} />, path: '/privacy' },
        { id: '3', title: 'About App', icon: <Info size={20} />, path: '/about' },
        { id: '4', title: 'Terms & Conditions', icon: <FileText size={20} />, path: '/terms' },
        { id: '5', title: 'Language', icon: <Globe size={20} />, path: '/language' },
      ]
    },
    {
      title: 'Academic Results',
      items: [
        { id: '6', title: 'View Exam Results', icon: <Award size={20} />, path: '/exam-results-list' },
      ]
    }
  ];

  return (
    <div style={{ background: '#f8faff', minHeight: '100vh', color: '#0f172a' }}>
      
      {/* Header */}
      <header className="container" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
         <button onClick={() => navigate(-1)} className="btn btn-outline centered" style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: 'white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <ArrowLeft size={20} color="#1e293b" />
         </button>
         <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Settings</h1>
         <div style={{ flex: 1 }} />
         <button onClick={handleLogout} className="flexCenteredV" style={{ gap: '0.5rem', color: '#ef4444', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>
            <LogOut size={18} /> Logout
         </button>
      </header>

      <div className="container" style={{ maxWidth: '600px', paddingBottom: '5rem' }}>
         {/* Profile Card */}
         <div className="glass-card" style={{ padding: '1.5rem', background: 'white', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', cursor: 'pointer' }} onClick={() => navigate('/profile')}>
            <img 
               src={user.profile_image_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200'} 
               style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover' }} 
               alt="profile"
            />
            <div style={{ flex: 1 }}>
               <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{user.name}</h3>
               <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Student Account • {user.email}</p>
            </div>
            <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Edit</button>
         </div>

         {/* Sections */}
         {sections.map(section => (
            <div key={section.title} style={{ marginBottom: '2.5rem' }}>
               <h4 style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem', paddingLeft: '0.5rem' }}>
                  {section.title}
               </h4>
               <div className="glass-card" style={{ background: 'white', padding: '0.5rem' }}>
                  {section.items.map((item, idx) => (
                     <div 
                        key={item.id} 
                        onClick={() => navigate(item.path)}
                        className="flexCenteredV" 
                        style={{ 
                           padding: '1.25rem 1rem', 
                           gap: '1.25rem', 
                           cursor: 'pointer',
                           borderBottom: idx === section.items.length - 1 ? 'none' : '1px solid #f1f5f9',
                           transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                     >
                        <div className="centered" style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(79, 70, 229, 0.05)', color: 'var(--primary)' }}>
                           {item.icon}
                        </div>
                        <span style={{ flex: 1, fontWeight: 600, color: '#1e293b' }}>{item.title}</span>
                        <ChevronRight size={18} color="#cbd5e1" />
                     </div>
                  ))}
               </div>
            </div>
         ))}
      </div>
      
      <style>{`
        .flexCenteredV { display: flex; align-items: center; }
        .centered { display: flex; align-items: center; justify-content: center; }
        .glass-card { box-shadow: 0 10px 30px rgba(0,0,0,0.03); border: 1px solid #f1f5f9; border-radius: 1.5rem; }
      `}</style>
    </div>
  );
};

export default Settings;
