import axios from 'axios';

const API_BASE_URL = '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mps_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unauthenticated
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const isLoginRequest = error.config?.url?.includes('/login');
    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem('mps_token');
      localStorage.removeItem('mps_user');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

export const authApi = {
  login: (data) => api.post('/student/login', { ...data, user_type: 'student' }),
  register: (data) => api.post('/auth/register', { ...data, user_type: 'student' }),
  getProfile: () => api.get('/student/profile'),
};

export const studentApi = {
  getCourses: (params) => api.get('/student/courses', { params }),
  getMyCourses: () => api.get('/student/my-courses'),
  getCourseDetails: (id) => api.get(`/student/courses/${id}`),
  getUnitDetails: (id) => api.get(`/student/units/${id}`),
  getLessonDetails: (id) => api.get(`/student/lessons/${id}`),
  getExamDetails: (id) => api.get(`/student/exam/${id}`),
  submitExam: (id, data) => api.post(`/student/exam/${id}/submit`, data),
  getExamResult: (id) => api.get(`/student/exam/${id}/result`),
  getStandaloneExams: () => api.get('/student/standalone-exams'),
  getStandaloneExamDetails: (id) => api.get(`/student/standalone-exams/${id}`),
  submitStandaloneExam: (id, data) => api.post(`/student/standalone-exams/${id}/submit`, data),
  getStandaloneResults: () => api.get('/student/standalone-exams/results'),
  getFavorites: () => api.get('/student/favorites'),
  toggleFavorite: (lessonId) => api.post(`/student/favorites/toggle?lessonId=${lessonId}`),
  getCourseLeaderboard: (courseId) => api.get(`/student/courses/${courseId}/leaderboard`),
};


export const homeApi = {
  getStudentHome: () => api.get('/student/home'),
  getSubjects: () => api.get('/student/subjects'),
};

export default api;
