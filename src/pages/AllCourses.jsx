import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, BookOpen, PlayCircle, Users, Search, Star, TrendingUp } from 'lucide-react';
import { homeApi } from '../api';

const isFree = (price) => !price || parseFloat(price) === 0;

const AllCourses = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const type = new URLSearchParams(location.search).get('type') || 'new'; // 'new' | 'popular'

  const [allCourses, setAllCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (type === 'popular') {
          // For popular: get home data and show ALL most_popular_courses
          const res = await homeApi.getStudentHome();
          const popular = res.data?.most_popular_courses || [];
          setAllCourses(popular);
          setFiltered(popular);
        } else {
          // For new/all: use home API new_courses which returns ALL courses ordered by newest
          const res = await homeApi.getStudentHome();
          const courses = res.data?.new_courses || [];
          setAllCourses(courses);
          setFiltered(courses);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [type]);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(allCourses);
    } else {
      setFiltered(
        allCourses.filter(c =>
          c.title?.toLowerCase().includes(search.toLowerCase()) ||
          c.teacher?.name?.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, allCourses]);

  const title = type === 'popular' ? 'Famous Courses' : 'New Courses';
  const Icon = type === 'popular' ? TrendingUp : Star;

  return (
    <div style={{ background: '#f8faff', minHeight: '100vh', color: '#0f172a' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary), #4338ca)',
        padding: '2rem 2rem 4rem',
        borderRadius: '0 0 2.5rem 2.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: '-20px', left: '5%', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <button
            onClick={() => navigate('/')}
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: '44px', height: '44px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginBottom: '1.5rem' }}
          >
            <ArrowLeft size={20} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '0.875rem', padding: '0.625rem', display: 'flex' }}>
              <Icon size={22} color="white" />
            </div>
            <h1 style={{ color: 'white', fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.5px' }}>{title}</h1>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', marginLeft: '4rem' }}>
            {loading ? '...' : `${filtered.length} course${filtered.length !== 1 ? 's' : ''} available`}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="container" style={{ marginTop: '-1.5rem', position: 'relative', zIndex: 20, paddingBottom: '1.5rem' }}>
        <div style={{
          background: 'white',
          borderRadius: '1.25rem',
          padding: '0.875rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.875rem',
          boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
          border: '1px solid #f1f5f9'
        }}>
          <Search size={18} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search courses or teachers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              flex: 1,
              fontSize: '0.95rem',
              color: '#1e293b',
              background: 'transparent'
            }}
          />
        </div>
      </div>

      {/* Course Grid */}
      <div className="container" style={{ paddingBottom: '6rem' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{ background: 'white', borderRadius: '1.5rem', height: '280px', animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', color: '#94a3b8' }}>
            <BookOpen size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
            <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>No courses found</p>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Try adjusting your search</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.5rem' }}>
            {filtered.map(course => (
              <div
                key={course.id}
                onClick={() => navigate(`/course/${course.id}`)}
                style={{
                  background: 'white',
                  borderRadius: '1.5rem',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                  border: '1px solid #f1f5f9',
                  transition: 'all 0.25s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 35px rgba(79,70,229,0.15)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
                }}
              >
                {/* Course Image */}
                <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                  <img
                    src={course.image_url}
                    alt={course.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 60%)'
                  }} />
                  {/* Price Badge */}
                  <div style={{
                    position: 'absolute', top: '0.75rem', right: '0.75rem',
                    background: isFree(course.price) ? '#10b981' : '#4f46e5',
                    color: 'white', padding: '0.3rem 0.75rem', borderRadius: '2rem',
                    fontSize: '0.75rem', fontWeight: 700
                  }}>
                    {isFree(course.price) ? 'FREE' : `${course.price} EGP`}
                  </div>
                </div>

                {/* Course Info */}
                <div style={{ padding: '1.25rem' }}>
                  <h4 style={{
                    fontSize: '1rem', fontWeight: 700, color: '#1e293b',
                    marginBottom: '0.5rem', lineHeight: '1.4',
                    display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden'
                  }}>
                    {course.title}
                  </h4>

                  {course.teacher?.name && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '1rem' }}>
                      {course.teacher.name}
                    </p>
                  )}

                  <div style={{ display: 'flex', gap: '1.25rem', color: '#64748b', fontSize: '0.8rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <BookOpen size={13} /> {course.lessons_count || 0} Lessons
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <PlayCircle size={13} /> {course.videos_count || 0} Videos
                    </span>
                    {course.enrollments_count > 0 && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Users size={13} /> {course.enrollments_count}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        body { background: #f8faff !important; }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .container { max-width: 1100px; margin: 0 auto; padding: 0 1.25rem; }
        @media (max-width: 480px) {
          div[style*="auto-fill, minmax(290px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AllCourses;
