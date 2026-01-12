import axios, { AxiosInstance } from 'axios';
import defaultConfig from '@assets/config/default';

const api: AxiosInstance = axios.create({
  baseURL: defaultConfig.baseURL,
  headers: {
    'controlAccess': import.meta.env.VITE_CONTROL_ACCESS,
    'Content-Type': 'application/json',
  },
});

export default api;