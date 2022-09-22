import axios from 'axios';
import { getAuthToken } from '../util/auth';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://server.rank-me.live',
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      sessionStorage.removeItem('rankme-auth');
      document.location.href = '/auth/login';
    }

    return Promise.reject(error);
  }
);

export { api };
