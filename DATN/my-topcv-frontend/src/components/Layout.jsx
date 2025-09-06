// src/components/Layout.jsx
import { NavLink, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';
import ChatBox from './Chat/ChatBox';
import '../styles/Layout.css';

export default function Layout() {
  const { currentUser } = useContext(AuthContext);

  // Class chung cho NavLink
  const navLinkClass = ({ isActive }) =>
    `text-gray-700 hover:text-blue-600 transition-colors ${
      isActive ? 'active' : ''
    }`;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      <header className="bg-white shadow-md py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
          <h1 className="text-2xl font-bold text-blue-600">
            <NavLink to="/" className={navLinkClass}>
              MyRecruit
            </NavLink>
          </h1>

          {/* Navbar */}
          <nav className="space-x-4 text-sm">
            {/* Always Visible */}
            <NavLink to="/" className={navLinkClass}>
              Trang chủ
            </NavLink>
            <NavLink to="/jobs" className={navLinkClass}>
              Công việc
            </NavLink>

            {/* Not Logged In */}
            {!currentUser && (
              <>
                <NavLink to="/login" className={navLinkClass}>
                  Đăng nhập
                </NavLink>
                <NavLink to="/register" className={navLinkClass}>
                  Đăng ký
                </NavLink>
              </>
            )}

            {/* Logged In */}
            {currentUser && (
              <>
                {/* Applicant only */}
                {currentUser.role === 'applicant' && (
                  <>
                    <NavLink to="/user-profile" className={navLinkClass}>
                      Hồ sơ
                    </NavLink>
                    <NavLink to="/cvs" className={navLinkClass}>
                      CV của tôi
                    </NavLink>
                    <NavLink to="/create-cv" className={navLinkClass}>
                      Tạo CV
                    </NavLink>
                    <NavLink to="/my-applications" className={navLinkClass}>
                      Lịch sử ứng tuyển
                    </NavLink>
                    <NavLink to="/chat" className={navLinkClass}>
                      Tin nhắn
                    </NavLink>
                  </>
                )}

                {/* Employer only */}
                {currentUser.role === 'employer' && (
                  <>
                    <NavLink to="/user-profile" className={navLinkClass}>
                      Hồ sơ
                    </NavLink>
                    <NavLink to="/employer-profile" className={navLinkClass}>
                      Hồ sơ công ty
                    </NavLink>
                    <NavLink to="/post-job" className={navLinkClass}>
                      Đăng tin tuyển dụng
                    </NavLink>
                    <NavLink to="/manage-jobs" className={navLinkClass}>
                      Quản lý tin tuyển dụng
                    </NavLink>
                    <NavLink
                      to="/employer/manage-applications"
                      className={navLinkClass}
                    >
                      Quản lý ứng viên
                    </NavLink>
                  </>
                )}

                {/* Admin only */}
                {currentUser.role === 'admin' && (
                  <>
                    <NavLink to="/user-profile" className={navLinkClass}>
                      Hồ sơ
                    </NavLink>
                    <NavLink to="/admin/users" className={navLinkClass}>
                      Quản lý người dùng
                    </NavLink>
                    <NavLink to="/dashboard" className={navLinkClass}>
                      Dashboard
                    </NavLink>
                  </>
                )}
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Nội dung */}
      <main className="container mx-auto px-4 py-6 flex-grow">
        <Outlet />
      </main>

      {/* ChatBox */}
      {currentUser &&
        (currentUser.role === 'applicant' ||
          currentUser.role === 'employer') && (
          <div className="fixed bottom-4 right-4 z-50">
            <ChatBox currentUserId={currentUser?._id} />
          </div>
        )}

      {/* Footer */}
      <footer className="bg-white text-center py-4 border-t text-sm text-gray-500">
        &copy; {new Date().getFullYear()} MyRecruit. All rights reserved.
      </footer>
    </div>
  );
}
