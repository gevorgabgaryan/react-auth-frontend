import axios from 'axios';
import { logout } from '../features/auth/authSlice';
import { SERVER_URL } from '../utils/constants';

const axiosInstance = axios.create({
  baseURL: SERVER_URL,
});

const getToken = () => {
  return localStorage.getItem('token');
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      logout();
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
