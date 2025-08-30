import axios from 'axios';

// ✅ Tự động nhận baseURL theo môi trường
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔐 Thêm token vào header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// === Tạo biến lưu callback logout ===
let logoutCallback = null;

// Hàm đăng ký callback logout từ bên ngoài (AuthContext)
export function registerLogoutCallback(cb) {
  logoutCallback = cb;
}

// ❌ Xử lý lỗi 401 và gọi callback logout
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('🔒 Token hết hạn hoặc không hợp lệ. Đăng xuất...');
      localStorage.removeItem('token');
      if (logoutCallback) {
        logoutCallback(); // Gọi callback logout để context xử lý điều hướng
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
