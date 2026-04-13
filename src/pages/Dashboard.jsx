import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  Layout, 
  BookOpen, 
  PlayCircle, 
  Star, 
  ChevronRight, 
  TrendingUp, 
  Clock, 
  Users,
  Award,
  LogOut,
  Calendar,
  Grid,
  Menu,
  GraduationCap,
  ArrowRight,
  User,
  Settings
} from 'lucide-react';
import { homeApi, studentApi } from '../api';

const Dashboard = () => {
  const [homeData, setHomeData] = useState(null);
  const [standaloneExams, setStandaloneExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('mps_user') || '{}');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [homeRes, examsRes] = await Promise.all([
          homeApi.getStudentHome(),
          studentApi.getStandaloneExams()
        ]);
        setHomeData(homeRes.data);
        setStandaloneExams(examsRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) return <div className="centered" style={{ height: '100vh', background: '#f8faff' }}>Loading your dashboard...</div>;

  return (
    <div style={{ background: '#f8faff', minHeight: '100vh', color: '#0f172a' }}>
      
      {/* --- PREMIUM HEADER (Matching StudentHomeHeader) --- */}
      <div 
        style={{ 
          background: 'linear-gradient(135deg, var(--primary), #4338ca)', 
          padding: '4rem 2rem 5rem 2rem', 
          borderRadius: '0 0 3rem 3rem',
          boxShadow: '0 10px 30px rgba(79, 70, 229, 0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
         {/* Decorative Circles */}
         <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
         <div style={{ position: 'absolute', bottom: '-20px', left: '10%', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />

         <div className="container" style={{ position: 'relative', zIndex: 10 }}>
            {/* Top Bar: Profile & Notifications */}
            <div className="space-between" style={{ marginBottom: '3.5rem' }}>
               <div className="flexCenteredV" style={{ gap: '1.25rem' }}>
                  <div className="glass" style={{ width: '56px', height: '56px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', padding: '2px', overflow: 'hidden' }}>
                     <img src={user.profile_image_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200'} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  </div>
                  <div>
                     <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>Welcome back,</p>
                     <h2 style={{ color: 'white', fontSize: '1.4rem', fontWeight: 700 }}>{user.name}</h2>
                  </div>
               </div>
               <div className="flex" style={{ gap: '1rem' }}>
                  <button className="centered" style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
                     <Bell size={22} />
                  </button>
                  <button onClick={() => navigate('/settings')} className="centered" style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
                     <Settings size={22} />
                  </button>
               </div>
            </div>

            {/* --- CURRENT EVENTS BAR (Matching tab_to_see_exams) --- */}
            <div 
               onClick={() => navigate('/standalone-exams')}
               style={{ 
                  background: 'rgba(255,255,255,0.12)', 
                  borderRadius: '1.5rem', 
                  padding: '1.25rem 2rem', 
                  border: '1.5px solid rgba(255,255,255,0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem'
               }}
               onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
               onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
            >
               <div style={{ padding: '0.75rem', background: 'rgba(245, 158, 11, 0.2)', borderRadius: '1rem' }}>
                  <Award color="#fbbf24" size={24} />
               </div>
               <div style={{ flex: 1 }}>
                  <h4 style={{ color: 'white', fontSize: '1.1rem', fontWeight: 700 }}>Current Events</h4>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>Tap here to see all active standalone exams.</p>
               </div>
               <ArrowRight color="white" opacity={0.6} />
            </div>
         </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="container" style={{ marginTop: '2.5rem', paddingBottom: '100px' }}>
         
         {/* Popular Courses Section */}
         <div className="space-between" style={{ marginBottom: '2rem', padding: '0 0.5rem' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b' }}>Famous Courses</h3>
            <button style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', background: 'none', border: 'none', cursor: 'pointer' }}>See all</button>
         </div>

         <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', padding: '0.5rem', marginBottom: '4rem' }} className="no-scrollbar">
            {homeData?.most_popular_courses?.map(course => (
               <div 
                  key={course.id} 
                  className="glass-card" 
                  style={{ minWidth: '220px', maxWidth: '220px', padding: '0', overflow: 'hidden', background: 'white' }}
                  onClick={() => navigate(`/course/${course.id}`)}
               >
                  <img src={course.image_url} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                  <div style={{ padding: '1.25rem' }}>
                     <h4 style={{ fontSize: '1rem', color: '#1e293b', marginBottom: '1rem', minHeight: '3rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxDirection: 'vertical', overflow: 'hidden' }}>{course.title}</h4>
                     <div className="space-between">
                        <div className="flexCenteredV" style={{ gap: '1rem', color: '#64748b', fontSize: '0.75rem' }}>
                           <span className="flex" style={{ gap: '0.25rem' }}><BookOpen size={14} /> {course.lessons_count}</span>
                           <span className="flex" style={{ gap: '0.25rem' }}><PlayCircle size={14} /> {course.videos_count}</span>
                        </div>
                     </div>
                  </div>
               </div>
            ))}
         </div>

         {/* New Courses List */}
         <div style={{ background: 'white', borderRadius: '2rem 2rem 0 0', padding: '2.5rem', boxShadow: '0 -20px 40px rgba(0,0,0,0.03)' }}>
            <div className="space-between" style={{ marginBottom: '2.5rem' }}>
               <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b' }}>New Courses</h3>
               <button style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', background: 'none', border: 'none', cursor: 'pointer' }}>See all</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
               {homeData?.new_courses?.map(course => (
                  <div 
                    key={course.id} 
                    className="flexCenteredV" 
                    style={{ padding: '0.75rem', gap: '1.5rem', cursor: 'pointer', borderRadius: '1.5rem', transition: 'all 0.2s' }}
                    onClick={() => navigate(`/course/${course.id}`)}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                     <img src={course.image_url} style={{ width: '80px', height: '80px', borderRadius: '1.25rem', objectFit: 'cover' }} />
                     <div style={{ flex: 1 }}>
                        <h4 style={{ color: '#1e293b', fontSize: '1.1rem', marginBottom: '0.4rem' }}>{course.title}</h4>
                        <div className="flex" style={{ gap: '1.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                           <span>{course.lessons_count} Lessons</span>
                           <span>{course.videos_count} Videos</span>
                        </div>
                     </div>
                     <ArrowRight size={20} color="#94a3b8" />
                  </div>
               ))}
            </div>

            {/* Famous Teachers */}
            <div className="space-between" style={{ marginTop: '5rem', marginBottom: '2.5rem' }}>
               <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b' }}>Famous Teachers</h3>
               <button style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', background: 'none', border: 'none', cursor: 'pointer' }}>See all</button>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', padding: '0.5rem' }} className="no-scrollbar">
               {homeData?.most_popular_teachers?.map(teacher => (
                  <div key={teacher.id} className="glass-card centered" style={{ minWidth: '160px', padding: '2rem 1rem', background: 'white', flexDirection: 'column', gap: '1rem' }}>
                     <img src={teacher.profile_image_url} style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #f1f5f9' }} />
                     <div style={{ textAlign: 'center' }}>
                        <h5 style={{ fontSize: '0.95rem', color: '#1e293b' }}>{teacher.name}</h5>
                        <p style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 600 }}>{teacher.main_subject}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        body { background: #f8faff !important; color: #0f172a !important; }
        .glass-card { box-shadow: 0 10px 25px rgba(0,0,0,0.05) !important; border: 1px solid rgba(0,0,0,0.03) !important; border-radius: 1.5rem !important; }
      `}</style>
    </div>
  );
};

export default Dashboard;
