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
  Menu
} from 'lucide-react';
import { studentApi } from '../api';

const CoursePlayer = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await studentApi.getLessonDetails(lessonId);
        setLesson(response.data);
        
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
          <div className="glass-card" style={{ padding: '0', overflow: 'hidden', background: 'black', borderRadius: '1.5rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
             <iframe 
               width="100%" 
               height="600" 
               src={`https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&iv_load_policy=3&showinfo=0&controls=0`}
               title={lesson.title}
               frameBorder="0" 
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
               allowFullScreen
             />
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
                      <a href={lesson.extra} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ fontSize: '0.8rem' }}><Download size={14} /> Download PDF</a>
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

                <div style={{ padding: '2rem', background: '#f8fafc', borderRadius: '1.5rem', border: '1px solid #e2e8f0' }}>
                   <h5 style={{ marginBottom: '1rem' }}>Submission Status</h5>
                   <div orientation="horizontal" className="space-between">
                      <p style={{ fontSize: '0.9rem', color: '#64748b' }}>No file submitted yet.</p>
                      <button className="btn btn-primary" style={{ height: '3rem', padding: '0 2rem' }}>Submit Work</button>
                   </div>
                </div>
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
                onClick={() => navigate(`/exam/${lesson.exam?.id}`)}
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
        <main style={{ flex: 1, padding: '1.5rem md:padding: 4rem' }}>
           <div className="container" style={{ maxWidth: '1000px', padding: 0 }}>
              <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-8 md:mb-12">
                 <div className="flex items-center gap-4">
                    <div className="hidden sm:flex" style={{ width: '48px', height: '48px', borderRadius: '1rem', background: 'var(--primary)', color: 'white', alignItems: 'center', justifyContent: 'center', shrink: 0 }}>
                       <BookOpen size={24} />
                    </div>
                    <div>
                       <h4 style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Module {lesson.unit_id}</h4>
                       <h1 style={{ fontSize: '1.5rem md:fontSize: 1.75rem', fontWeight: 800 }}>{lesson.title}</h1>
                    </div>
                 </div>
                 <div className="flex gap-3">
                    <button className="flex-1 md:flex-none btn btn-outline"><MessageCircle size={18} /> Help</button>
                    <button className="flex-1 md:flex-none btn btn-primary">Complete</button>
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
            iframe { height: 300px !important; }
        }
      `}</style>
    </div>
  );
};

export default CoursePlayer;
