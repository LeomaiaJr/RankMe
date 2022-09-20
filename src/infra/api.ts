import axios from 'axios';
import { getAuthToken } from '../util/auth';

const api = axios.create({
  baseURL: 'http://144.22.234.28:8000',
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
