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
  Maximize,
  Minimize
} from 'lucide-react';
import { studentApi } from '../api';

const WatermarkOverlay = () => {
  const [position, setPosition] = useState({ top: '20%', left: '20%' });
  const user = JSON.parse(localStorage.getItem('mps_user') || '{}');
  const userName = user.name || user.Name || 'Student';
  const userEmail = user.email || '';

  useEffect(() => {
    const interval = setInterval(() => {
      const randomTop = Math.floor(Math.random() * 60) + 20;
      const randomLeft = Math.floor(Math.random() * 60) + 15;
      setPosition({ top: `${randomTop}%`, left: `${randomLeft}%` });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 15,
        overflow: 'hidden'
      }}
    >
      <div 
        style={{
          position: 'absolute',
          top: position.top,
          left: position.left,
          color: 'rgba(255, 255, 255, 0.22)',
          fontSize: 'clamp(11px, 2.2vw, 15px)',
          fontWeight: '600',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          transform: 'translate(-50%, -50%) rotate(-12deg)',
          transition: 'all 3s ease-in-out',
          textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
          fontFamily: 'sans-serif'
        }}
      >
        {userName} {userEmail ? `(${userEmail})` : ''}
      </div>
    </div>
  );
};

const CoursePlayer = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [platformSettings, setPlatformSettings] = useState(null);
  const videoContainerRef = React.useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (videoContainerRef.current?.requestFullscreen) {
        videoContainerRef.current.requestFullscreen();
      } else if (videoContainerRef.current?.webkitRequestFullscreen) {
        videoContainerRef.current.webkitRequestFullscreen();
      } else if (videoContainerRef.current?.msRequestFullscreen) {
        videoContainerRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await studentApi.getLessonDetails(lessonId);
        setLesson(response.data);
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

  if (loading) return <div className="centered" style={{ height: '100vh', background: '#0f172a' }}>Syncing learning environment...</div>;
  if (!lesson) return <div className="centered white">Lesson not found</div>;

  const renderContent = () => {
    switch (lesson.type) {
      case 'video':
        const videoId = lesson.content?.split('v=')[1]?.split('&')[0] || 
                        lesson.content?.split('youtu.be/')[1] || 
                        lesson.content?.split('embed/')[1]?.split('?')[0];
        return (
           <div className="glass-card" style={{ padding: '0', overflow: 'hidden', background: 'black', borderRadius: isFullscreen ? '0' : '1.5rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
             {/* Wrapper with aspect ratio and custom fullscreen ref */}
             <div 
               ref={videoContainerRef}
               style={{ 
                 position: 'relative', 
                 paddingBottom: isFullscreen ? '0' : '56.25%', 
                 height: isFullscreen ? '100vh' : 0, 
                 width: isFullscreen ? '100vw' : '100%',
                 overflow: 'hidden',
                 background: 'black',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center'
               }}
             >
               <iframe 
                 style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                 src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&iv_load_policy=3&color=white&vq=hd1080&controls=1&disablekb=1&showinfo=0&fs=0&playsinline=1`}
                 title={lesson.title}
                 frameBorder="0" 
                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
               />
               
               {/* 
                  Ultimate Video Protection Overlay
                  We cover the top and bottom completely to block Title, Channel Name, Share, YouTube Logo, and Watch on YouTube links.
                  Using clamp() ensures it's at least 60px tall on tiny mobile screens, but scales to 15% on larger screens.
                  Using rgba(0,0,0,0.01) instead of transparent forces mobile browsers to register the touch event.
               */}
               
               {/* Top Blocker (Title, Channel Name, Share) */}
               <div 
                 style={{ 
                   position: 'absolute', top: 0, left: 0, width: '100%', 
                   height: 'clamp(60px, 15%, 100px)', 
                   background: 'rgba(0,0,0,0.01)', 
                   zIndex: 10, cursor: 'default', touchAction: 'none' 
                 }} 
               />
               
               {/* Bottom Blocker (YouTube Logo, Watch on YouTube link) */}
               <div 
                 style={{ 
                   position: 'absolute', bottom: 0, left: 0, width: '100%', 
                   height: 'clamp(60px, 15%, 100px)', 
                   background: 'rgba(0,0,0,0.01)', 
                   zIndex: 10, cursor: 'default', touchAction: 'none' 
                 }} 
               />
               
               {/* Randomly moving, semi-transparent user watermark overlay */}
               <WatermarkOverlay />
               
               {/* Custom Fullscreen Button (Placed above blockers) */}
               <button 
                 onClick={toggleFullscreen}
                 style={{
                   position: 'absolute',
                   bottom: '15px',
                   right: '20px',
                   zIndex: 20,
                   background: 'rgba(0,0,0,0.6)',
                   color: 'white',
                   border: 'none',
                   borderRadius: '4px',
                   padding: '6px',
                   cursor: 'pointer',
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   transition: '0.2s'
                 }}
                 title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
               >
                 {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
               </button>
             </div>
          </div>
        );
      case 'text':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
             <div className="glass-card" style={{ padding: '3rem', background: 'white' }}>
                <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: '#1e293b' }}>{lesson.title}</h2>
                <div style={{ color: '#475569', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '2rem' }}>
                   {lesson.content}
                </div>
             </div>
             {lesson.extra && (
                <div className="glass-card" style={{ padding: '2rem', background: 'white' }}>
                   <div className="space-between" style={{ marginBottom: '1.5rem' }}>
                      <h4 className="flexCenteredV" style={{ gap: '0.75rem', color: '#1e293b' }}><FileText size={20} color="var(--primary)" /> Attachment Preview</h4>
                      {lesson.type === 'assignment' && (
                         <a href={lesson.extra} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ fontSize: '0.8rem' }}><Download size={14} /> Download PDF</a>
                      )}
                   </div>
                   <iframe src={lesson.extra} style={{ width: '100%', height: '800px', border: '1px solid #e2e8f0', borderRadius: '1rem' }} />
                </div>
             )}
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
                
                <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '2.5rem' }}>{lesson.content}</p>

             </div>
             {lesson.extra && (
                <div className="glass-card" style={{ padding: '2rem', background: 'white' }}>
                   <h4 className="flexCenteredV" style={{ gap: '0.75rem', color: '#1e293b', marginBottom: '1.5rem' }}><FileText size={20} color="var(--primary)" /> Assignment Resources</h4>
                   <iframe src={lesson.extra} style={{ width: '100%', height: '800px', border: '1px solid #e2e8f0', borderRadius: '1rem' }} />
                </div>
             )}
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
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-[#e2e8f0] sticky top-0 z-[200]">
        <button onClick={() => navigate(-1)} className="p-2 text-[#64748b]">
          <ArrowLeft size={20} />
        </button>
        <span className="font-bold truncate px-4">{course?.title || 'Course'}</span>
        <button onClick={() => document.getElementById('course-sidebar')?.classList.toggle('hidden')} className="p-2 text-indigo-600 bg-indigo-50 rounded-lg">
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

      <style>{`
        body { background: #f1f5f9 !important; color: #0f172a !important; }
        .glass-card { box-shadow: 0 10px 30px -5px rgba(0,0,0,0.05) !important; border: 1px solid #e2e8f0 !important; border-radius: 1.5rem !important; }
        .main-course-content { flex: 1; padding: 1.5rem; }
        .player-header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; }
        
        @media (min-width: 768px) {
            .main-course-content { padding: 3rem 4rem; }
            .player-header { margin-bottom: 3rem; }
        }
        
        @media (max-width: 768px) {
            #course-sidebar {
                position: fixed;
                left: 0;
                top: 60px;
                width: 100% !important;
                height: calc(100vh - 60px);
                z-index: 1000;
            }
            .container { padding: 0 !important; }
            /* Removed forced 300px iframe height to allow aspect-ratio to work properly */
            .hide-mobile { display: none; }
            .header-icon-container { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default CoursePlayer;
