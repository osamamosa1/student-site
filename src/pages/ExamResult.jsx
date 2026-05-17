import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  XCircle, 
  Award, 
  ArrowLeft,
  RefreshCcw,
  LayoutDashboard
} from 'lucide-react';
import { studentApi } from '../api';

const ExamResult = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await studentApi.getExamResult(examId);
        setResult(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [examId]);

  if (loading) return <div className="centered" style={{ height: '100vh', background: 'var(--bg-main)' }}>Generating Report...</div>;
  if (!result) return <div className="centered" style={{ height: '100vh' }}>No result found.</div>;

  const percentage = Math.round((result.total_score / result.total_mark) * 100) || 0;

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', padding: '3rem' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="glass-card centered fade-in" style={{ padding: '4rem 3rem', flexDirection: 'column', gap: '1rem', textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
             <span style={{ fontSize: '0.8rem', background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', padding: '0.3rem 1rem', borderRadius: '2rem', fontWeight: 700 }}>
                {result.course_title || result.CourseTitle || 'General Course'}
             </span>
             <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-sub)', padding: '0.3rem 1rem', borderRadius: '2rem' }}>
                {result.lesson_title || result.LessonTitle || 'Academic Quiz'}
             </span>
          </div>
          <div style={{ width: '120px', height: '120px', position: 'relative' }}>
             <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle cx="50" cy="50" r="45" fill="none" stroke={result.Passed ? '#10b981' : '#f87171'} strokeWidth="8" strokeDasharray={`${percentage * 2.82} 282`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 1s ease-out' }} />
             </svg>
             <div className="centered" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', flexDirection: 'column' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800 }}>{percentage}%</span>
             </div>
          </div>

          <h1 style={{ fontSize: '2.5rem' }}>{result.passed ? "Excellent Work!" : "Keep Practicing!"}</h1>
          <p style={{ color: 'var(--text-sub)', fontSize: '1.25rem' }}>You scored {result.total_score} out of {result.total_mark}</p>
          
          <div className="flex" style={{ gap: '2rem', marginTop: '1rem' }}>
             <div className="glass" style={{ padding: '0.75rem 2rem', borderColor: result.passed ? '#10b981' : '#ef4444', color: result.passed ? '#10b981' : '#f87171', fontWeight: 600 }}>
                {result.passed ? 'PASSED' : 'NOT PASSED'}
             </div>
             <div className="flex" style={{ gap: '0.5rem', alignItems: 'center', color: 'var(--text-sub)' }}>
                <Award size={20} color="var(--accent)" /> Passing Score: {result.passing_score}
             </div>
          </div>

          <div className="flex" style={{ gap: '1rem', marginTop: '2rem' }}>
             <button className="btn btn-outline" onClick={() => navigate(-2)}>
                <ArrowLeft size={18} /> Back to Course
             </button>
             <button className="btn btn-primary" onClick={() => navigate('/')}>
                <LayoutDashboard size={18} /> Dashboard
             </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
           <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Review Answers</h3>
           {result.questions_breakdown?.map((q, idx) => (
             <div key={idx} className="glass-card" style={{ padding: '2rem', borderLeft: `6px solid ${q.correct ? '#10b981' : '#ef4444'}` }}>
                <div className="space-between" style={{ marginBottom: '1.25rem' }}>
                   <p style={{ color: 'var(--text-sub)', fontWeight: 600 }}>Question {idx + 1}</p>
                   {q.correct ? <CheckCircle2 color="#10b981" /> : <XCircle color="#ef4444" />}
                </div>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>{q.question_text}</h4>
                
                 <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '0.75rem', marginBottom: '1rem', border: `1px solid ${q.correct ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}` }}>
                    <p style={{ fontSize: '0.8rem', color: q.correct ? '#10b981' : '#f87171', fontWeight: 600, marginBottom: '0.25rem' }}>Your Answer</p>
                    <p style={{ color: 'var(--text-main)' }}>
                        {q.student_answer_text || (q.student_option_id ? `ID: ${q.student_option_id}` : 'No answer selected')}
                    </p>
                 </div>
                 
                 <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '0.75rem', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                    <p style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600, marginBottom: '0.25rem' }}>Correct Answer</p>
                    <p style={{ color: 'var(--text-main)' }}>
                        {q.correct_option_text || (q.correct_option_id ? `ID: ${q.correct_option_id}` : 'N/A')}
                    </p>
                 </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default ExamResult;
