import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance, { registerLogoutCallback } from '../api/axiosInstance';

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Đăng ký callback logout cho axios interceptor
    registerLogoutCallback(() => {
      logout();
    });

    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }

      try {
        const response = await axiosInstance.get('/auth/me');
        setCurrentUser(response.data);
      } catch (error) {
        setCurrentUser(null);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signup = async (data) => {
    await axiosInstance.post('/auth/register', data);
    // Không setCurrentUser vì cần xác thực OTP trước
  };

  const verifyOtp = async (data) => {
    const response = await axiosInstance.post('/auth/verify-otp', data);
    return response.data;
  };

  const login = async (data) => {
    const response = await axiosInstance.post('/auth/login', data);
    const token = response.data.token;
    localStorage.setItem('token', token);
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const userInfo = await axiosInstance.get('/auth/me');
    setCurrentUser(userInfo.data);

    navigate('/'); // Điều hướng sau khi login thành công
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axiosInstance.defaults.headers.common['Authorization'];
    setCurrentUser(null);
    navigate('/login'); // Điều hướng sau khi logout
  };

  const value = {
    currentUser,
    loading,
    signup,
    verifyOtp,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
