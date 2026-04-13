import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Clock, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { studentApi } from '../api';

const Exam = () => {
  const { examId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isStandalone = searchParams.get('type') === 'standalone';

  const [exam, setExam] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = isStandalone 
          ? await studentApi.getStandaloneExamDetails(examId)
          : await studentApi.getExamDetails(examId);
        
        const data = response.data;
        setExam(data);
        // Correcting property path from DTO (snake_case)
        setTimeLeft((data.duration || 30) * 60);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [examId, isStandalone]);

  useEffect(() => {
    if (timeLeft === 0) handleSubmit();
    if (timeLeft === null || isSubmitting) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitting]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSelect = (qId, oId) => {
    setAnswers({ ...answers, [qId]: oId });
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const payload = {
        exam_id: parseInt(examId),
        answers: Object.entries(answers).reduce((acc, [qId, oId]) => {
          acc[`question_${qId}`] = oId;
          return acc;
        }, {}),
        time_taken: Math.floor((exam.duration * 60 - timeLeft) / 60),
        is_auto_submitted: timeLeft === 0
      };
      
      if (isStandalone) {
        await studentApi.submitStandaloneExam(examId, payload);
        alert('Exam submitted successfully! Your responses have been recorded.');
        navigate('/');
      } else {
        await studentApi.submitExam(examId, payload);
        navigate(`/exam-result/${examId}`);
      }
    } catch (err) {
      alert('Error submitting exam: ' + (err.message || 'Server error'));
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="centered" style={{ height: '100vh', background: '#020617', color: 'white' }}>Encrypting Exam Paper...</div>;
  if (!exam) return <div className="centered">Exam data not available.</div>;

  const currentQuestion = exam.questions?.[currentIdx];
  const totalQuestions = exam.questions?.length || 0;

  return (
    <div style={{ background: '#020617', minHeight: '100vh', color: 'white', display: 'flex', flexDirection: 'column' }}>
      {/* Immersive Header */}
      <header className="space-between" style={{ padding: '1rem 3rem', borderBottom: '1px solid var(--border)', background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div className="flex" style={{ gap: '1rem' }}>
           <div style={{ padding: '0.5rem', background: 'rgba(79, 70, 229, 0.1)', borderRadius: '0.5rem' }}><HelpCircle color="var(--primary)" /></div>
           <div>
              <p style={{ color: 'var(--text-sub)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Secure Assessment</p>
              <h2 style={{ fontSize: '1.25rem' }}>{exam.title}</h2>
           </div>
        </div>
        
        <div style={{ padding: '0.75rem 2rem', background: timeLeft < 300 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(15, 23, 42, 0.5)', borderRadius: '3rem', border: `1px solid ${timeLeft < 300 ? '#ef4444' : 'var(--border)'}`, color: timeLeft < 300 ? '#f87171' : 'white', fontWeight: 800, fontSize: '1.4rem', display: 'flex', gap: '0.75rem', alignItems: 'center', minWidth: '160px', justifyContent: 'center' }}>
           <Clock size={24} className={timeLeft < 300 ? 'animate-pulse' : ''} /> {formatTime(timeLeft)}
        </div>
      </header>

      <div className="container" style={{ flex: 1, padding: '4rem 0', display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '3rem' }}>
        {/* Question Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
           <div className="glass-card fade-in" style={{ padding: '4rem', background: 'rgba(30, 41, 59, 0.3)' }}>
              <div className="space-between" style={{ marginBottom: '3rem' }}>
                 <div className="centered" style={{ gap: '0.5rem' }}>
                    <span style={{ height: '4px', width: '40px', background: 'var(--primary)', borderRadius: '2px' }} />
                    <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1rem' }}>QUESTION {currentIdx + 1} OF {totalQuestions}</p>
                 </div>
                 <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)', padding: '0.3rem 0.75rem', borderRadius: '0.5rem' }}>Complexity: {currentQuestion?.degree || 1} pts</span>
              </div>
              
              <h3 style={{ fontSize: '1.8rem', marginBottom: '3.5rem', lineHeight: '1.5', fontWeight: 500 }}>{currentQuestion?.text}</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {currentQuestion?.options?.map((option) => {
                  const isSelected = answers[currentQuestion.id] === option.id;
                  return (
                    <button 
                      key={option.id} 
                      onClick={() => handleSelect(currentQuestion.id, option.id)}
                      className="glass"
                      style={{ 
                        textAlign: 'left', 
                        padding: '1.5rem 2rem', 
                        borderRadius: '1.5rem', 
                        border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                        background: isSelected ? 'rgba(79, 70, 229, 0.1)' : 'rgba(255,255,255,0.01)',
                        transition: 'var(--transition)',
                        cursor: 'pointer',
                        color: isSelected ? 'white' : 'var(--text-main)',
                        fontSize: '1.1rem',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <div className="flex" style={{ gap: '1.5rem', alignItems: 'center' }}>
                        <div className="centered" style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid', borderColor: isSelected ? 'var(--primary)' : 'rgba(255,255,255,0.1)', background: isSelected ? 'var(--primary)' : 'transparent' }}>
                          {isSelected && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'white' }} />}
                        </div>
                        {option.text}
                      </div>
                      {isSelected && <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '4px', background: 'var(--primary)' }} />}
                    </button>
                  );
                })}
              </div>
           </div>

           <div className="space-between">
              <button 
                className="btn btn-outline" 
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx(currentIdx - 1)}
                style={{ padding: '1rem 2rem', borderRadius: '1rem' }}
              >
                <ChevronLeft size={20} /> Previous
              </button>
              
              {currentIdx === totalQuestions - 1 ? (
                <button 
                  className="btn btn-primary" 
                  style={{ padding: '1rem 4rem', borderRadius: '1rem', fontSize: '1.1rem' }} 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Finalizing Submission...' : 'Complete & Submit Exam'}
                </button>
              ) : (
                <button 
                  className="btn btn-primary" 
                  onClick={() => setCurrentIdx(currentIdx + 1)}
                  style={{ padding: '1rem 3rem', borderRadius: '1rem' }}
                >
                  Save & Next <ChevronRight size={20} />
                </button>
              )}
           </div>
        </div>

        {/* Status Tracker */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
           <div className="glass-card" style={{ padding: '2.5rem', position: 'sticky', top: '100px' }}>
              <h4 style={{ marginBottom: '2rem', fontSize: '1.1rem', fontWeight: 600 }}>Response Overview</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem', marginBottom: '2.5rem' }}>
                 {exam.questions?.map((q, idx) => {
                    const isAnswered = answers[q.id] !== undefined;
                    const isActive = currentIdx === idx;
                    return (
                        <button 
                          key={idx}
                          onClick={() => setCurrentIdx(idx)}
                          className="centered"
                          style={{ 
                            width: '100%', 
                            aspectRatio: '1', 
                            borderRadius: '0.75rem',
                            background: isActive ? 'var(--primary)' : isAnswered ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.03)',
                            border: isActive ? 'none' : isAnswered ? '1px solid #10b981' : '1px solid var(--border)',
                            color: isActive ? 'white' : isAnswered ? '#10b981' : 'var(--text-muted)',
                            cursor: 'pointer',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            transition: 'var(--transition)'
                          }}
                        >
                           {idx + 1}
                        </button>
                    );
                 })}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '1rem' }}>
                 <div className="space-between">
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Progress</span>
                    <span style={{ fontWeight: 700 }}>{Math.round((Object.keys(answers).length / totalQuestions) * 100)}%</span>
                 </div>
                 <div style={{ height: '6px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(Object.keys(answers).length / totalQuestions) * 100}%`, background: 'var(--primary)', transition: 'width 0.5s ease-out' }} />
                 </div>
              </div>

              <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
                 <div className="flex" style={{ gap: '1rem', color: 'var(--text-sub)', fontSize: '0.85rem' }}>
                    <AlertCircle size={20} color="var(--primary)" />
                    <p>Responses are saved locally and synced upon final submission.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Exam;
