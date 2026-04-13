import React, { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  User, 
  PlayCircle, 
  Clock, 
  GraduationCap,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { studentApi } from '../api';

const Sidebar = ({ active }) => {
  const navigate = useNavigate();
  const items = [
    { icon: <LayoutDashboard size={20} />, label: 'Home', path: '/' },
    { icon: <BookOpen size={20} />, label: 'My Learning', path: '/my-learning' },
    { icon: <FileText size={20} />, label: 'Exams & Quizzes', path: '/' },
    { icon: <User size={20} />, label: 'My Profile', path: '/profile' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="glass" style={{ width: '280px', height: 'calc(100vh - 2rem)', position: 'fixed', top: '1rem', left: '1rem', display: 'flex', flexDirection: 'column', padding: '2rem 1rem' }}>
      <div className="flex" style={{ gap: '0.75rem', padding: '0 1rem', marginBottom: '3rem' }}>
        <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '0.5rem' }}>
          <GraduationCap color="white" />
        </div>
        <h2 style={{ fontSize: '1.25rem' }}>MPS Student</h2>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {items.map(item => (
          <button 
            key={item.label} 
            onClick={() => navigate(item.path)}
            className={`btn ${active === item.path ? 'btn-primary' : 'btn-outline'}`} 
            style={{ width: '100%', justifyContent: 'start', padding: '0.75rem 1rem', borderColor: 'transparent', background: active === item.path ? undefined : 'transparent' }}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      <button onClick={handleLogout} className="btn btn-outline" style={{ marginTop: 'auto', width: '100%', color: '#f87171', borderColor: 'rgba(248, 113, 113, 0.2)' }}>
        Logout
      </button>
    </div>
  );
};

const CourseCard = ({ course, onClick }) => (
  <div onClick={() => onClick(course.id)} className="glass-card fade-in" style={{ padding: '1rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <div style={{ position: 'relative', height: '180px', borderRadius: '1rem', overflow: 'hidden' }}>
      <img src={course.image_url || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', top: '1rem', left: '1rem', padding: '0.4rem 1rem', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(4px)', borderRadius: '0.75rem', fontSize: '0.75rem', fontWeight: 700 }}>
        Expires: {new Date(course.expiry_date).toLocaleDateString()}
      </div>
    </div>
    
    <div>
       <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{course.title}</h3>
       <p style={{ color: 'var(--text-sub)', fontSize: '0.9rem' }}>Progress: {course.progress}%</p>
       <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginTop: '0.75rem', overflow: 'hidden' }}>
          <div style={{ width: `${course.progress}%`, height: '100%', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary)' }} />
       </div>
    </div>

    <div className="space-between" style={{ marginTop: '0.5rem' }}>
       <div className="flex" style={{ gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          <Calendar size={16} /> Enrolled: {new Date(course.enrolled_at).toLocaleDateString()}
       </div>
       <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Continue <ChevronRight size={16} /></button>
    </div>
  </div>
);

const EnrolledCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await studentApi.getMyCourses();
        setCourses(response.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div style={{ display: 'flex', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', minHeight: '100vh' }}>
      <Sidebar active={location.pathname} />
      
      <main style={{ marginLeft: '310px', flex: 1, padding: '2rem 3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>My <span className="text-gradient">Learning</span></h1>
        <p style={{ color: 'var(--text-sub)', marginBottom: '3rem' }}>You are currently enrolled in {courses.length} educational tracks.</p>

        {loading ? (
          <div className="centered" style={{ height: '300px' }}>Loading your curriculum...</div>
        ) : courses.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
            {courses.map(course => (
              <CourseCard key={course.id} course={course} onClick={(id) => navigate(`/course/${id}`)} />
            ))}
          </div>
        ) : (
          <div className="glass-card centered" style={{ height: '300px', flexDirection: 'column', gap: '1.5rem' }}>
             <BookOpen size={64} color="var(--text-muted)" />
             <h2 style={{ fontSize: '1.5rem' }}>No active enrollments found</h2>
             <button className="btn btn-primary" onClick={() => navigate('/')}>Browse Courses</button>
          </div>
        )}
      </main>
    </div>
  );
};

export default EnrolledCourses;
