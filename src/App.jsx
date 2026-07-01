import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CourseDetails from './pages/CourseDetails';
import CoursePlayer from './pages/CoursePlayer';
import Exam from './pages/Exam';
import ExamResult from './pages/ExamResult';
import Profile from './pages/Profile';
import EnrolledCourses from './pages/EnrolledCourses';
import StandaloneExams from './pages/StandaloneExams';
import UnitContents from './pages/UnitContents';
import Settings from './pages/Settings';
import ExamResultsList from './pages/ExamResultsList';
import AllCourses from './pages/AllCourses';
import DeleteAccountSteps from './pages/DeleteAccountSteps';
import Favorites from './pages/Favorites';
import Leaderboard from './pages/Leaderboard';
import CourseChatPage from './pages/CourseChatPage';
import Competitions from './pages/Competitions';
import CompetitionMatch from './pages/CompetitionMatch';
import './index.css';

import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('mps_token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

const SecurityLayer = ({ children }) => {
  useEffect(() => {
    // 1. Disable Right-Click
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);

    // 2. Disable Keyboard Shortcuts (F12, Ctrl+Shift+I, etc)
    const handleKeyDown = (e) => {
      // Disable F12
      if (e.keyCode === 123) {
        e.preventDefault();
        return false;
      }
      // Disable Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
      if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
        e.preventDefault();
        return false;
      }
      // Disable Ctrl+U (View Source)
      if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
        return false;
      }
      // Disable Print Screen
      if (e.keyCode === 44) {
        alert("Screenshots are strictly prohibited on this platform for security reasons.");
        e.preventDefault();
        return false;
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    // 3. Privacy Blur on Focus Lost (Anti-Recording/Anti-Snapping)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.body.style.filter = 'blur(20px)';
      } else {
        document.body.style.filter = 'none';
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const user = JSON.parse(localStorage.getItem('mps_user') || '{}');
  const watermarkText = 'Mr Abdelrahman Shoker';

  return (
    <div className="security-wrapper select-none" style={{ position: 'relative', minHeight: '100vh' }}>
      {watermarkText && (
        <div 
          className="watermark" 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            pointerEvents: 'none', 
            zIndex: 9999, 
            opacity: 0.05, 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'space-around', 
            alignContent: 'space-around',
            overflow: 'hidden'
          }}
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} style={{ transform: 'rotate(-45deg)', fontSize: '1.5rem', fontWeight: 'bold', whiteSpace: 'nowrap', padding: '2rem' }}>
              {watermarkText}
            </div>
          ))}
        </div>
      )}
      {children}
    </div>
  );
};

function App() {
  return (
    <SecurityLayer>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/delete-account" element={<DeleteAccountSteps />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/course/:id" 
            element={
              <ProtectedRoute>
                <CourseDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/unit/:unitId" 
            element={
              <ProtectedRoute>
                <UnitContents />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/lesson/:lessonId" 
            element={
              <ProtectedRoute>
                <CoursePlayer />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/exam/:examId" 
            element={
              <ProtectedRoute>
                <Exam />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/exam-result/:examId" 
            element={
              <ProtectedRoute>
                <ExamResult />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-learning" 
            element={
              <ProtectedRoute>
                <EnrolledCourses />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/standalone-exams" 
            element={
              <ProtectedRoute>
                <StandaloneExams />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/favorites" 
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/exam-results-list" 
            element={
              <ProtectedRoute>
                <ExamResultsList />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <AllCourses />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/leaderboard/:courseId" 
            element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/course/:id/chat"
            element={
              <ProtectedRoute>
                <CourseChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/course/:id/competitions"
            element={
              <ProtectedRoute>
                <Competitions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/course/:id/competitions/match/:matchId"
            element={
              <ProtectedRoute>
                <CompetitionMatch />
              </ProtectedRoute>
            }
          />
          {/* Placeholder for future routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </SecurityLayer>
  );
}

export default App;
