import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import CourseChat from '../components/CourseChat';
import { studentApi } from '../api';
import { useEffect, useState } from 'react';

const CourseChatPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [courseTitle, setCourseTitle] = useState('');

  useEffect(() => {
    studentApi.getCourseDetails(id).then((res) => {
      setCourseTitle(res.data?.title || 'Course Chat');
    }).catch(() => {});
  }, [id]);

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9' }}>
      <div
        style={{
          background: 'linear-gradient(135deg, #4f46e5, #4338ca)',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <button
          onClick={() => navigate(`/course/${id}`)}
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.25)',
            background: 'rgba(255,255,255,0.12)',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ArrowLeft size={20} />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'white' }}>
            <MessageCircle size={18} />
            <h1 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Course Chat</h1>
          </div>
          {courseTitle && (
            <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'rgba(255,255,255,0.75)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {courseTitle}
            </p>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', background: 'white', minHeight: 'calc(100vh - 72px)' }}>
        <CourseChat courseId={parseInt(id, 10)} fullPage courseTitle={courseTitle} />
      </div>
    </div>
  );
};

export default CourseChatPage;
