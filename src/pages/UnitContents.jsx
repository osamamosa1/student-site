import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  PlayCircle, 
  FileText, 
  Award,
  Video,
  Clock,
  ChevronRight,
  BookOpen
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
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUnit();
  }, [unitId]);

  if (loading) return <div className="centered" style={{ height: '100vh' }}>Syncing lessons...</div>;
  if (!unit) return <div className="centered white">Unit not found</div>;

  const filteredContents = unit.contents?.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getIcon = (type) => {
    switch (type) {
      case 'video': return <Video size={24} color="white" />;
      case 'exam': return <Award size={24} color="white" />;
      case 'assignment': return <FileText size={24} color="white" />;
      default: return <BookOpen size={24} color="white" />;
    }
  };

  const getBadgeColor = (type) => {
    switch (type) {
      case 'video': return 'var(--primary)';
      case 'exam': return '#f59e0b';
      case 'assignment': return '#10b981';
      default: return '#64748b';
    }
  };

  return (
    <div style={{ background: '#f8faff', minHeight: '100vh', padding: '2rem' }}>
       <header className="container" style={{ marginBottom: '3rem' }}>
          <div className="space-between" style={{ marginBottom: '2rem' }}>
             <button onClick={() => navigate(-1)} className="btn btn-outline centered" style={{ width: '48px', height: '48px', borderRadius: '50%' }}>
                <ArrowLeft size={20} />
             </button>
             <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>{unit.title}</h1>
             <div style={{ width: '48px' }} />
          </div>

          <div className="glass flex centered-v" style={{ padding: '1rem 1.5rem', gap: '1rem', background: 'white', borderRadius: '1.25rem', border: '1px solid #e2e8f0', maxWidth: '600px', margin: '0 auto' }}>
             <Search size={20} color="#94a3b8" />
             <input 
               type="text" 
               placeholder="Search lessons in this unit..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               style={{ background: 'none', border: 'none', color: '#0f172a', flex: 1, outline: 'none', fontSize: '1rem' }}
             />
          </div>
       </header>

       <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
          {filteredContents.map((content) => (
            <div 
              key={content.id} 
              className="glass-card fade-in" 
              style={{ padding: '1.5rem', background: 'white', cursor: 'pointer', textAlign: 'center', position: 'relative' }}
              onClick={() => navigate(`/lesson/${content.id}`)}
            >
               <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxDirection: 'vertical', overflow: 'hidden' }}>
                    {content.title}
                  </h4>
                  <div className="centered" style={{ height: '120px', background: '#f8fafc', borderRadius: '1rem' }}>
                     <img src="https://img.freepik.com/free-vector/video-lesson-illustration_52683-39879.jpg" style={{ height: '80px', opacity: 0.8 }} />
                  </div>
               </div>

               <div className="space-between" style={{ alignItems: 'center' }}>
                  <div className="centered" style={{ gap: '0.4rem', fontSize: '0.75rem', color: '#64748b' }}>
                     <Clock size={14} /> {content.created_at?.split('T')[0]}
                  </div>
                  <div 
                    className="centered" 
                    style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%', 
                      background: getBadgeColor(content.type),
                      boxShadow: `0 8px 15px -4px ${getBadgeColor(content.type)}44`
                    }}
                  >
                     {getIcon(content.type)}
                  </div>
               </div>
            </div>
          ))}

          {filteredContents.length === 0 && (
             <div className="centered" style={{ gridColumn: '1 / -1', height: '40vh', flexDirection: 'column', color: '#94a3b8' }}>
                <Search size={48} opacity={0.2} />
                <p style={{ marginTop: '1rem' }}>No lessons match your search.</p>
             </div>
          )}
       </div>
    </div>
  );
};

export default UnitContents;
