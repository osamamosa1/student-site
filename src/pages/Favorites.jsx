import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  PlayCircle, 
  FileText, 
  Award, 
  ArrowLeft, 
  Trash2,
  BookOpen,
  ChevronRight
} from 'lucide-react';
import { studentApi } from '../api';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchFavorites = async () => {
    try {
      const response = await studentApi.getFavorites();
      setFavorites(response.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (e, lessonId) => {
    e.stopPropagation(); // Avoid triggering navigation to lesson player
    try {
      await studentApi.toggleFavorite(lessonId);
      // Fast local update
      setFavorites(prev => prev.filter(item => item.id !== lessonId));
    } catch (err) {
      console.error(err);
    }
  };

  const getLessonIcon = (type) => {
    switch (type) {
      case 'video':
        return <PlayCircle className="text-rose-500" size={24} color="#f43f5e" />;
      case 'exam':
        return <Award className="text-amber-500" size={24} color="#f59e0b" />;
      default:
        return <FileText className="text-blue-500" size={24} color="#3b82f6" />;
    }
  };

  const getLessonLabel = (type) => {
    switch (type) {
      case 'video': return 'فيديو';
      case 'exam': return 'اختبار';
      case 'assignment': return 'واجب';
      default: return 'درس';
    }
  };

  return (
    <div style={{ background: '#f8faff', minHeight: '100vh', color: '#0f172a', paddingBottom: '3rem' }}>
      
      {/* Header Banner */}
      <div 
        style={{ 
          background: 'linear-gradient(135deg, #f43f5e, #be123c)', 
          padding: '4rem 2rem 5rem 2rem', 
          borderRadius: '0 0 3rem 3rem',
          boxShadow: '0 10px 30px rgba(244, 63, 94, 0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: '-20px', left: '10%', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <button 
            onClick={() => navigate(-1)} 
            className="flexCenteredV"
            style={{ 
              background: 'rgba(255, 255, 255, 0.2)', 
              border: 'none', 
              color: 'white', 
              padding: '0.6rem 1.2rem', 
              borderRadius: '1rem', 
              cursor: 'pointer',
              fontWeight: '600',
              gap: '0.5rem',
              backdropFilter: 'blur(8px)',
              transition: 'background 0.2s',
              marginBottom: '2rem'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          >
            <ArrowLeft size={16} /> العودة
          </button>
          
          <h1 style={{ color: 'white', fontSize: '2.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Heart size={36} fill="white" /> المفضلة
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginTop: '0.5rem', fontSize: '1.1rem' }}>
            الدروس والاختبارات التي قمت بحفظها للرجوع إليها لاحقاً.
          </p>
        </div>
      </div>

      {/* Favorites List Container */}
      <div className="container" style={{ marginTop: '-2.5rem', position: 'relative', zIndex: 20 }}>
        {loading ? (
          <div className="glass-card centered" style={{ padding: '5rem', background: 'white' }}>
            <div className="animate-spin" style={{ width: '40px', height: '40px', border: '3px solid #f43f5e', borderTopColor: 'transparent', borderRadius: '50%' }} />
          </div>
        ) : favorites.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {favorites.map(lesson => (
              <div 
                key={lesson.id} 
                onClick={() => navigate(`/lesson/${lesson.id}`)}
                className="glass-card fav-card fade-in" 
                style={{ 
                  padding: '1.5rem', 
                  background: 'white', 
                  borderRadius: '1.5rem', 
                  cursor: 'pointer',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1.5rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ padding: '0.75rem', background: '#fff5f5', borderRadius: '1rem' }}>
                      {getLessonIcon(lesson.type)}
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f43f5e', textTransform: 'uppercase', background: '#ffe4e6', padding: '0.2rem 0.6rem', borderRadius: '0.5rem' }}>
                        {getLessonLabel(lesson.type)}
                      </span>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '0.5rem', color: '#1e293b' }}>
                        {lesson.title}
                      </h3>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => handleRemoveFavorite(e, lesson.id)}
                    style={{ 
                      background: '#fff5f5', 
                      border: 'none', 
                      padding: '0.5rem', 
                      borderRadius: '50%', 
                      color: '#f43f5e',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#ffe4e6'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#fff5f5'}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    أضيف في: {lesson.created_at || 'مؤخراً'}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', color: '#3b82f6', fontWeight: '700', fontSize: '0.85rem', gap: '0.25rem' }}>
                    بدء الدرس <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card centered" style={{ padding: '5rem', background: 'white', flexDirection: 'column', gap: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', textAlign: 'center' }}>
            <div style={{ padding: '1.5rem', background: '#fff5f5', borderRadius: '50%', color: '#f43f5e' }}>
              <Heart size={48} fill="none" />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b' }}>لا يوجد دروس في المفضلة</h2>
            <p style={{ color: '#64748b', maxWidth: '400px', lineHeight: '1.6' }}>
              تصفح المواد الدراسية وقم بالضغط على علامة القلب لحفظ الدروس الهامة هنا لسهولة الوصول إليها.
            </p>
            <button className="btn btn-primary" style={{ padding: '0.75rem 2rem', borderRadius: '2rem' }} onClick={() => navigate('/')}>تصفح المقررات</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
