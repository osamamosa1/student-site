import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  Calendar, 
  Clock, 
  FileText, 
  Award,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { studentApi } from '../api';

const StandaloneExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await studentApi.getStandaloneExams();
        const now = new Date();
        const filteredExams = (response.data || []).filter(exam => {
          const startDate = new Date(exam.start_date);
          return now >= startDate;
        });
        setExams(filteredExams);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  if (loading) return <div className="centered" style={{ height: '100vh', background: 'var(--bg-main)' }}>Syncing current events...</div>;

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', color: 'white', padding: '2rem' }}>
       <div className="container">
          <header className="space-between" style={{ marginBottom: '3rem' }}>
             <div className="flex" style={{ gap: '1.5rem' }}>
                <button onClick={() => navigate('/')} className="btn btn-outline centered" style={{ width: '48px', height: '48px', borderRadius: '50%' }}>
                   <ArrowLeft size={20} />
                </button>
                <div>
                   <h1 style={{ fontSize: '2rem' }}>Current Events & Exams</h1>
                   <p style={{ color: 'var(--text-sub)' }}>Participate in global assessments and track your competitive standing.</p>
                </div>
             </div>
             <div className="glass flex" style={{ padding: '0.5rem 1.5rem', alignItems: 'center', gap: '1rem' }}>
                <Search size={18} color="var(--text-muted)" />
                <input 
                  type="text" 
                  placeholder="Find an exam..." 
                  style={{ background: 'none', border: 'none', color: 'white', outline: 'none', fontSize: '0.9rem' }}
                />
             </div>
          </header>

          {exams.length === 0 ? (
             <div className="centered" style={{ height: '50vh', flexDirection: 'column', gap: '1.5rem', textAlign: 'center' }}>
                <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '50%' }}><Calendar size={64} opacity={0.2} /></div>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--text-sub)' }}>No Active Exams Found</h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: '400px' }}>Global events will appear here when scheduled by your instructors.</p>
             </div>
          ) : (
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1.5rem' }}>
                {exams.map(exam => {
                   const isExpired = exam.is_expired;
                   return (
                      <div key={exam.id} className="glass-card fade-in" style={{ padding: '0', overflow: 'hidden', opacity: isExpired ? 0.7 : 1 }}>
                         <div style={{ padding: '1.75rem' }}>
                            <div className="space-between" style={{ marginBottom: '1.25rem' }}>
                               <div className="flex" style={{ gap: '0.5rem' }}>
                                  <div style={{ padding: '0.5rem', background: 'rgba(79, 70, 229, 0.1)', borderRadius: '0.75rem' }}><Award size={20} color="var(--primary)" /></div>
                                  <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>{exam.teacher_name}</div>
                               </div>
                               <span style={{ 
                                 padding: '0.2rem 0.75rem', 
                                 borderRadius: '2rem', 
                                 fontSize: '0.7rem', 
                                 fontWeight: 700, 
                                 background: isExpired ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                 color: isExpired ? '#f87171' : '#10b981'
                               }}>
                                 {isExpired ? 'EXPIRED' : 'ACTIVE'}
                               </span>
                            </div>
                            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.75rem', lineHeight: '1.3' }}>{exam.title}</h3>
                            <p style={{ color: 'var(--text-sub)', fontSize: '0.9rem', marginBottom: '1.5rem', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxDirection: 'vertical', overflow: 'hidden' }}>
                               {exam.description || 'Global assessment testing your knowledge across multiple domains.'}
                            </p>
                            
                            <div className="flex" style={{ gap: '1.5rem', marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '1rem' }}>
                               <div className="centered" style={{ gap: '0.4rem', fontSize: '0.85rem' }}><Clock size={16} color="var(--text-muted)" /> {exam.duration}m</div>
                               <div className="centered" style={{ gap: '0.4rem', fontSize: '0.85rem' }}><FileText size={16} color="var(--text-muted)" /> {exam.questions_count} Items</div>
                               <div className="centered" style={{ gap: '0.4rem', fontSize: '0.85rem' }}><TrendingUp size={16} color="var(--text-muted)" /> {exam.passing_score}% Passing</div>
                            </div>

                            <button 
                              onClick={() => isExpired ? null : navigate(`/exam/${exam.id}?type=standalone`)}
                              className={`btn ${isExpired ? 'btn-outline' : 'btn-primary'}`} 
                              style={{ width: '100%', justifyContent: 'center', height: '3rem', opacity: isExpired ? 0.5 : 1 }}
                            >
                               {isExpired ? 'Exam Expired' : 'Enter Exam'} <ChevronRight size={18} />
                            </button>
                         </div>
                         <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem 1.75rem', fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)' }}>
                            <Calendar size={12} style={{ marginRight: '0.5rem' }} /> Available until: {new Date(exam.end_date).toLocaleDateString()}
                         </div>
                      </div>
                   );
                })}
             </div>
          )}
       </div>
    </div>
  );
};

export default StandaloneExams;
