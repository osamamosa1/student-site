import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  FolderOpen, 
  ChevronRight, 
  BookOpen, 
  Video, 
  Users, 
  Star,
  Clock,
  Lock,
  CheckCircle2,
  GraduationCap
} from 'lucide-react';
import { studentApi } from '../api';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await studentApi.getCourseDetails(id);
        setCourse(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <div className="centered" style={{ height: '100vh', background: '#0f172a' }}>Syncing Course Syllabus...</div>;
  if (!course) return <div className="centered white">Course not found</div>;

  const isEnrolled = course.enrollment?.is_enrolled;

  return (
    <div style={{ background: '#f8faff', minHeight: '100vh', paddingBottom: '100px' }}>
      {/* Premium Header Background */}
      <div style={{ background: 'var(--primary)', height: '280px', position: 'relative', overflow: 'hidden', padding: '2rem' }}>
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: '-20px', left: '10%', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
        
        <header className="space-between container" style={{ position: 'relative', zIndex: 10 }}>
           <button onClick={() => navigate('/')} className="glass centered" style={{ width: '45px', height: '45px', borderRadius: '50%', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
              <ArrowLeft size={20} />
           </button>
           <h2 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 600 }}>Course Details</h2>
           <div style={{ width: '45px' }} />
        </header>

        <div className="container" style={{ marginTop: '2rem', position: 'relative', zIndex: 10 }}>
           <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 600, border: '1px solid rgba(255,255,255,0.2)' }}>
             {course.subject?.name} • {course.grade?.name}
           </span>
           <h1 style={{ color: 'white', fontSize: '2.5rem', marginTop: '1rem', letterSpacing: '-1px' }}>{course.title}</h1>
        </div>
      </div>

      <div className="container" style={{ marginTop: '-40px', position: 'relative', zIndex: 20 }}>
         <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
            
            {/* Left Column: Overview & Units */}
            <div>
               {/* Stats Bar */}
               <div className="glass-card" style={{ padding: '1.5rem 2rem', display: 'flex', gap: '3rem', marginBottom: '2.5rem', background: 'white' }}>
                  <div className="flexCenteredV" style={{ gap: '0.75rem' }}>
                     <div style={{ padding: '0.75rem', background: 'rgba(79, 70, 229, 0.05)', borderRadius: '1rem' }}><BookOpen color="var(--primary)" size={20} /></div>
                     <div><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lessons</p><p style={{ fontWeight: 700, color: '#0f172a' }}>{course.lessons_count}</p></div>
                  </div>
                  <div className="flexCenteredV" style={{ gap: '0.75rem' }}>
                     <div style={{ padding: '0.75rem', background: 'rgba(79, 70, 229, 0.05)', borderRadius: '1rem' }}><Video color="var(--primary)" size={20} /></div>
                     <div><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Videos</p><p style={{ fontWeight: 700, color: '#0f172a' }}>{course.videos_count}</p></div>
                  </div>
                  <div className="flexCenteredV" style={{ gap: '0.75rem' }}>
                     <div style={{ padding: '0.75rem', background: 'rgba(79, 70, 229, 0.05)', borderRadius: '1rem' }}><Users color="var(--primary)" size={20} /></div>
                     <div><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Students</p><p style={{ fontWeight: 700, color: '#0f172a' }}>{course.enrollments_count}</p></div>
                  </div>
               </div>

               {/* Description */}
               <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '2.5rem', background: 'white' }}>
                  <h3 style={{ marginBottom: '1.25rem', color: '#0f172a' }}>About this Course</h3>
                  <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: '1.7' }}>{course.description}</p>
               </div>

               {/* Units List (Matching Flutter CourseDetailsModuleItem) */}
               <h3 style={{ marginBottom: '1.5rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '4px', height: '20px', background: 'var(--primary)', borderRadius: '2px' }} />
                  Curriculum Units
               </h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {course.units?.map((unit, idx) => (
                    <div 
                      key={unit.id} 
                      className="glass-card fade-in" 
                      style={{ 
                        padding: '1.25rem 1.5rem', 
                        background: 'white', 
                        cursor: isEnrolled ? 'pointer' : 'default',
                        transition: 'var(--transition)'
                      }}
                      onClick={() => isEnrolled ? navigate(`/unit/${unit.id}`) : null}
                    >
                       <div className="space-between">
                          <div className="flexCenteredV" style={{ gap: '1.25rem' }}>
                             <div className="centered" style={{ width: '54px', height: '54px', background: 'rgba(79, 70, 229, 0.08)', borderRadius: '1.25rem', color: 'var(--primary)' }}>
                                <FolderOpen size={24} />
                             </div>
                             <div>
                                <h4 style={{ fontSize: '1.1rem', color: '#0f172a', marginBottom: '0.25rem' }}>{unit.title}</h4>
                                <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{unit.contents_count || 0} Lessons</p>
                             </div>
                          </div>
                          {isEnrolled ? (
                             <div className="centered" style={{ width: '32px', height: '32px', background: '#f1f5f9', borderRadius: '0.75rem', color: 'var(--primary)' }}>
                                <ChevronRight size={18} />
                             </div>
                          ) : (
                             <Lock size={18} color="#cbd5e1" />
                          )}
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Right Column: Instructor & Pricing */}
            <div>
               <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem', background: 'white', position: 'sticky', top: '2rem' }}>
                  <h4 style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '1.25rem' }}>Academic Instructor</h4>
                  <div className="flex" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
                     <img src={course.teacher?.profile_image_url} style={{ width: '64px', height: '64px', borderRadius: '1rem', objectFit: 'cover' }} />
                     <div>
                        <h4 style={{ fontSize: '1.1rem', color: '#0f172a' }}>{course.teacher?.name}</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>{course.teacher?.main_subject} Master</p>
                     </div>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: '1.6', marginBottom: '1.5rem' }}>Expert educator focused on providing the best academic experience through interactive video and comprehensive exams.</p>
                  
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                     {!isEnrolled ? (
                        <>
                           <div className="space-between" style={{ marginBottom: '1.5rem' }}>
                              <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Full Course Fee</span>
                              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>${course.price}</span>
                           </div>
                           <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', height: '3.5rem', fontSize: '1.1rem' }}>Enroll Now</button>
                        </>
                     ) : (
                        <div className="centered" style={{ flexDirection: 'column', gap: '1rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '1rem', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                           <CheckCircle2 color="#10b981" size={32} />
                           <div style={{ textAlign: 'center' }}>
                              <h4 style={{ color: '#065f46' }}>Successfully Enrolled</h4>
                              <p style={{ fontSize: '0.8rem', color: '#059669' }}>Access expires: {new Date(course.enrollment?.expiry_date).toLocaleDateString()}</p>
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            </div>

         </div>
      </div>

      {/* Global CSS for white-theme overrides if any */}
      <style>{`
        body { background: #f8faff !important; color: #0f172a !important; }
        .glass-card { box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05) !important; border: 1px solid rgba(0,0,0,0.05) !important; }
      `}</style>
    </div>
  );
};

export default CourseDetails;
