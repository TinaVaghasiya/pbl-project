import axios from 'axios';

const API_BASE_URL = 'http://localhost:5002/api';
const PYTHON_API_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const pythonApi = axios.create({
  baseURL: PYTHON_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Learning API
export const getAllSigns = (params) => api.get('/learn', { params });
export const getSignById = (id) => api.get(`/learn/${id}`);
export const createSign = (data) => api.post('/learn', data);

// Text to Sign API
export const convertTextToSign = (text) => api.post('/text-to-sign', { text });

// Sign to Text API
export const processDetectedSign = (data) => api.post('/sign-to-text', data);
export const getGestureHistory = () => api.get('/sign-to-text/history');

// Python AI API
export const detectSign = (imageData) => pythonApi.post('/detect-sign', { image: imageData });
export const processVideoFrame = (frameData) => pythonApi.post('/process-video', { frame: frameData });

export default api;
