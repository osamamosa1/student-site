import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Award, 
  Calendar, 
  Clock, 
  ChevronRight, 
  ArrowLeft,
  Search,
  SearchX,
  TrendingUp,
  Award as AwardIcon,
  Book,
  FileText
} from 'lucide-react';
import { studentApi } from '../api';

const ExamResultsList = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await studentApi.getStandaloneResults();
        setResults(response.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  const filteredResults = results.filter(r => 
    r.exam_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="centered" style={{ height: '100vh', background: '#f8faff' }}>Analyzing Academic Performance...</div>;

  return (
    <div style={{ background: '#f8faff', minHeight: '100vh', color: '#0f172a' }}>
      
      {/* Header */}
      <header className="container" style={{ padding: '3rem 2rem 5rem 2rem', background: 'white', borderRadius: '0 0 3rem 3rem', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', marginBottom: '3rem' }}>
         <div className="space-between" style={{ marginBottom: '2rem' }}>
            <button onClick={() => navigate(-1)} className="btn btn-outline centered" style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid #e2e8f0' }}>
               <ArrowLeft size={20} />
            </button>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Academic <span style={{ color: 'var(--primary)' }}>Results</span></h1>
            <div style={{ width: '48px' }} />
         </div>

         {/* Search Bar */}
         <div className="glass flexCenteredV" style={{ padding: '1rem 1.5rem', gap: '1rem', background: '#f8fafc', borderRadius: '1.25rem', border: '1px solid #e2e8f0', maxWidth: '600px', margin: '0 auto' }}>
            <Search size={20} color="#94a3b8" />
            <input 
              type="text" 
              placeholder="Search by exam title..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ background: 'none', border: 'none', color: '#0f172a', flex: 1, outline: 'none', fontSize: '1rem' }}
            />
         </div>
      </header>

      <div className="container" style={{ paddingBottom: '5rem' }}>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {filteredResults.map(result => {
               const percentage = Math.round((result.score / result.total_mark) * 100);
               const isPassed = result.passed;

               return (
                  <div 
                     key={result.id} 
                     className="glass-card fade-in" 
                     onClick={() => navigate(`/exam-result/${result.exam_id}`)}
                     style={{ 
                        padding: '1.5rem 2rem', 
                        background: 'white', 
                        cursor: 'pointer',
                        borderLeft: `6px solid ${isPassed ? '#10b981' : '#ef4444'}`,
                        transition: 'var(--transition)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2rem'
                     }}
                     onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                     onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
                  >
                     {/* Circular Score (Simplified for List) */}
                     <div className="centered" style={{ width: '64px', height: '64px', borderRadius: '50%', background: isPassed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: isPassed ? '#10b981' : '#ef4444', fontWeight: 800, fontSize: '1.2rem', shrink: 0 }}>
                        {percentage}%
                     </div>

                     <div style={{ flex: 1 }}>
                        <div className="flex" style={{ gap: '0.5rem', marginBottom: '0.6rem' }}>
                           <span style={{ fontSize: '0.7rem', background: 'rgba(79, 70, 229, 0.05)', color: 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: '0.4rem', fontWeight: 700 }}>
                              {result.course_title || result.CourseTitle || 'General Course'}
                           </span>
                           <span style={{ fontSize: '0.7rem', background: 'rgba(0,0,0,0.03)', color: '#64748b', padding: '0.2rem 0.6rem', borderRadius: '0.4rem', fontWeight: 600 }}>
                              {result.lesson_title || result.LessonTitle || 'Quiz'}
                           </span>
                        </div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.6rem', color: '#1e293b' }}>
                           {result.exam_title || result.ExamTitle || 'Academic Exam'}
                        </h3>
                        <div className="flex" style={{ gap: '1.5rem', color: '#64748b', fontSize: '0.85rem' }}>
                           <span className="flex" style={{ gap: '0.4rem' }}><Calendar size={14} /> {result.submitted_at?.split(' ')[0]}</span>
                           <span className="flex" style={{ gap: '0.4rem' }}><TrendingUp size={14} /> Score: {result.score}/{result.total_mark}</span>
                        </div>
                     </div>

                     <div className="glass centered" style={{ padding: '0.5rem 1.25rem', background: isPassed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: isPassed ? '#10b981' : '#f87171', fontSize: '0.75rem', fontWeight: 800, borderRadius: '2rem' }}>
                        {isPassed ? 'PASSED' : 'NOT PASSED'}
                     </div>

                     <ChevronRight size={20} color="#cbd5e1" />
                  </div>
               );
            })}

            {filteredResults.length === 0 && (
               <div className="centered" style={{ height: '40vh', flexDirection: 'column', color: '#94a3b8', textAlign: 'center' }}>
                  <SearchX size={64} opacity={0.2} style={{ marginBottom: '1.5rem' }} />
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Results Yet</h3>
                  <p style={{ maxWidth: '300px' }}>Complete your course exams or standalone events to see your performance here.</p>
               </div>
            )}
         </div>
      </div>

      <style>{`
        .flexCenteredV { display: flex; align-items: center; }
        .centered { display: flex; align-items: center; justify-content: center; }
        .glass-card { box-shadow: 0 10px 30px rgba(0,0,0,0.03); border: 1px solid #f1f5f9; border-radius: 1.5rem; }
      `}</style>
    </div>
  );
};

export default ExamResultsList;
