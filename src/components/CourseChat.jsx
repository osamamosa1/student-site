import { useEffect, useRef, useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import { studentApi } from '../api';

const initials = (name) => {
  if (!name) return '?';
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const ChatBubble = ({ message, youLabel = 'You' }) => {
  const isMine = message.is_mine;
  const isTeacher = message.sender_role === 'teacher';
  const senderName = message.sender_name || '';
  const displayName = isMine ? youLabel : senderName;

  let bubbleStyle;
  let nameColor;
  let avatarBg;

  if (isMine) {
    bubbleStyle = {
      background: 'linear-gradient(135deg, #4f46e5, #4338ca)',
      color: 'white',
      border: 'none',
    };
    nameColor = '#64748b';
    avatarBg = 'rgba(79, 70, 229, 0.15)';
  } else if (isTeacher) {
    bubbleStyle = {
      background: '#eef2ff',
      color: '#0f172a',
      border: '1px solid #c7d2fe',
    };
    nameColor = '#4f46e5';
    avatarBg = '#e0e7ff';
  } else {
    bubbleStyle = {
      background: '#f8fafc',
      color: '#0f172a',
      border: '1px solid #e2e8f0',
    };
    nameColor = '#64748b';
    avatarBg = '#e2e8f0';
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isMine ? 'flex-end' : 'flex-start',
        alignItems: 'flex-end',
        gap: '0.5rem',
        marginBottom: '0.875rem',
      }}
    >
      {!isMine && (
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: avatarBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.65rem',
            fontWeight: 800,
            color: isTeacher ? '#4f46e5' : '#64748b',
            flexShrink: 0,
          }}
        >
          {initials(senderName)}
        </div>
      )}

      <div style={{ maxWidth: '78%', display: 'flex', flexDirection: 'column', alignItems: isMine ? 'flex-end' : 'flex-start' }}>
        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: nameColor, marginBottom: 4, paddingInline: 4 }}>
          {displayName}
        </span>
        <div
          style={{
            padding: '0.65rem 0.9rem',
            borderRadius: isMine ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            ...bubbleStyle,
          }}
        >
          <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.45, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {message.message}
          </p>
        </div>
      </div>

      {isMine && (
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: avatarBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.65rem',
            fontWeight: 800,
            color: '#4f46e5',
            flexShrink: 0,
          }}
        >
          {initials(displayName)}
        </div>
      )}
    </div>
  );
};

const CourseChat = ({ courseId, fullPage = false, courseTitle = '' }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const lastIdRef = useRef(0);
  const bottomRef = useRef(null);

  const loadMessages = async (initial = false) => {
    try {
      const after = lastIdRef.current > 0 ? `?after_id=${lastIdRef.current}` : '';
      const res = await studentApi.getCourseMessages(courseId, after);
      const list = res.data || [];
      if (list.length > 0) {
        setMessages((prev) => (lastIdRef.current === 0 ? list : [...prev, ...list]));
        lastIdRef.current = list[list.length - 1].id;
      } else if (initial) {
        setMessages([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (initial) setLoading(false);
    }
  };

  useEffect(() => {
    lastIdRef.current = 0;
    setMessages([]);
    setLoading(true);
    loadMessages(true);
    const interval = setInterval(() => loadMessages(false), 5000);
    return () => clearInterval(interval);
  }, [courseId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      const res = await studentApi.sendCourseMessage(courseId, text.trim());
      const msg = res.data;
      setText('');
      setMessages((prev) => [...prev, msg]);
      lastIdRef.current = msg.id;
    } catch (err) {
      alert(err?.message || 'Failed to send');
    } finally {
      setSending(false);
    }
  };

  const containerStyle = fullPage
    ? { display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', background: '#f1f5f9' }
    : { display: 'flex', flexDirection: 'column', height: '480px', border: '1px solid #e2e8f0', borderRadius: '1rem', overflow: 'hidden', background: '#f1f5f9' };

  if (loading) {
    return (
      <div className="centered" style={{ padding: fullPage ? '4rem' : '3rem', flex: 1 }}>
        <Loader2 className="animate-spin" color="#4f46e5" />
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {fullPage && courseTitle && (
        <div style={{ padding: '0.75rem 1rem', background: 'white', borderBottom: '1px solid #e2e8f0', fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>
          {courseTitle}
        </div>
      )}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>💬</div>
            <p style={{ fontWeight: 600 }}>No messages yet</p>
            <p style={{ fontSize: '0.85rem', marginTop: 4 }}>Start the conversation with your instructor</p>
          </div>
        ) : (
          messages.map((m) => <ChatBubble key={m.id} message={m} />)
        )}
        <div ref={bottomRef} />
      </div>
      <form
        onSubmit={handleSend}
        style={{
          display: 'flex',
          gap: '0.5rem',
          padding: '0.875rem 1rem',
          borderTop: '1px solid #e2e8f0',
          background: 'white',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.04)',
        }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            borderRadius: '999px',
            border: '1px solid #e2e8f0',
            background: '#f8fafc',
            outline: 'none',
            fontSize: '0.9rem',
          }}
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            border: 'none',
            background: sending || !text.trim() ? '#cbd5e1' : 'linear-gradient(135deg, #4f46e5, #4338ca)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: sending || !text.trim() ? 'not-allowed' : 'pointer',
            flexShrink: 0,
          }}
        >
          {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
      </form>
    </div>
  );
};

export default CourseChat;
