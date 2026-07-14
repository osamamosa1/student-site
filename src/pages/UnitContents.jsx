import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  FileText, 
  Award,
  Video,
  Clock,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import { studentApi } from '../api';

const UnitContents = () => {
  const { unitId } = useParams();
  const navigate = useNavigate();
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUnit = async () => {
      try {
        const response = await studentApi.getUnitDetails(unitId);
        setUnit(response.data);
        if (unitId) sessionStorage.setItem('last_unit_id', String(unitId));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUnit();

    const onFocus = () => fetchUnit();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [unitId]);

  if (loading) return <div className="centered" style={{ height: '100vh' }}>Syncing lessons...</div>;
  if (!unit) return <div className="centered white">Unit not found</div>;

  const filteredContents = unit.contents?.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const isCompleted = (content) =>
    content.is_completed === true || content.progress?.status === 'completed';

  const getIcon = (type) => {
    switch (type) {
      case 'video': return <Video size={22} color="white" />;
      case 'exam': return <Award size={22} color="white" />;
      case 'assignment': return <FileText size={22} color="white" />;
      default: return <BookOpen size={22} color="white" />;
    }
  };

  const getTypeMeta = (type) => {
    switch (type) {
      case 'video': return { label: 'فيديو', color: 'var(--primary)' };
      case 'exam': return { label: 'امتحان', color: '#f59e0b' };
      case 'assignment': return { label: 'مهمة', color: '#0ea5e9' };
      default: return { label: 'درس', color: '#64748b' };
    }
  };

  return (
    <div style={{ background: 'linear-gradient(180deg, #f0fdf4 0%, #f8faff 28%, #f8faff 100%)', minHeight: '100vh', padding: '2rem' }}>
       <header className="container" style={{ marginBottom: '2.5rem' }}>
          <div className="space-between" style={{ marginBottom: '2rem' }}>
             <button onClick={() => navigate(-1)} className="btn btn-outline centered" style={{ width: '48px', height: '48px', borderRadius: '50%' }}>
                <ArrowLeft size={20} />
             </button>
             <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>{unit.title}</h1>
             <div style={{ width: '48px' }} />
          </div>

          <div className="glass flex centered-v" style={{ padding: '1rem 1.5rem', gap: '1rem', background: 'white', borderRadius: '1.25rem', border: '1px solid #e2e8f0', maxWidth: '600px', margin: '0 auto', boxShadow: '0 10px 30px -18px rgba(15,23,42,0.25)' }}>
             <Search size={20} color="#94a3b8" />
             <input 
               type="text" 
               placeholder="ابحث في دروس الوحدة..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               style={{ background: 'none', border: 'none', color: '#0f172a', flex: 1, outline: 'none', fontSize: '1rem' }}
             />
          </div>
       </header>

       <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {filteredContents.map((content) => {
            const done = isCompleted(content);
            const meta = getTypeMeta(content.type);
            const accent = done ? '#16a34a' : meta.color;

            return (
              <div 
                key={content.id} 
                className="fade-in" 
                style={{
                  padding: '1.35rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  position: 'relative',
                  borderRadius: '1.35rem',
                  border: done ? '1.5px solid #86efac' : '1px solid #e2e8f0',
                  background: done
                    ? 'linear-gradient(160deg, #ecfdf5 0%, #f0fdf4 100%)'
                    : 'linear-gradient(160deg, #ffffff 0%, #f8fafc 100%)',
                  boxShadow: done
                    ? '0 16px 30px -18px rgba(22,163,74,0.45)'
                    : '0 14px 28px -20px rgba(15,23,42,0.35)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onClick={() => navigate(`/lesson/${content.id}`)}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.15rem' }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: accent,
                      background: `${accent}18`,
                      padding: '0.3rem 0.7rem',
                      borderRadius: '999px',
                    }}>
                      {meta.label}
                    </span>
                    {done && <CheckCircle2 size={18} color="#16a34a" />}
                 </div>

                 <div className="centered" style={{
                   width: '64px',
                   height: '64px',
                   borderRadius: '50%',
                   margin: '0 auto 1rem',
                   background: `linear-gradient(145deg, ${accent}, ${accent}cc)`,
                   boxShadow: `0 12px 22px -10px ${accent}88`,
                 }}>
                    {getIcon(content.type)}
                 </div>

                 <h4 style={{
                   fontSize: '1rem',
                   fontWeight: 800,
                   color: done ? '#14532d' : '#0f172a',
                   marginBottom: '0.85rem',
                   display: '-webkit-box',
                   WebkitLineClamp: 2,
                   WebkitBoxOrient: 'vertical',
                   overflow: 'hidden',
                   minHeight: '2.6em',
                 }}>
                   {content.title}
                 </h4>

                 <div className="centered" style={{ gap: '0.4rem', fontSize: '0.78rem', color: done ? '#16a34a' : '#64748b', fontWeight: 700 }}>
                    {done ? (
                      <>مكتمل</>
                    ) : (
                      <><Clock size={14} /> {content.created_at?.split('T')[0] || content.created_at?.split(' ')[0] || '—'}</>
                    )}
                 </div>
              </div>
            );
          })}
          {filteredContents.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#94a3b8', fontWeight: 700 }}>
              لا توجد دروس مطابقة
            </div>
          )}
       </div>
    </div>
  );
};

export default UnitContents;
