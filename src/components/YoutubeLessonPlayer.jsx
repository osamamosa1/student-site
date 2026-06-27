import React, { useEffect, useRef, useState } from 'react';
import { Maximize, Minimize } from 'lucide-react';
import { studentApi } from '../api';

let ytApiPromise = null;

function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve();
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    if (!document.getElementById('youtube-iframe-api')) {
      const tag = document.createElement('script');
      tag.id = 'youtube-iframe-api';
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }
  });
  return ytApiPromise;
}

const extractVideoId = (content) => {
  if (!content) return null;
  return (
    content.split('v=')[1]?.split('&')[0] ||
    content.split('youtu.be/')[1]?.split('?')[0] ||
    content.split('embed/')[1]?.split('?')[0] ||
    null
  );
};

const WatermarkOverlay = () => {
  const [position, setPosition] = useState({ top: '20%', left: '20%' });
  const user = JSON.parse(localStorage.getItem('mps_user') || '{}');
  const userName = user.name || user.Name || 'Student';
  const userEmail = user.email || '';

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition({
        top: `${Math.floor(Math.random() * 60) + 20}%`,
        left: `${Math.floor(Math.random() * 60) + 15}%`,
      });
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
        overflow: 'hidden',
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
          fontFamily: 'sans-serif',
        }}
      >
        {userName} {userEmail ? `(${userEmail})` : ''}
      </div>
    </div>
  );
};

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2];

const YoutubeLessonPlayer = ({ lesson, courseId }) => {
  const videoContainerRef = useRef(null);
  const playerRef = useRef(null);
  const pointsAwardedRef = useRef(false);
  const progressTimerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(2);
  const videoId = extractVideoId(lesson.content);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (!videoId) return undefined;
    let destroyed = false;

    const init = async () => {
      await loadYouTubeApi();
      if (destroyed || !document.getElementById('yt-lesson-player')) return;

      const player = new window.YT.Player('yt-lesson-player', {
        videoId,
        playerVars: {
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          color: 'white',
          controls: 1,
          disablekb: 1,
          showinfo: 0,
          fs: 0,
          playsinline: 1,
        },
        events: {
          onReady: () => {
            progressTimerRef.current = setInterval(() => {
              if (!playerRef.current || pointsAwardedRef.current) return;
              try {
                const duration = playerRef.current.getDuration();
                const position = playerRef.current.getCurrentTime();
                if (duration > 0 && position >= duration / 2) {
                  pointsAwardedRef.current = true;
                  studentApi
                    .awardVideoPoints(lesson.id, courseId)
                    .catch((err) => console.error('Video points error', err));
                }
              } catch (_) {
                /* player not ready */
              }
            }, 2000);
          },
        },
      });
      playerRef.current = player;
    };

    init();

    return () => {
      destroyed = true;
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      try {
        playerRef.current?.destroy?.();
      } catch (_) {
        /* ignore */
      }
      playerRef.current = null;
    };
  }, [videoId, lesson.id, courseId]);

  const toggleFullscreen = () => {
    const el = videoContainerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.() ||
        el.webkitRequestFullscreen?.() ||
        el.msRequestFullscreen?.();
    } else {
      document.exitFullscreen?.() ||
        document.webkitExitFullscreen?.() ||
        document.msExitFullscreen?.();
    }
  };

  const cycleSpeed = () => {
    const next = (speedIdx + 1) % SPEED_OPTIONS.length;
    setSpeedIdx(next);
    const rate = SPEED_OPTIONS[next];
    try {
      playerRef.current?.setPlaybackRate?.(rate);
    } catch (_) {
      /* ignore */
    }
  };

  if (!videoId) {
    return <div className="centered white">Invalid video URL</div>;
  }

  return (
    <div
      className="glass-card"
      style={{
        padding: 0,
        overflow: 'hidden',
        background: 'black',
        borderRadius: isFullscreen ? '0' : '1.5rem',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
      }}
    >
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
          justifyContent: 'center',
        }}
      >
        <div
          id="yt-lesson-player"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        />

        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: 'clamp(60px, 15%, 100px)',
            background: 'rgba(0,0,0,0.01)',
            zIndex: 10,
            cursor: 'default',
            touchAction: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: 'clamp(60px, 15%, 100px)',
            background: 'rgba(0,0,0,0.01)',
            zIndex: 10,
            cursor: 'default',
            touchAction: 'none',
          }}
        />

        <WatermarkOverlay />

        <button
          type="button"
          onClick={cycleSpeed}
          style={{
            position: 'absolute',
            bottom: '15px',
            right: '68px',
            zIndex: 20,
            background: 'rgba(0,0,0,0.6)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '6px 10px',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '0.8rem',
          }}
          title="Playback speed"
        >
          {SPEED_OPTIONS[speedIdx]}x
        </button>

        <button
          type="button"
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
          }}
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </button>
      </div>
    </div>
  );
};

export default YoutubeLessonPlayer;
