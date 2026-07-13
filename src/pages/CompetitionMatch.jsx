import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock } from 'lucide-react';
import { studentApi } from '../api';
import {
  AssessmentSessionType,
  buildSessionKey,
  getSession,
  startSession,
  updateAnswer,
} from '../utils/assessmentSessionStorage';
import {
  abandonSession,
  markCompleted,
  prepareForCompetition,
} from '../utils/assessmentSessionSync';

const CompetitionMatch = () => {
  const { id: courseId, matchId } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [result, setResult] = useState(null);
  const startTimeRef = useRef(null);
  const submittedRef = useRef(false);
  const abandonedRef = useRef(false);
  const sessionKeyRef = useRef(null);

  const getTimeTaken = useCallback(() => {
    if (!match?.time_limit_seconds || !startTimeRef.current) return 0;
    const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
    return Math.min(elapsed, match.time_limit_seconds);
  }, [match]);

  const doSubmit = useCallback(async (auto = false) => {
    if (submittedRef.current || submitting || !match) return;
    const questions = match?.questions || [];
    if (!auto && Object.keys(answers).length < questions.length) {
      alert('أجب على كل الأسئلة');
      return;
    }
    submittedRef.current = true;
    setSubmitting(true);
    try {
      const payload = {
        time_taken: getTimeTaken(),
        answers: Object.entries(answers).reduce((acc, [qId, oId]) => {
          acc[`question_${qId}`] = oId;
          return acc;
        }, {}),
      };
      const res = await studentApi.submitCompetitionMatch(courseId, matchId, payload);
      const data = res.data || res;
      if (sessionKeyRef.current) await markCompleted(sessionKeyRef.current);
      setResult(data);
    } catch (e) {
      submittedRef.current = false;
      alert(e?.message || 'فشل الإرسال');
      setSubmitting(false);
    }
  }, [answers, courseId, getTimeTaken, match, matchId, submitting]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await studentApi.getCompetitionMatch(courseId, matchId);
        const data = res.data || res;

        if (data.round_id) {
          const gate = await prepareForCompetition(
            parseInt(courseId, 10),
            parseInt(matchId, 10),
            data.round_id,
          );
          if (!gate.allowed) {
            alert(gate.message);
            navigate(`/course/${courseId}/competitions`);
            return;
          }
          sessionKeyRef.current = buildSessionKey(
            AssessmentSessionType.COMPETITION_MATCH,
            parseInt(matchId, 10),
            parseInt(courseId, 10),
            data.round_id,
          );
        }

        setMatch(data);
        startTimeRef.current = Date.now();
        setTimeLeft(data.time_limit_seconds || 900);

        if (sessionKeyRef.current && !getSession(sessionKeyRef.current)) {
          startSession({
            type: AssessmentSessionType.COMPETITION_MATCH,
            targetId: parseInt(matchId, 10),
            courseId: parseInt(courseId, 10),
            roundId: data.round_id,
            questionIds: (data.questions || []).map((q) => q.id),
            durationSeconds: data.time_limit_seconds || 900,
            title: data.opponent_name,
          });
        }
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

  useEffect(() => {
    if (timeLeft === null || result || submitting) return;
    if (timeLeft <= 0) {
      doSubmit(true);
      return;
    }
    const t = setInterval(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, result, submitting, doSubmit]);

  useEffect(() => {
    const onLeave = () => {
      if (!submittedRef.current && !abandonedRef.current && sessionKeyRef.current) {
        abandonSession(sessionKeyRef.current);
        abandonedRef.current = true;
      }
    };
    const handleBeforeUnload = () => onLeave();
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      onLeave();
    };
  }, []);

  const handleBack = async () => {
    if (!submittedRef.current && !abandonedRef.current && sessionKeyRef.current) {
      abandonedRef.current = true;
      await abandonSession(sessionKeyRef.current);
    }
    navigate(`/course/${courseId}/competitions`);
  };

  const handleSelect = (qId, oId) => {
    setAnswers((prev) => ({ ...prev, [qId]: oId }));
    if (sessionKeyRef.current) {
      updateAnswer(sessionKeyRef.current, qId, oId);
    }
  };

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  if (loading) return <div className="centered" style={{ height: '100vh' }}>جاري التحميل...</div>;
  if (!match) return null;

  const questions = match.questions || [];

  if (result) {
    return (
      <div style={{ minHeight: '100vh', background: '#020617', color: 'white', padding: '2rem' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
          <CheckCircle2 size={48} color="#818cf8" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ marginBottom: '0.5rem' }}>تم إرسال إجاباتك</h2>
          <p style={{ fontSize: '2rem', fontWeight: 800, color: '#818cf8' }}>{result.score} / {result.total_mark}</p>
          <p style={{ opacity: 0.7, marginBottom: '1rem' }}>الوقت: {formatTimer(result.time_taken_seconds || 0)}</p>
          {result.waiting_for_opponent ? (
            <p style={{ background: 'rgba(251,191,36,0.15)', padding: '1rem', borderRadius: '0.75rem', color: '#fcd34d' }}>
              الجولة {result.round_number}: في انتظار {match.opponent_name}...
            </p>
          ) : result.round_complete ? (
            <div style={{ background: 'rgba(255,255,255,0.06)', padding: '1rem', borderRadius: '0.75rem' }}>
              <p>جولتك: {result.score} — خصمك: {result.opponent_round_score ?? '?'}</p>
              <p style={{ marginTop: 8, opacity: 0.8 }}>المجموع: {result.cumulative_my_score} - {result.cumulative_opponent_score}</p>
            </div>
          ) : (
            <div style={{ background: 'rgba(255,255,255,0.06)', padding: '1rem', borderRadius: '0.75rem' }}>
              {result.is_draw && <p>تعادل!</p>}
              {result.i_won && <p style={{ color: '#4ade80' }}>فزت! 🎉</p>}
              {result.i_lost && <p style={{ color: '#f87171' }}>خسرت هذه الجولة</p>}
              <p>النتيجة: {result.score} - {result.opponent_score ?? '?'}</p>
            </div>
          )}
          <button
            onClick={() => navigate(`/course/${courseId}/competitions`)}
            style={{ marginTop: '1.5rem', padding: '0.75rem 2rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '0.75rem', cursor: 'pointer', fontWeight: 700 }}
          >
            العودة للمسابقات
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#020617', color: 'white', paddingBottom: '2rem' }}>
      <header style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={handleBack} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
            <ArrowLeft size={22} />
          </button>
          <div>
            <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.6 }}>جولة {match.round_number || ''} · vs {match.opponent_name}</p>
            <h2 style={{ margin: 0, fontSize: '1.1rem' }}>{questions.length} أسئلة</h2>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: timeLeft <= 60 ? '#f87171' : '#fcd34d', fontWeight: 800, fontSize: '1.1rem' }}>
          <Clock size={18} />
          {formatTimer(timeLeft ?? 0)}
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
                      display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1rem',
                      borderRadius: '0.75rem', border: selected ? '2px solid #6366f1' : '1px solid rgba(255,255,255,0.15)',
                      background: selected ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                      color: 'white', cursor: 'pointer', textAlign: 'right', width: '100%',
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
          onClick={() => doSubmit(false)}
          disabled={submitting}
          style={{
            width: '100%', padding: '1rem', marginTop: '1rem',
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: 'white', border: 'none',
            borderRadius: '0.875rem', fontWeight: 700, fontSize: '1.05rem',
            cursor: submitting ? 'wait' : 'pointer', opacity: submitting ? 0.7 : 1,
          }}
        >
          {submitting ? 'جاري الإرسال...' : 'إرسال الإجابات'}
        </button>
      </div>
    </div>
  );
};

export default CompetitionMatch;
