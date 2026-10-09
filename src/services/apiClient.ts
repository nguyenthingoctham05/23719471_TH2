import axios from 'axios';
import { STUDENT } from '@constants/student';

export const apiClient = axios.create({
  baseURL: 'https://fakestoreapi.com',
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  config.headers['X-Student-Id'] = STUDENT.mssv;
  return config;
});
