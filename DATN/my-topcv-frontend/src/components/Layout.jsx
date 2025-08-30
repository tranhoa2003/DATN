// src/components/Layout.jsx
import { Link, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';
import ChatBox from './Chat/ChatBox'; // <-- thêm ChatBox
import '../styles/Layout.css'; // Đảm bảo file CSS này được sử dụng đúng

export default function Layout() {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      <header className="bg-white shadow-md py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">
            <Link to="/">MyRecruit</Link>
          </h1>

          <nav className="space-x-4 text-sm">
            {/* Always Visible */}
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">Trang chủ</Link>
            <Link to="/jobs" className="text-gray-700 hover:text-blue-600 transition-colors">Công việc</Link>

            {/* Not Logged In */}
            {!currentUser && (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 transition-colors">Đăng nhập</Link>
                <Link to="/register" className="text-gray-700 hover:text-blue-600 transition-colors">Đăng ký</Link>
              </>
            )}

            {/* Logged In */}
            {currentUser && (
              <>
                {/* Links for Applicant only */}
                {currentUser.role === 'applicant' && ( // 👈 Cụ thể chỉ cho "applicant"
                  <>
                    <Link to="/user-profile" className="text-gray-700 hover:text-blue-600 transition-colors">Hồ sơ</Link>
                    <Link to="/cvs" className="text-gray-700 hover:text-blue-600 transition-colors">CV của tôi</Link>
                    <Link to="/create-cv" className="text-gray-700 hover:text-blue-600 transition-colors">Tạo CV</Link>
                    <Link to="/my-applications" className="text-gray-700 hover:text-blue-600 transition-colors">Lịch sử ứng tuyển</Link>
                    <Link to="/chat" className="text-gray-700 hover:text-blue-600 transition-colors">Tin nhắn</Link> {/* 👈 Thêm dòng này */}
                  </>
                )}

                {/* Employer only */}
                {currentUser.role === 'employer' && (
                  <>
                    <Link to="/user-profile" className="text-gray-700 hover:text-blue-600 transition-colors">Hồ sơ</Link>
                    <Link to="/employer-profile" className="text-gray-700 hover:text-blue-600 transition-colors">Hồ sơ công ty</Link>
                    <Link to="/post-job" className="text-gray-700 hover:text-blue-600 transition-colors">Đăng tin tuyển dụng</Link>
                    <Link to="/manage-jobs" className="text-gray-700 hover:text-blue-600 transition-colors">Quản lý tin tuyển dụng</Link>
                    <Link to="/employer/manage-applications" className="text-gray-700 hover:text-blue-600 transition-colors">Quản lý ứng viên</Link>
                    
                  </>
                )}

                {/* Admin only */}
                {currentUser.role === 'admin' && (
                  <>
                    <Link to="/user-profile" className="text-gray-700 hover:text-blue-600 transition-colors">Hồ sơ</Link>
                    <Link to="/admin/users" className="text-gray-700 hover:text-blue-600 transition-colors">Quản lý người dùng</Link>
                    <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">Dashboard</Link>
                  </>
                )}
                {/* Bạn có thể thêm link logout ở đây, hoặc trong phần user-profile dropdown */}
                {/* Hoặc một liên kết "Hồ sơ" chung cho tất cả các vai trò đã đăng nhập nếu cần */}
                {/* <Link to="/profile" className="text-gray-700 hover:text-blue-600 transition-colors">Hồ sơ chung</Link> */}
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 flex-grow">
        <Outlet />
      </main>

      {/* Hiển thị ChatBox cho employer và applicant */}
      {currentUser && (currentUser.role === 'applicant' || currentUser.role === 'employer') && (
        <div className="fixed bottom-4 right-4 z-50">
          <ChatBox currentUserId={currentUser?._id} /> {/* Không truyền receiverId ở đây nữa */}
        </div>
      )}

      <footer className="bg-white text-center py-4 border-t text-sm text-gray-500">
        &copy; {new Date().getFullYear()} MyRecruit. All rights reserved.
      </footer>
    </div>
  );
}