import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  PlayCircle, 
  FileText, 
  Award, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  BookOpen,
  Lock,
  Download,
  ExternalLink,
  MessageCircle,
  Eye,
  Menu,
  Heart
} from 'lucide-react';
import { studentApi } from '../api';
import YoutubeLessonPlayer from '../components/YoutubeLessonPlayer';
import ProtectedLinkViewer from '../components/ProtectedLinkViewer';

const CoursePlayer = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [platformSettings, setPlatformSettings] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [submitUrl, setSubmitUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const reloadLesson = async () => {
    const response = await studentApi.getLessonDetails(lessonId);
    setLesson(response.data);
    setIsFavorite(response.data.is_favorite);
  };

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await studentApi.getLessonDetails(lessonId);
        setLesson(response.data);
        setIsFavorite(response.data.is_favorite);
        setPlatformSettings(response.platform_settings);
        
        // Fetch course to get the sidebar/curriculum context
        const courseId = response.data.course?.id;
        if (courseId) {
           const courseRes = await studentApi.getCourseDetails(courseId);
           setCourse(courseRes.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [lessonId]);

  const handleToggleFavorite = async () => {
    if (!lesson) return;
    try {
      const res = await studentApi.toggleFavorite(lesson.id);
      setIsFavorite(res.is_favorite);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitAssignment = async () => {
    if (!submitUrl.trim()) return;
    setSubmitting(true);
    try {
      const res = await studentApi.submitAssignment(lesson.id, submitUrl.trim());
      setSubmitUrl('');
      setSubmitOpen(false);
      const refreshed = await studentApi.getLessonDetails(lessonId);
      setLesson(refreshed.data);
      const pts = res.points_added ?? 0;
      const milestone = res.milestone_reached;
      if (pts > 0) {
        let msg = `Assignment submitted! +${pts} points added to leaderboard.`;
        if (milestone) msg += ` Milestone reached: ${milestone} points!`;
        alert(msg);
      }
    } catch (err) {
      alert(err?.message || 'Failed to submit assignment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="centered" style={{ height: '100vh', background: '#0f172a' }}>Syncing learning environment...</div>;
  if (!lesson) return <div className="centered white">Lesson not found</div>;

  const renderContent = () => {
    switch (lesson.type) {
      case 'video':
        return (
          <YoutubeLessonPlayer
            lesson={lesson}
            courseId={lesson.course?.id || course?.id}
          />
        );
      case 'text':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
             <div className="glass-card" style={{ padding: '3rem', background: 'white' }}>
                <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: '#1e293b' }}>{lesson.title}</h2>
                <div style={{ color: '#475569', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: lesson.extra ? '1rem' : 0 }}>
                   {lesson.content}
                </div>
                {lesson.extra && (
                  <>
                    <h4 className="flexCenteredV" style={{ gap: '0.75rem', color: '#1e293b', marginBottom: '0.5rem' }}>
                      <FileText size={20} color="var(--primary)" /> Document
                    </h4>
                    <ProtectedLinkViewer url={lesson.extra} title={lesson.title} />
                  </>
                )}
             </div>
          </div>
        );
      case 'assignment':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
             <div className="glass-card" style={{ padding: '3rem', background: 'white' }}>
                <div className="space-between" style={{ marginBottom: '2rem' }}>
                   <div>
                      <h4 style={{ color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem' }}>Practical Assignment</h4>
                      <h2 style={{ fontSize: '1.75rem', color: '#1e293b' }}>{lesson.title}</h2>
                   </div>
                   <div className="glass centered" style={{ padding: '0.75rem 1.5rem', gap: '0.5rem', background: '#eff6ff', color: '#3b82f6', border: '1px solid #dbeafe', borderRadius: '1rem' }}>
                      <Award size={20} /> <strong>{lesson.assignment?.points || 10} Points</strong>
                   </div>
                </div>
                
                <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                  {lesson.assignment?.description || lesson.content}
                </p>

                {lesson.extra && (
                  <>
                    <h4 className="flexCenteredV" style={{ gap: '0.75rem', color: '#1e293b', marginBottom: '0.5rem' }}>
                      <FileText size={20} color="var(--primary)" /> Assignment Resources
                    </h4>
                    <ProtectedLinkViewer url={lesson.extra} title={lesson.title} />
                  </>
                )}

                <div style={{ marginTop: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                  <button className="btn btn-primary" onClick={() => setSubmitOpen(true)}>
                    Submit Assignment
                  </button>
                  {(lesson.assignment_submissions || []).length > 0 && (
                    <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
                      {lesson.assignment_submissions.length} submission(s) sent
                    </span>
                  )}
                </div>

                {(lesson.assignment_submissions || []).length > 0 && (
                  <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
                    <p style={{ fontWeight: 700, marginBottom: '0.75rem', color: '#1e293b' }}>Your submissions</p>
                    {(lesson.assignment_submissions || []).map((sub) => (
                      <div key={sub.id} style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '0.5rem' }}>
                        <ExternalLink size={14} style={{ display: 'inline', marginRight: 6 }} />
                        {sub.submission_url} · {sub.submitted_at}
                      </div>
                    ))}
                  </div>
                )}
             </div>
          </div>
        );
      case 'exam':
        return (
          <div className="glass-card centered" style={{ padding: '5rem', background: 'white', flexDirection: 'column', gap: '2rem', textAlign: 'center' }}>
             <div className="centered" style={{ width: '100px', height: '100px', background: 'rgba(79, 70, 229, 0.1)', borderRadius: '50%', color: 'var(--primary)' }}>
                <Award size={48} />
             </div>
             <div>
                <h2 style={{ fontSize: '2rem', color: '#1e293b' }}>Interactive Assessment</h2>
                <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '500px', marginTop: '1rem' }}>This lesson consists of an interactive exam. Test your proficiency on the topics covered.</p>
             </div>
             <div className="flex" style={{ gap: '2rem', margin: '2rem 0' }}>
                <div className="centered" style={{ flexDirection: 'column' }}>
                   <span style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--primary)' }}>{lesson.exam?.questions_count}</span>
                   <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>QUESTIONS</span>
                </div>
                <div className="centered" style={{ flexDirection: 'column' }}>
                   <span style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--primary)' }}>{lesson.exam?.duration}m</span>
                   <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>LIMIT</span>
                </div>
                <div className="centered" style={{ flexDirection: 'column' }}>
                   <span style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--primary)' }}>{lesson.exam?.passing_score}%</span>
                   <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>PASSING</span>
                </div>
             </div>
             <button 
                onClick={() => navigate(`/exam/${lesson.id}`)}
                className="btn btn-primary" 
                style={{ padding: '1rem 3rem', fontSize: '1.1rem', borderRadius: '3rem' }}
             >
                Start Assessment Now
             </button>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div style={{ background: '#f1f5f9', minHeight: '100vh', display: 'flex', color: '#0f172a', flexDirection: 'column' }}>
      {/* Mobile Top Navigation */}
      <div className="mobile-top-nav" style={{ display: 'none', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'linear-gradient(135deg, var(--primary), #4338ca)', color: 'white', position: 'sticky', top: 0, zIndex: 200, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'white', padding: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <ArrowLeft size={22} />
        </button>
        <span style={{ fontWeight: '700', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '0 1rem', flex: 1, textAlign: 'center' }}>{course?.title || 'Syllabus'}</span>
        <button onClick={() => {
          const sidebar = document.getElementById('course-sidebar');
          if (sidebar) {
            if (sidebar.style.display === 'flex') {
              sidebar.style.setProperty('display', 'none', 'important');
            } else {
              sidebar.style.setProperty('display', 'flex', 'important');
            }
          }
        }} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '0.5rem', borderRadius: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <Menu size={20} />
        </button>
      </div>

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar Navigation */}
        <aside id="course-sidebar" className="hidden md:flex" style={{ width: '360px', height: '100vh', background: 'white', position: 'sticky', top: 0, borderRight: '1px solid #e2e8f0', flexDirection: 'column', zIndex: 100 }}>
           <div style={{ padding: '2rem', borderBottom: '1px solid #f1f5f9' }}>
              <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ border: 'none', background: 'none', color: '#64748b' }}>
                 <ArrowLeft size={18} /> Back to Hub
              </button>
              <h3 style={{ marginTop: '1.5rem', fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>{course?.title || 'Loading Curriculum...'}</h3>
           </div>
           
           <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
              {course?.units?.map((unit, uIdx) => (
                 <div key={unit.id} style={{ marginBottom: '2rem' }}>
                    <div className="flexCenteredV" style={{ gap: '0.75rem', marginBottom: '1rem' }}>
                       <div className="centered" style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 800 }}>{uIdx + 1}</div>
                       <h5 style={{ fontSize: '0.9rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{unit.title}</h5>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '14px', borderLeft: '2px solid #f1f5f9' }}>
                       {unit.contents?.map((content) => {
                          const isActive = parseInt(lessonId) === content.id;
                          return (
                             <div 
                               key={content.id} 
                               onClick={() => navigate(`/lesson/${content.id}`)}
                               className="flexCenteredV" 
                               style={{ 
                                 padding: '0.75rem 1rem', 
                                 gap: '1rem', 
                                 cursor: 'pointer',
                                 borderRadius: '0.75rem',
                                 background: isActive ? 'rgba(79, 70, 229, 0.05)' : 'transparent',
                                 color: isActive ? 'var(--primary)' : '#64748b',
                                 transition: 'var(--transition)'
                               }}
                             >
                                {content.type === 'video' ? <PlayCircle size={18} /> : content.type === 'exam' ? <Award size={18} /> : <FileText size={18} />}
                                <span style={{ fontSize: '0.85rem', fontWeight: isActive ? 700 : 500, flex: 1 }}>{content.title}</span>
                                {isActive && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)' }} />}
                             </div>
                          );
                       })}
                    </div>
                 </div>
              ))}
           </div>
        </aside>

        {/* Main Content Area */}
        <main className="main-course-content">
           <div className="container" style={{ maxWidth: '1000px', padding: 0 }}>
              <header className="player-header">
                 <div className="flexCenteredV" style={{ gap: '1rem', flex: 1, minWidth: '200px' }}>
                    <div className="header-icon-container" style={{ width: '48px', height: '48px', borderRadius: '1rem', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                       <BookOpen size={24} />
                    </div>
                    <div style={{ minWidth: 0, overflow: 'hidden' }}>
                       <h4 style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Module {lesson.unit_id}</h4>
                       <h1 style={{ fontSize: 'clamp(1.1rem, 4vw, 1.75rem)', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lesson.title}</h1>
                    </div>
                 </div>
                 <div className="flex gap-2 sm:gap-3" style={{ flexShrink: 0 }}>
                    <button 
                       onClick={handleToggleFavorite}
                       className="btn btn-outline animate-heart" 
                       style={{ 
                         height: '42px', 
                         width: '42px',
                         padding: '0', 
                         display: 'flex', 
                         alignItems: 'center', 
                         justifyContent: 'center',
                         borderColor: isFavorite ? '#f43f5e' : '#e2e8f0',
                         background: isFavorite ? 'rgba(244, 63, 94, 0.08)' : 'white',
                         color: isFavorite ? '#f43f5e' : '#64748b',
                         transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                       }}
                       title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                     >
                       <Heart size={20} fill={isFavorite ? '#f43f5e' : 'none'} style={{ transform: isFavorite ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.2s' }} />
                     </button>
                    <button className="btn btn-outline" style={{ height: '42px', padding: '0 1rem' }} onClick={() => {
                        const wa = platformSettings?.whatsapp_number || '201007309722';
                        window.open(`https://wa.me/${wa}`, '_blank');
                    }}><MessageCircle size={18} /> <span className="hide-mobile">Help</span></button>
                    <button className="btn btn-primary" style={{ height: '42px', padding: '0 1.5rem' }}>Complete</button>
                 </div>
              </header>

              {renderContent()}

              {/* Navigation Footer */}
              <footer className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-12 md:mt-20 pt-10 border-t border-[#e2e8f0]">
                 <button className="w-full sm:w-auto btn btn-outline"><ChevronLeft size={18} /> Previous</button>
                 <div className="centered" style={{ gap: '0.75rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                    <CheckCircle2 color="#10b981" size={18} /> 85% Completed
                 </div>
                 <button className="w-full sm:w-auto btn btn-primary">Next Lesson <ChevronRight size={18} /></button>
              </footer>
           </div>
        </main>
      </div>

      {submitOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'white', borderRadius: '1.25rem', padding: '2rem', width: '100%', maxWidth: '480px', boxShadow: '0 25px 50px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 0.5rem', color: '#1e293b', fontSize: '1.25rem' }}>Submit Assignment</h3>
            <p style={{ margin: '0 0 1.25rem', color: '#64748b', fontSize: '0.9rem' }}>Paste the link to your completed file (Google Drive, Dropbox, etc.)</p>
            <input
              type="url"
              value={submitUrl}
              onChange={(e) => setSubmitUrl(e.target.value)}
              placeholder="https://drive.google.com/..."
              style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', marginBottom: '1.25rem', fontSize: '0.95rem' }}
            />
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setSubmitOpen(false)} disabled={submitting}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmitAssignment} disabled={submitting || !submitUrl.trim()}>
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
         body { background: #f1f5f9 !important; color: #0f172a !important; }
         .glass-card { box-shadow: 0 10px 30px -5px rgba(0,0,0,0.05) !important; border: 1px solid #e2e8f0 !important; border-radius: 1.5rem !important; }
         .main-course-content { flex: 1; padding: 1rem; width: 100%; min-width: 0; }
         .player-header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
         
         @media (min-width: 768px) {
             .main-course-content { padding: 3rem 4rem; }
             .player-header { margin-bottom: 3rem; }
             #course-sidebar { display: flex !important; }
         }
         
         @media (max-width: 768px) {
             .mobile-top-nav { display: flex !important; }
             #course-sidebar {
                 display: none;
                 position: fixed;
                 left: 0;
                 top: 60px;
                 width: 100% !important;
                 height: calc(100vh - 60px);
                 z-index: 1000;
             }
             .container { padding: 0 !important; }
             .hide-mobile { display: none; }
             .header-icon-container { display: none !important; }
             .player-header {
                 flex-direction: row;
                 align-items: center;
                 justify-content: space-between;
                 background: white;
                 padding: 1rem;
                 border-radius: 1rem;
                 box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
             }
         }
      `}</style>
    </div>
  );
};

export default CoursePlayer;
