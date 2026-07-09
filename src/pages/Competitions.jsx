import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Swords, Play, Hourglass, Clock, ChevronDown, ChevronUp, Eye, X, Loader2 } from 'lucide-react';
import { studentApi } from '../api';
import KnockoutBracket from '../components/KnockoutBracket';

const sortMatches = (matches) =>
  [...(matches || [])].sort((a, b) => {
    const key = (m) => {
      if (m.is_active) return 0;
      if (m.status === 'completed') return 2;
      return 1;
    };
  const k = key(a) - key(b);
  if (k !== 0) return k;
  return (a.scheduled_question_round ?? 0) - (b.scheduled_question_round ?? 0);
  });

const Competitions = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('league');
  const [data, setData] = useState({ cup: null, league: null });
  const [loading, setLoading] = useState(true);
  const [showFullCup, setShowFullCup] = useState(false);
  const [showFullStandings, setShowFullStandings] = useState(false);
  const [answersModal, setAnswersModal] = useState(null);
  const [answersLoading, setAnswersLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await studentApi.getCompetitions(courseId);
      setData(res.data || { cup: null, league: null });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [courseId]);
  useEffect(() => { setShowFullCup(false); setShowFullStandings(false); }, [activeTab]);

  const comp = data[activeTab];
  const isLeague = activeTab === 'league';
  const isCup = activeTab === 'cup';

  const formatTime = (sec) => {
    if (sec == null) return '—';
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const phaseLabel = { groups: 'دور المجموعات', knockout: 'خروج المغلوب', finished: 'انتهت', league: 'الدوري' };

  const statusLabel = (m) => {
    const roundScore = m.my_round_score != null ? ` · جولتك: ${m.my_round_score}` : '';
    if (m.status === 'tie_pending') return 'في انتظار اختيار المدرس للفائز';
    if (m.stage === 'knockout') {
      const prefix = `كأس · جولة ${m.knockout_round || ''} · `;
      if (m.status === 'completed') {
        const draw = m.is_draw ? ' (تعادل)' : '';
        const win = m.i_won ? ' ✅' : '';
        return `${prefix}${m.my_score ?? '-'} - ${m.opponent_score ?? '-'}${draw}${win}${roundScore}`;
      }
      if (m.status === 'partial') return `${prefix}في انتظار الخصم${roundScore}`;
      return `${prefix}لم تبدأ بعد`;
    }
    if (m.status === 'completed') {
      const draw = m.is_draw ? ' (تعادل)' : '';
      const win = m.i_won ? ' ✅' : '';
      return `${m.my_score ?? '-'} - ${m.opponent_score ?? '-'}${draw}${win}`;
    }
    if (m.status === 'partial') return `في انتظار الخصم${roundScore}`;
    if (m.scheduled_question_round) return `جولة ${m.scheduled_question_round} — لم تبدأ بعد`;
    const roundsPlayed = m.rounds_played ?? 0;
    if (roundsPlayed > 0 && m.my_score != null) {
      return `المجموع: ${m.my_score} - ${m.opponent_score ?? '-'}${roundScore}`;
    }
    return 'لم تبدأ بعد';
  };

  const standingRow = (s, i, showRecord = false) => (
    <div
      key={s.student_id}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.85rem 1rem',
        background: s.is_me ? 'rgba(79,70,229,0.08)' : 'white',
        borderRadius: '14px',
        border: s.is_me ? '1px solid rgba(79,70,229,0.25)' : '1px solid #f1f5f9',
        boxShadow: s.is_me ? 'none' : '0 2px 6px rgba(0,0,0,0.03)',
        marginBottom: '0.5rem',
      }}
    >
      <span style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', color: 'var(--primary)', background: i < 3 ? 'rgba(79,70,229,0.12)' : 'transparent' }}>
        {i + 1}
      </span>
      <span style={{ flex: 1, fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>
        {s.student_name}
        {s.direct_advance && (
          <span style={{ marginRight: '0.4rem', fontSize: '0.65rem', background: '#fef3c7', color: '#b45309', padding: '0.1rem 0.45rem', borderRadius: '1rem' }}>متأهل</span>
        )}
      </span>
      <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.9rem' }}>{s.points} نقطة</span>
      {showRecord && (
        <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{formatTime(s.total_time_seconds)} · {s.wins}/{s.draws}/{s.losses}</span>
      )}
      {!showRecord && (
        <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{formatTime(s.total_time_seconds)}</span>
      )}
    </div>
  );

  const openMatchAnswers = async (matchId, opponentName) => {
    setAnswersLoading(true);
    setAnswersModal({ matchId, opponentName, loading: true });
    try {
      const res = await studentApi.getCompetitionMatchResult(courseId, matchId);
      const payload = res.data ?? res;
      if (payload.answers_hidden || !comp?.allow_show_answers) {
        alert('عرض الإجابات غير مفعّل حالياً من المدرس');
        setAnswersModal(null);
        return;
      }
      setAnswersModal({ matchId, opponentName, data: payload });
    } catch (e) {
      alert(e?.message || 'تعذّر تحميل الإجابات');
      setAnswersModal(null);
    } finally {
      setAnswersLoading(false);
    }
  };

  const matchCard = (m) => {
    const isActive = m.is_active;
    const canPlay = m.can_play;
    const submitted = m.i_submitted && m.status !== 'completed';

    return (
      <div
        key={m.id}
        style={{
          padding: '1rem',
          background: 'white',
          borderRadius: '14px',
          border: isActive ? '1.5px solid rgba(79,70,229,0.35)' : '1px solid #f1f5f9',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          marginBottom: '0.65rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Swords size={18} color="var(--primary)" />
          <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>vs {m.opponent_name}</span>
        </div>
        <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 0.25rem' }}>{statusLabel(m)}</p>
        {m.status === 'completed' && m.my_time_seconds != null && (
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Clock size={12} /> الوقت: {formatTime(m.my_time_seconds)}
          </p>
        )}
        {(canPlay || m.can_show_answers) && (
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
            {canPlay && (
              <button
                onClick={() => navigate(`/course/${courseId}/competitions/match/${m.id}`)}
                style={{ flex: 1, padding: '0.7rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontSize: '0.88rem' }}
              >
                <Play size={16} fill="white" /> العب
              </button>
            )}
            {m.can_show_answers && (
              <button
                onClick={() => openMatchAnswers(m.id, m.opponent_name)}
                disabled={answersLoading}
                style={{
                  flex: 1,
                  padding: '0.65rem',
                  background: 'white',
                  color: '#059669',
                  border: '2px solid #6ee7b7',
                  borderRadius: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  fontSize: '0.88rem',
                }}
              >
                <Eye size={16} /> الإجابات
              </button>
            )}
          </div>
        )}
        {submitted && (
          <div style={{ marginTop: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary)', fontSize: '0.82rem', fontWeight: 600 }}>
            <Hourglass size={14} /> في انتظار الخصم
          </div>
        )}
      </div>
    );
  };

  const groupBlock = (group, title) => (
    <div key={group.group_number} style={{ marginBottom: '1rem' }}>
      <h4 style={{ margin: '0 0 0.5rem', fontWeight: 700, fontSize: '0.9rem', color: '#475569' }}>{title || `المجموعة ${group.group_number}`}</h4>
      {(group.standings || []).map((s, i) => standingRow(s, i))}
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8faff', paddingBottom: '3rem' }}>
      <div style={{ background: 'linear-gradient(135deg, var(--primary), #4338ca)', padding: '1.5rem', borderRadius: '0 0 2rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', maxWidth: '900px', margin: '0 auto' }}>
          <button onClick={() => navigate(`/course/${courseId}`)} style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', margin: 0 }}>المسابقات</p>
            <h1 style={{ color: 'white', margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>🏆 الدوري والكأس</h1>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '1.5rem auto', padding: '0 1rem' }}>
        <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '1.25rem', background: 'white', padding: '0.35rem', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          {[{ key: 'league', label: 'الدوري' }, { key: 'cup', label: 'الكأس' }].map((t) => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 700, background: activeTab === t.key ? 'var(--primary)' : 'transparent', color: activeTab === t.key ? 'white' : '#64748b' }}>
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="centered" style={{ padding: '4rem' }}>جاري التحميل...</div>
        ) : !comp ? (
          <div className="glass-card centered" style={{ padding: '3rem', background: 'white', flexDirection: 'column', gap: '1rem', borderRadius: '16px' }}>
            <Trophy size={48} color="#cbd5e1" />
            <p style={{ color: '#64748b', fontWeight: 600 }}>لا توجد مسابقة نشطة بعد</p>
          </div>
        ) : (
          <>
            {comp.active_round ? (
              <div style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', borderRadius: '16px', padding: '1.15rem 1.25rem', marginBottom: '0.75rem', color: 'white', boxShadow: '0 4px 12px rgba(79,70,229,0.25)' }}>
                <p style={{ margin: 0, fontWeight: 800, fontSize: '0.95rem' }}>🔴 الجولة {comp.active_round.round_number} نشطة الآن</p>
                <p style={{ margin: '0.35rem 0 0', fontSize: '0.8rem', opacity: 0.9 }}>
                  {comp.active_round.questions_per_round} أسئلة · {Math.round((comp.active_round.time_limit_seconds || 900) / 60)} دقيقة
                </p>
              </div>
            ) : comp.phase !== 'finished' ? (
              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '14px', padding: '0.85rem 1rem', marginBottom: '0.75rem', color: '#92400e', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Hourglass size={18} /> في انتظار المدرس لبدء الجولة التالية
              </div>
            ) : null}

            {comp.is_eliminated && !comp.result_message?.message && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '0.85rem 1rem', marginBottom: '0.75rem', color: '#b91c1c', fontSize: '0.85rem', fontWeight: 600 }}>
                تم إقصاؤك من المسابقة
              </div>
            )}

            {comp.result_message?.message && (
              <div style={{
                background: comp.result_message.kind === 'champion' ? '#ecfdf5' : comp.result_message.kind === 'runner_up' || comp.result_message.kind === 'podium' ? '#eff6ff' : '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '0.75rem',
                color: '#0f172a',
                fontSize: '0.95rem',
                fontWeight: 700,
                textAlign: 'center',
              }}>
                {comp.result_message.message}
              </div>
            )}

            {!isLeague && comp.direct_advance && (
              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '0.85rem 1rem', marginBottom: '0.75rem', color: '#92400e', fontSize: '0.85rem', fontWeight: 600 }}>
                أنت متأهل مباشرة من دور المجموعات
              </div>
            )}

            {!isLeague && comp.my_group > 0 && (
              <div style={{ background: 'rgba(79,70,229,0.08)', border: '1px solid rgba(79,70,229,0.15)', borderRadius: '12px', padding: '0.85rem 1rem', marginBottom: '0.75rem', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600 }}>
                مجموعتك: {comp.my_group} · المرحلة: {phaseLabel[comp.phase] || comp.phase}
              </div>
            )}

            <h3 style={{ margin: '0 0 0.5rem', fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>مبارياتي</h3>
            {(comp.matches || []).length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>لا توجد مباريات</p>
            ) : (
              sortMatches(comp.matches).map(matchCard)
            )}

            <div style={{ height: '1rem' }} />

            {isLeague ? (
              <>
                <h3 style={{ margin: '0 0 0.75rem', fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>ترتيب الدوري</h3>
                {(comp.standings || []).length === 0 ? (
                  <p style={{ color: '#94a3b8' }}>لا توجد بيانات</p>
                ) : (
                  <>
                    {(showFullStandings ? comp.standings : comp.standings.slice(0, 5)).map((s, i) => standingRow(s, i, true))}
                    {comp.standings.length > 5 && (
                      <button
                        onClick={() => setShowFullStandings((v) => !v)}
                        style={{
                          width: '100%',
                          marginTop: '0.5rem',
                          padding: '0.75rem',
                          background: 'white',
                          border: '2px solid var(--primary)',
                          borderRadius: '14px',
                          color: 'var(--primary)',
                          fontWeight: 800,
                          cursor: 'pointer',
                        }}
                      >
                        {showFullStandings ? 'عرض أقل' : 'عرض الترتيب كامل'}
                      </button>
                    )}
                  </>
                )}
              </>
            ) : !showFullCup ? (
              <>
                <h3 style={{ margin: '0.5rem 0 0.5rem', fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>
                  ترتيب مجموعتك ({comp.my_group || '—'})
                </h3>
                {(comp.group_standings || []).length === 0 ? (
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>لا توجد بيانات</p>
                ) : (
                  comp.group_standings.map((s, i) => standingRow(s, i))
                )}
              </>
            ) : (
              <>
                {(comp.direct_advancers || []).length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <h4 style={{ margin: '0 0 0.5rem', fontWeight: 700, color: '#b45309' }}>متأهلون مباشرة</h4>
                    {comp.direct_advancers.map((s, i) => standingRow(s, i))}
                  </div>
                )}

                <h3 style={{ margin: '0 0 0.75rem', fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>المجموعات</h3>
                {(comp.all_groups || []).length === 0 ? (
                  <p style={{ color: '#94a3b8' }}>لا توجد مجموعات</p>
                ) : (
                  comp.all_groups.map((g) => groupBlock(g))
                )}

                <h3 style={{ margin: '1.25rem 0 0.5rem', fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>خروج المغلوب</h3>
                <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #f1f5f9', padding: '0.75rem', width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
                  <KnockoutBracket bracket={comp.knockout_bracket} />
                </div>
                <p style={{ margin: '0.5rem 0 0', fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center' }}>اسحب يميناً لعرض الشجرة كاملة</p>
              </>
            )}

            {!isLeague && (
              <button
                onClick={() => setShowFullCup((v) => !v)}
                style={{
                  width: '100%',
                  marginTop: '1.25rem',
                  padding: '0.85rem',
                  background: 'white',
                  border: '2px solid var(--primary)',
                  borderRadius: '14px',
                  color: 'var(--primary)',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  fontSize: '0.95rem',
                }}
              >
                {showFullCup ? <><ChevronUp size={18} /> عرض مجموعتي فقط</> : <><ChevronDown size={18} /> اعرض المسابقة كاملة</>}
              </button>
            )}
          </>
        )}
      </div>

      {answersModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(15,23,42,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'white', borderRadius: '16px', maxWidth: 520, width: '100%', maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ margin: 0, fontWeight: 800, color: '#0f172a' }}>إجاباتي — vs {answersModal.opponentName}</p>
                {answersModal.data && (
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                    النتيجة: {answersModal.data.player1_score ?? '-'} - {answersModal.data.player2_score ?? '-'}
                  </p>
                )}
              </div>
              <button onClick={() => setAnswersModal(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={22} />
              </button>
            </div>
            <div style={{ padding: '1rem 1.25rem', overflowY: 'auto', flex: 1 }}>
              {answersModal.loading || !answersModal.data ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                  <Loader2 size={28} className="animate-spin" color="var(--primary)" />
                </div>
              ) : (answersModal.data.rounds || []).length === 0 ? (
                <p style={{ color: '#94a3b8', textAlign: 'center' }}>لا توجد إجابات</p>
              ) : (
                answersModal.data.rounds.map((round) => (
                  <div key={round.round_id || round.round_number} style={{ marginBottom: '1.25rem' }}>
                    <p style={{ fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      الجولة {round.round_number} — {round.score}/{round.total_mark} · {formatTime(round.time_taken_seconds)}
                    </p>
                    {(round.answers || []).map((a, i) => (
                      <div
                        key={i}
                        style={{
                          padding: '0.75rem',
                          marginBottom: '0.5rem',
                          borderRadius: '10px',
                          border: `1px solid ${a.is_correct ? '#6ee7b7' : '#fecaca'}`,
                          background: a.is_correct ? '#ecfdf5' : '#fef2f2',
                        }}
                      >
                        <p style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a', margin: '0 0 0.35rem' }}>{i + 1}. {a.question_text}</p>
                        <p style={{ fontSize: '0.8rem', color: '#475569', margin: '0.15rem 0' }}>اختيارك: <strong>{a.selected_option_text || '—'}</strong></p>
                        <p style={{ fontSize: '0.8rem', color: '#059669', margin: 0 }}>الصحيحة: <strong>{a.correct_option_text || '—'}</strong></p>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Competitions;
