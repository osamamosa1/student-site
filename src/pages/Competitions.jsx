import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Swords, Medal } from 'lucide-react';
import { studentApi } from '../api';

const Competitions = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('league');
  const [data, setData] = useState({ cup: null, league: null });
  const [loading, setLoading] = useState(true);

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

  const comp = data[activeTab];

  const formatTime = (sec) => {
    if (sec == null) return '—';
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const phaseLabel = { groups: 'دور المجموعات', knockout: 'خروج المغلوب', finished: 'انتهت', league: 'الدوري' };

  const statusLabel = (m) => {
    if (m.stage === 'knockout') {
      const prefix = `كأس · جولة ${m.knockout_round || ''} · `;
      if (m.status === 'completed') {
        const draw = m.is_draw ? ' (تعادل)' : '';
        const win = m.i_won ? ' ✅' : '';
        return `${prefix}${m.my_score ?? '-'} - ${m.opponent_score ?? '-'}${draw}${win}`;
      }
      if (m.status === 'partial') return `${prefix}في انتظار الخصم`;
      return `${prefix}لم تبدأ بعد`;
    }
    if (m.status === 'completed') {
      const draw = m.is_draw ? ' (تعادل)' : '';
      return `${m.my_score ?? '-'} - ${m.opponent_score ?? '-'}${draw}`;
    }
    if (m.status === 'partial') return 'في انتظار الخصم';
    return 'لم تبدأ بعد';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8faff', paddingBottom: '3rem' }}>
      <div style={{ background: 'linear-gradient(135deg, var(--primary), #4338ca)', padding: '1.5rem', borderRadius: '0 0 2rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', maxWidth: '900px', margin: '0 auto' }}>
          <button onClick={() => navigate(`/course/${courseId}`)} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', margin: 0 }}>المسابقات</p>
            <h1 style={{ color: 'white', margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>🏆 الدوري والكأس</h1>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '1.5rem auto', padding: '0 1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'white', padding: '0.35rem', borderRadius: '1rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          {[
            { key: 'league', label: 'الدوري' },
            { key: 'cup', label: 'الكأس' },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: '0.75rem',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                background: activeTab === t.key ? 'var(--primary)' : 'transparent',
                color: activeTab === t.key ? 'white' : '#64748b',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="centered" style={{ padding: '4rem' }}>جاري التحميل...</div>
        ) : !comp ? (
          <div className="glass-card centered" style={{ padding: '3rem', background: 'white', flexDirection: 'column', gap: '1rem' }}>
            <Trophy size={48} color="#cbd5e1" />
            <p style={{ color: '#64748b', fontWeight: 600 }}>لا توجد مسابقة نشطة بعد</p>
          </div>
        ) : (
          <>
            {comp.direct_advance && (
              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '1rem', padding: '1rem', marginBottom: '1rem', color: '#92400e', fontSize: '0.9rem', fontWeight: 600 }}>
                أنت متأهل مباشرة من دور المجموعات
              </div>
            )}

            {activeTab === 'cup' && comp.my_group > 0 && (
              <div style={{ background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: '1rem', padding: '1rem', marginBottom: '1rem', color: '#3730a3', fontSize: '0.9rem', fontWeight: 600 }}>
                مجموعتك: {comp.my_group} · المرحلة: {phaseLabel[comp.phase] || comp.phase}
              </div>
            )}

            {activeTab === 'cup' && (comp.group_standings || []).length > 0 && (
              <>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#0f172a' }}>
                  <Medal size={20} color="var(--primary)" /> ترتيب مجموعتك ({comp.my_group})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
                  {comp.group_standings.map((s, i) => (
                    <div
                      key={s.student_id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem',
                        background: s.is_me ? 'rgba(79,70,229,0.08)' : 'white',
                        borderRadius: '1rem', border: s.is_me ? '1px solid rgba(79,70,229,0.2)' : '1px solid #f1f5f9',
                      }}
                    >
                      <span style={{ fontWeight: 800, color: 'var(--primary)', width: '24px' }}>{i + 1}</span>
                      <span style={{ flex: 1, fontWeight: 600, color: '#0f172a' }}>{s.student_name}</span>
                      <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{s.points} نقطة</span>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{formatTime(s.total_time_seconds)}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#0f172a' }}>
              <Medal size={20} color="var(--primary)" /> الترتيب العام (فوز=3 · تعادل=1)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
              {(comp.standings || []).map((s, i) => (
                <div
                  key={s.student_id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem 1.25rem',
                    background: s.is_me ? 'rgba(79,70,229,0.08)' : 'white',
                    borderRadius: '1rem',
                    border: s.is_me ? '1px solid rgba(79,70,229,0.2)' : '1px solid #f1f5f9',
                  }}
                >
                  <span style={{ fontWeight: 800, color: 'var(--primary)', width: '24px' }}>{i + 1}</span>
                  <span style={{ flex: 1, fontWeight: 600, color: '#0f172a' }}>
                    {s.student_name}
                    {s.direct_advance && <span style={{ marginRight: '0.5rem', fontSize: '0.7rem', background: '#fef3c7', color: '#b45309', padding: '0.15rem 0.5rem', borderRadius: '1rem' }}>متأهل</span>}
                  </span>
                  <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{s.points} نقطة</span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{formatTime(s.total_time_seconds)} · {s.wins}/{s.draws}/{s.losses}</span>
                </div>
              ))}
            </div>

            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#0f172a' }}>
              <Swords size={20} color="var(--primary)" /> مبارياتي
            </h3>
            {(comp.matches || []).length === 0 ? (
              <p style={{ color: '#94a3b8' }}>لا توجد مباريات</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {comp.matches.map((m) => (
                  <div key={m.id} className="glass-card" style={{ padding: '1.25rem', background: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <div>
                        <p style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>vs {m.opponent_name}</p>
                        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>{statusLabel(m)}</p>
                      </div>
                      {m.can_play && (
                        <button
                          onClick={() => navigate(`/course/${courseId}/competitions/match/${m.id}`)}
                          style={{ padding: '0.65rem 1.25rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          العب المباراة
                        </button>
                      )}
                      {m.i_submitted && m.status !== 'completed' && (
                        <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>في انتظار الخصم</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Competitions;
