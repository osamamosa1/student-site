import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { studentApi } from '../api';

const CompetitionMatch = () => {
  const { id: courseId, matchId } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await studentApi.getCompetitionMatch(courseId, matchId);
        setMatch(res.data);
      } catch (e) {
        console.error(e);
        alert('تعذر تحميل المباراة');
        navigate(`/course/${courseId}/competitions`);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [courseId, matchId, navigate]);

  const handleSelect = (qId, oId) => {
    setAnswers((prev) => ({ ...prev, [qId]: oId }));
  };

  const handleSubmit = async () => {
    const questions = match?.questions || [];
    if (Object.keys(answers).length < questions.length) {
      alert('أجب على كل الأسئلة');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        time_taken: 0,
        answers: Object.entries(answers).reduce((acc, [qId, oId]) => {
          acc[`question_${qId}`] = oId;
          return acc;
        }, {}),
      };
      const res = await studentApi.submitCompetitionMatch(courseId, matchId, payload);
      const score = res.data?.score ?? res.score ?? 0;
      const waiting = res.data?.waiting_for_opponent ?? res.waiting_for_opponent;
      alert(waiting ? `تم الإرسال! درجتك: ${score}\nفي انتظار الخصم` : `تم الإرسال! درجتك: ${score}`);
      navigate(`/course/${courseId}/competitions`);
    } catch (e) {
      alert(e?.message || 'فشل الإرسال');
      setSubmitting(false);
    }
  };

  if (loading) return <div className="centered" style={{ height: '100vh' }}>جاري التحميل...</div>;
  if (!match) return null;

  const questions = match.questions || [];

  return (
    <div style={{ minHeight: '100vh', background: '#020617', color: 'white', paddingBottom: '2rem' }}>
      <header style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={() => navigate(`/course/${courseId}/competitions`)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
          <ArrowLeft size={22} />
        </button>
        <div>
          <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.6 }}>مباراة</p>
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>vs {match.opponent_name}</h2>
        </div>
      </header>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '1.5rem' }}>
        {questions.map((q, idx) => (
          <div key={q.id} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', padding: '1.25rem', marginBottom: '1rem', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p style={{ fontWeight: 700, marginBottom: '1rem', lineHeight: 1.5 }}>{idx + 1}. {q.text}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {(q.options || []).map((o) => {
                const selected = answers[q.id] === o.id;
                return (
                  <button
                    key={o.id}
                    onClick={() => handleSelect(q.id, o.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.85rem 1rem',
                      borderRadius: '0.75rem',
                      border: selected ? '2px solid #6366f1' : '1px solid rgba(255,255,255,0.15)',
                      background: selected ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                      color: 'white',
                      cursor: 'pointer',
                      textAlign: 'right',
                      width: '100%',
                    }}
                  >
                    {selected ? <CheckCircle2 size={18} color="#818cf8" /> : <span style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)' }} />}
                    {o.text}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            width: '100%',
            padding: '1rem',
            marginTop: '1rem',
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            color: 'white',
            border: 'none',
            borderRadius: '0.875rem',
            fontWeight: 700,
            fontSize: '1.05rem',
            cursor: submitting ? 'wait' : 'pointer',
            opacity: submitting ? 0.7 : 1,
          }}
        >
          {submitting ? 'جاري الإرسال...' : 'إرسال الإجابات'}
        </button>
      </div>
    </div>
  );
};

export default CompetitionMatch;
