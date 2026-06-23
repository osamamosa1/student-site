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
  Settings,
  Heart
} from 'lucide-react';
import logo from '../assets/logo.png';
import { homeApi, studentApi } from '../api';

const isFree = (price) => {
  if (price === null || price === undefined || price === '') return true;
  return parseFloat(price) === 0;
};

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

  // Returns actual courses (no duplication). Pass limit to cap at N items.
  const getCourses = (coursesList, limit = null) => {
    if (!coursesList || coursesList.length === 0) return [];
    return limit ? coursesList.slice(0, limit) : coursesList;
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
            <div className="space-between no-mobile-col" style={{ marginBottom: '3.5rem', flexDirection: 'row', alignItems: 'center' }}>
                <div className="flexCenteredV" style={{ gap: '1.5rem' }}>
                   <div className="centered logo-container" style={{ width: '80px', height: '80px', borderRadius: '1.25rem', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', overflow: 'hidden' }}>
                      <img src={homeData?.platform_settings?.logo_url || logo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Logo" />
                   </div>
                   <div>
                      <h2 style={{ color: 'white', fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.5px' }}>{homeData?.platform_settings?.app_name || "Mr Abdelrahman Shoker"}</h2>
                   </div>
                </div>
               <div className="flex" style={{ gap: '1rem' }}>
                  <button onClick={() => navigate('/favorites')} className="centered" style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }} title="المفضلة">
                     <Heart size={22} fill="white" />
                  </button>
                  <button onClick={() => navigate('/settings')} className="centered" style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }} title="الإعدادات">
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
                  gap: '1.5rem',
                  flexWrap: 'wrap'
               }}
               onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
               onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
            >
               <div style={{ padding: '0.75rem', background: 'rgba(245, 158, 11, 0.2)', borderRadius: '1rem' }}>
                  <Award color="#fbbf24" size={24} />
               </div>
               <div style={{ flex: 1, minWidth: '200px' }}>
                  <h4 style={{ color: 'white', fontSize: '1.1rem', fontWeight: 700 }}>Current Events</h4>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>Tap here to see all active standalone exams.</p>
               </div>
               <ArrowRight color="white" opacity={0.6} className="hide-mobile" />
            </div>
            {/* --- ANNOUNCEMENT BANNER --- */}
            {homeData?.platform_settings?.global_announcement && (
               <div style={{ marginTop: '2.5rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '1rem 2rem', borderRadius: '1rem', color: '#b45309', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Bell size={20} />
                  <marquee scrollamount="5">{homeData.platform_settings.global_announcement}</marquee>
               </div>
            )}
         </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="container" style={{ marginTop: '2.5rem', paddingBottom: '100px' }}>
         
         {/* Famous Courses Section */}
         <div className="space-between no-mobile-col" style={{ marginBottom: '2rem', padding: '0 0.5rem', flexDirection: 'row', alignItems: 'flex-end' }}>
            <div>
               <p style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.5rem' }}>Top Curated</p>
               <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>Famous Courses</h3>
            </div>
            <button onClick={() => navigate('/courses?type=popular')} style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', background: 'rgba(79, 70, 229, 0.05)', padding: '0.6rem 1.25rem', borderRadius: '1rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(79, 70, 229, 0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(79, 70, 229, 0.05)'}>See all collection <ArrowRight size={16} /></button>
         </div>

         <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', padding: '0.5rem 0.25rem 2rem', marginBottom: '2.5rem' }} className="no-scrollbar">
            {getCourses(homeData?.most_popular_courses, 6)
               .map((course, index) => (
               <div
                  key={`${course.id}-${index}`}
                  onClick={() => navigate(`/course/${course.id}`)}
                  style={{ 
                    minWidth: '260px', 
                    background: 'white', 
                    borderRadius: '2rem', 
                    overflow: 'hidden', 
                    cursor: 'pointer', 
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)', 
                    border: '1px solid #f1f5f9', 
                    flexShrink: 0, 
                    transition: 'all 0.3s ease' 
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.04)'; }}
               >
                  <div style={{ position: 'relative', height: '150px', overflow: 'hidden', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     {course.image_url && course.image_url !== '/images/placeholder.png' ? (
                       <img src={course.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                     ) : (
                       <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: '#94a3b8' }}>
                         <GraduationCap size={40} />
                         <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Mr Abdelrahman</span>
                       </div>
                     )}
                     <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', color: 'white', padding: '0.3rem 0.7rem', borderRadius: '0.75rem', fontSize: '0.75rem', fontWeight: 700 }}>
                        {isFree(course.price) ? 'FREE' : `${course.price} EGP`}
                     </div>
                  </div>
                  <div style={{ padding: '1.25rem' }}>
                     <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{course.title}</h4>
                     <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>By {course.teacher?.name}</p>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '0.75rem', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 700 }}>
                           <span className="flexCenteredV" style={{ gap: '0.3rem' }}><BookOpen size={14} /> {course.lessons_count}</span>
                           <span className="flexCenteredV" style={{ gap: '0.3rem' }}><PlayCircle size={14} /> {course.videos_count}</span>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '0.4rem', borderRadius: '0.5rem' }}>
                           <TrendingUp size={14} color="#94a3b8" />
                        </div>
                     </div>
                  </div>
               </div>
            ))}
         </div>

         {/* New Courses Grid */}
         <div style={{ background: 'white', borderRadius: '2rem 2rem 0 0', padding: '2.5rem', boxShadow: '0 -20px 40px rgba(0,0,0,0.03)' }}>
            <div className="space-between" style={{ marginBottom: '2rem' }}>
               <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b' }}>New Courses</h3>
               <button onClick={() => navigate('/courses?type=new')} style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>See all <ArrowRight size={16} /></button>
            </div>

            {/* Premium New Courses Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
               {getCourses(homeData?.new_courses, 6).map((course, index) => (
                  <div
                    key={`${course.id}-${index}`}
                    onClick={() => navigate(`/course/${course.id}`)}
                    style={{ 
                      background: 'white', 
                      borderRadius: '2rem', 
                      overflow: 'hidden', 
                      cursor: 'pointer', 
                      border: '1px solid #f1f5f9', 
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
                    }}
                    onMouseEnter={e => { 
                      e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)'; 
                      e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(79, 70, 229, 0.1), 0 10px 10px -5px rgba(79, 70, 229, 0.04)';
                      e.currentTarget.querySelector('.course-image').style.transform = 'scale(1.1)';
                      e.currentTarget.querySelector('.action-btn').style.opacity = '1';
                      e.currentTarget.querySelector('.action-btn').style.transform = 'translateY(0)';
                    }}
                    onMouseLeave={e => { 
                      e.currentTarget.style.transform = 'translateY(0) scale(1)'; 
                      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)';
                      e.currentTarget.querySelector('.course-image').style.transform = 'scale(1)';
                      e.currentTarget.querySelector('.action-btn').style.opacity = '0';
                      e.currentTarget.querySelector('.action-btn').style.transform = 'translateY(10px)';
                    }}
                  >
                     <div style={{ position: 'relative', height: '220px', overflow: 'hidden', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {course.image_url && course.image_url !== '/images/placeholder.png' ? (
                           <img 
                             src={course.image_url} 
                             className="course-image"
                             style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }} 
                           />
                        ) : (
                           <div className="course-image" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', transition: 'transform 0.6s ease' }}>
                             <GraduationCap size={48} />
                             <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Mr Abdelrahman</span>
                           </div>
                        )}
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15, 23, 42, 0.6) 0%, transparent 60%)' }} />
                        
                        {/* Price Tag - Glassmorphism */}
                        <div style={{ 
                           position: 'absolute', 
                           top: '1.25rem', 
                           right: '1.25rem', 
                           background: isFree(course.price) ? 'rgba(16, 185, 129, 0.9)' : 'rgba(79, 70, 229, 0.9)', 
                           backdropFilter: 'blur(8px)',
                           color: 'white', 
                           padding: '0.5rem 1rem', 
                           borderRadius: '1rem', 
                           fontSize: '0.8rem', 
                           fontWeight: 800,
                           border: '1px solid rgba(255,255,255,0.2)',
                           boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}>
                           {isFree(course.price) ? 'FREE' : `${course.price} EGP`}
                        </div>

                        {/* Hover Action Button */}
                        <div className="action-btn" style={{ position: 'absolute', bottom: '1.25rem', right: '1.25rem', opacity: 0, transform: 'translateY(10px)', transition: 'all 0.3s ease' }}>
                           <div className="centered" style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'white', color: 'var(--primary)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                              <ArrowRight size={20} />
                           </div>
                        </div>
                     </div>

                     <div style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                           <span style={{ padding: '0.3rem 0.75rem', background: 'rgba(79, 70, 229, 0.05)', color: 'var(--primary)', borderRadius: '0.6rem', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>
                              Newest Release
                           </span>
                        </div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', lineHeight: '1.4', marginBottom: '0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{course.title}</h4>
                        
                        <div className="flexCenteredV" style={{ gap: '0.75rem', marginBottom: '1.25rem' }}>
                           <img src={course.teacher?.profile_image_url || `https://ui-avatars.com/api/?name=${course.teacher?.name}&background=eff6ff&color=3b82f6`} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                           <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>{course.teacher?.name}</p>
                        </div>

                        <div style={{ display: 'flex', gap: '1.5rem', color: '#94a3b8', fontSize: '0.8rem', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9' }}>
                           <span className="flexCenteredV" style={{ gap: '0.4rem' }}><BookOpen size={14} color="var(--primary)" /> <strong>{course.lessons_count}</strong> Units</span>
                           <span className="flexCenteredV" style={{ gap: '0.4rem' }}><PlayCircle size={14} color="var(--primary)" /> <strong>{course.videos_count}</strong> Videos</span>
                        </div>
                     </div>
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
        
        @media (max-width: 768px) {
          .logo-container {
             width: 60px !important;
             height: 60px !important;
             border-radius: 1rem !important;
          }
          h2 {
             font-size: 1.25rem !important;
          }
          .space-between.no-mobile-col {
             margin-bottom: 2rem !important;
          }
          .container {
             padding: 0 1rem !important;
          }
          /* New courses grid card layout spacing */
          div[style*="gridTemplateColumns"] {
             grid-template-columns: 1fr !important;
             gap: 1.25rem !important;
          }
          /* Card image height reduction on mobile */
          div[style*="height: 220px"] {
             height: 160px !important;
          }
          div[style*="height: 150px"] {
             height: 140px !important;
          }
          /* Grid padding and outer wrapping card adjustments */
          div[style*="borderRadius: 2rem 2rem 0 0"] {
             padding: 1.5rem 1rem !important;
             border-radius: 1.5rem 1.5rem 0 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
