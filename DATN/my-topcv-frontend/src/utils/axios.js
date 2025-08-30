// src/utils/axios.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Thêm interceptor để tự động thêm token nếu có
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // hoặc từ Redux/Context
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
