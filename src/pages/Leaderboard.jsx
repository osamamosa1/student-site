import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Medal, Star, Zap, BookOpen, Award } from 'lucide-react';
import { studentApi } from '../api';

const RANK_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];
const RANK_ICONS = [
  <Trophy size={18} fill="#FFD700" color="#FFD700" />,
  <Medal size={18} fill="#C0C0C0" color="#C0C0C0" />,
  <Award size={18} fill="#CD7F32" color="#CD7F32" />,
];

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
};

const Leaderboard = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [courseTitle, setCourseTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [lbRes, courseRes] = await Promise.all([
          studentApi.getCourseLeaderboard(courseId),
          studentApi.getCourseDetails(courseId),
        ]);
        setData(lbRes);
        setCourseTitle(courseRes?.data?.title || 'Course');
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [courseId]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ width: '48px', height: '48px', border: '3px solid rgba(255,255,255,0.2)', borderTopColor: '#FFD700', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ opacity: 0.7 }}>Loading Leaderboard...</p>
        </div>
      </div>
    );
  }

  const leaderboard = (data?.data || []).map((item) => ({
    rank: item.rank,
    studentId: item.student_id ?? item.studentId,
    name: item.name,
    totalPoints: item.total_points ?? item.totalPoints ?? 0,
    examPoints: item.exam_points ?? item.examPoints ?? 0,
    videoPoints: item.video_points ?? item.videoPoints ?? 0,
    assignmentPoints: item.assignment_points ?? item.assignmentPoints ?? 0,
    isCurrentStudent: item.is_current_student ?? item.isCurrentStudent ?? false,
  }));
  const myPoints = data?.my_points ?? data?.myPoints ?? 0;
  const myRank = data?.my_rank ?? data?.myRank ?? '-';

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #0f172a 0%, #1e1b4b 55%, #0f172a 100%)', paddingBottom: '3rem' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes glow { 0%,100% { box-shadow: 0 0 20px rgba(255,215,0,0.3); } 50% { box-shadow: 0 0 40px rgba(255,215,0,0.6); } }
        .lb-row:hover { background: rgba(255,255,255,0.08) !important; transform: translateX(4px); }
        .lb-row { transition: all 0.2s ease; }
        .my-row { animation: glow 2s ease-in-out infinite; }
      `}</style>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.3), rgba(124,58,237,0.3))', borderBottom: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', padding: '1rem 1.5rem 2rem' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <button onClick={() => navigate(`/course/${courseId}`)} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowLeft size={18} />
            </button>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', margin: 0 }}>{courseTitle}</p>
              <h1 style={{ color: 'white', margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>🏆 Leaderboard</h1>
            </div>
          </div>

          {/* My Stats Card */}
          <div style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.4), rgba(124,58,237,0.4))', borderRadius: '1.25rem', padding: '1.25rem 1.5rem', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', margin: '0 0 0.25rem' }}>My Rank</p>
              <p style={{ color: '#FFD700', fontWeight: 900, fontSize: '2rem', margin: 0, lineHeight: 1 }}>#{myRank}</p>
            </div>
            <div style={{ width: '1px', background: 'rgba(255,255,255,0.15)' }} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', margin: '0 0 0.25rem' }}>My Points</p>
              <p style={{ color: 'white', fontWeight: 900, fontSize: '2rem', margin: 0, lineHeight: 1 }}>{myPoints.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 1rem' }}>

        {/* Top 3 Podium */}
        {top3.length > 0 && (
          <div style={{ animation: 'fadeUp 0.5s ease', marginTop: '-1rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '0.75rem', padding: '2rem 0 0' }}>
              {/* 2nd Place */}
              {top3[1] && (
                <div style={{ textAlign: 'center', flex: 1, maxWidth: '130px' }}>
                  <div style={{ position: 'relative', display: 'inline-block', marginBottom: '0.75rem' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: `linear-gradient(135deg, #C0C0C0, #a8a8a8)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', fontWeight: 800, color: 'white', margin: '0 auto', border: '2px solid rgba(255,255,255,0.3)', boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
                      {getInitials(top3[1].name)}
                    </div>
                    <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', background: '#C0C0C0', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 900, color: '#0f172a' }}>2</div>
                  </div>
                  <div style={{ background: 'linear-gradient(180deg, rgba(192,192,192,0.15), rgba(192,192,192,0.05))', borderRadius: '1rem 1rem 0 0', padding: '0.75rem 0.5rem', border: '1px solid rgba(192,192,192,0.25)', borderBottom: 'none', height: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <p style={{ color: 'white', fontWeight: 700, fontSize: '0.8rem', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{top3[1].name}</p>
                    <p style={{ color: '#C0C0C0', fontWeight: 800, fontSize: '1.1rem', margin: '0.25rem 0 0' }}>{top3[1].totalPoints.toLocaleString()}</p>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', margin: '0.15rem 0 0' }}>pts</p>
                  </div>
                </div>
              )}

              {/* 1st Place */}
              {top3[0] && (
                <div style={{ textAlign: 'center', flex: 1, maxWidth: '140px' }}>
                  <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>👑</div>
                  <div style={{ position: 'relative', display: 'inline-block', marginBottom: '0.75rem' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: `linear-gradient(135deg, #FFD700, #ff8c00)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', fontWeight: 800, color: 'white', margin: '0 auto', border: '3px solid rgba(255,215,0,0.6)', boxShadow: '0 0 30px rgba(255,215,0,0.4)' }}>
                      {getInitials(top3[0].name)}
                    </div>
                    <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', background: '#FFD700', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 900, color: '#0f172a' }}>1</div>
                  </div>
                  <div style={{ background: 'linear-gradient(180deg, rgba(255,215,0,0.2), rgba(255,215,0,0.05))', borderRadius: '1rem 1rem 0 0', padding: '1rem 0.75rem', border: '1px solid rgba(255,215,0,0.3)', borderBottom: 'none', height: '130px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <p style={{ color: 'white', fontWeight: 800, fontSize: '0.85rem', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{top3[0].name}</p>
                    <p style={{ color: '#FFD700', fontWeight: 900, fontSize: '1.3rem', margin: '0.25rem 0 0' }}>{top3[0].totalPoints.toLocaleString()}</p>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', margin: '0.15rem 0 0' }}>pts</p>
                  </div>
                </div>
              )}

              {/* 3rd Place */}
              {top3[2] && (
                <div style={{ textAlign: 'center', flex: 1, maxWidth: '130px' }}>
                  <div style={{ position: 'relative', display: 'inline-block', marginBottom: '0.75rem' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: `linear-gradient(135deg, #CD7F32, #a0622b)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', fontWeight: 800, color: 'white', margin: '0 auto', border: '2px solid rgba(205,127,50,0.4)', boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
                      {getInitials(top3[2].name)}
                    </div>
                    <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', background: '#CD7F32', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 900, color: 'white' }}>3</div>
                  </div>
                  <div style={{ background: 'linear-gradient(180deg, rgba(205,127,50,0.12), rgba(205,127,50,0.03))', borderRadius: '1rem 1rem 0 0', padding: '0.75rem 0.5rem', border: '1px solid rgba(205,127,50,0.2)', borderBottom: 'none', height: '80px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <p style={{ color: 'white', fontWeight: 700, fontSize: '0.8rem', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{top3[2].name}</p>
                    <p style={{ color: '#CD7F32', fontWeight: 800, fontSize: '1.1rem', margin: '0.25rem 0 0' }}>{top3[2].totalPoints.toLocaleString()}</p>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', margin: '0.15rem 0 0' }}>pts</p>
                  </div>
                </div>
              )}
            </div>
            {/* Base */}
            <div style={{ height: '3px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)', borderRadius: '2px' }} />
          </div>
        )}

        {/* Points Info Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '1rem', padding: '1rem', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '0.75rem', background: 'rgba(251,191,36,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Star size={18} color="#fbbf24" fill="#fbbf24" />
            </div>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', margin: 0 }}>Exam Points</p>
              <p style={{ color: 'white', fontWeight: 700, fontSize: '0.85rem', margin: 0 }}>20 pts on first pass</p>
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '1rem', padding: '1rem', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '0.75rem', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Zap size={18} color="#818cf8" fill="#818cf8" />
            </div>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', margin: 0 }}>Video Points</p>
              <p style={{ color: 'white', fontWeight: 700, fontSize: '0.85rem', margin: 0 }}>50 pts / video (50% watch)</p>
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '1rem', padding: '1rem', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '0.75rem', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <BookOpen size={18} color="#34d399" />
            </div>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', margin: 0 }}>Assignment Points</p>
              <p style={{ color: 'white', fontWeight: 700, fontSize: '0.85rem', margin: 0 }}>10 pts per submission</p>
            </div>
          </div>
        </div>

        {/* Full Rankings List */}
        {leaderboard.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'rgba(255,255,255,0.5)' }}>
            <Trophy size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>No scores yet</p>
            <p style={{ fontSize: '0.85rem' }}>Complete exams and watch videos to earn points!</p>
          </div>
        ) : (
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={16} color="rgba(255,255,255,0.5)" />
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', fontWeight: 600 }}>All Rankings</span>
              <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>{leaderboard.length} students</span>
            </div>
            {leaderboard.map((item, idx) => (
              <div
                key={item.studentId}
                className={`lb-row ${item.isCurrentStudent ? 'my-row' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.875rem 1.25rem',
                  borderBottom: idx < leaderboard.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  background: item.isCurrentStudent ? 'rgba(79,70,229,0.15)' : 'transparent',
                  cursor: 'default',
                }}
              >
                {/* Rank */}
                <div style={{ width: '32px', textAlign: 'center', flexShrink: 0 }}>
                  {idx < 3 ? RANK_ICONS[idx] : (
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 700, fontSize: '0.9rem' }}>#{item.rank}</span>
                  )}
                </div>

                {/* Avatar */}
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: item.isCurrentStudent ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : `linear-gradient(135deg, hsl(${(item.studentId * 47) % 360}, 60%, 40%), hsl(${(item.studentId * 47 + 40) % 360}, 60%, 30%))`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: 'white', flexShrink: 0, border: item.isCurrentStudent ? '2px solid rgba(99,102,241,0.6)' : 'none' }}>
                  {getInitials(item.name)}
                </div>

                {/* Name */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: 'white', fontWeight: item.isCurrentStudent ? 800 : 600, fontSize: '0.9rem', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.name}
                    {item.isCurrentStudent && <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', background: 'rgba(99,102,241,0.3)', color: '#a5b4fc', padding: '0.1rem 0.4rem', borderRadius: '0.5rem', fontWeight: 600 }}>You</span>}
                  </p>
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.2rem', flexWrap: 'wrap' }}>
                    <span style={{ color: 'rgba(255,215,0,0.7)', fontSize: '0.7rem' }}>⭐ {item.examPoints} exam</span>
                    <span style={{ color: 'rgba(129,140,248,0.7)', fontSize: '0.7rem' }}>⚡ {item.videoPoints} video</span>
                    <span style={{ color: 'rgba(52,211,153,0.7)', fontSize: '0.7rem' }}>📝 {item.assignmentPoints} assignment</span>
                  </div>
                </div>

                {/* Points */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ color: idx === 0 ? '#FFD700' : idx === 1 ? '#C0C0C0' : idx === 2 ? '#CD7F32' : (item.isCurrentStudent ? '#a5b4fc' : 'rgba(255,255,255,0.8)'), fontWeight: 800, fontSize: '1rem', margin: 0 }}>
                    {item.totalPoints.toLocaleString()}
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', margin: 0 }}>pts</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
