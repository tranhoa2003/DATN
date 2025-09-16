// src/components/Layout.jsx
import { NavLink, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';
import ChatBox from './Chat/ChatBox';
import '../styles/Layout.css';
import logo from "../styles/logo.png"; // ✅ import logo
import UserMenu from "./UserMenu";

export default function Layout() {
  const { currentUser } = useContext(AuthContext);

  // Class chung cho NavLink
  const navLinkClass = ({ isActive }) =>
    `nav-link transition-colors ${isActive ? 'active' : ''}`; // Sử dụng class 'nav-link' và 'active'

  return (
    <div className="app-container"> {/* Sử dụng class chung */}
      <header className="app-header">
        <div className="header-content"> {/* Sử dụng class chung */}
          <div className='nav-left'>
                      {/* Logo */}
          <div className="brand flex items-center gap-2">
            <img src={logo} alt="MyRecruit Logo" className="logo-img" /> {/* Sử dụng class chung */}
            <span className="brand-text">
              <NavLink to="/" className={navLinkClass}>
                MyRecruit
              </NavLink>
            </span>
          </div>

          {/* Navbar */}
          <nav className="main-nav"> {/* Sử dụng class chung */}
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
          <div className='nav-right'>
             {currentUser && <UserMenu />}
          </div>
        </div>
      </header>

      {/* Nội dung */}
      <main className="main-content"> {/* Sử dụng class chung */}
        <Outlet />
      </main>

      {/* ChatBox */}
      {currentUser &&
        (currentUser.role === 'applicant' ||
          currentUser.role === 'employer') && (
          <div className="chat-box-wrapper"> {/* Sử dụng class chung */}
            <ChatBox currentUserId={currentUser?._id} />
          </div>
        )}

      {/* Footer */}
      <footer className="app-footer"> {/* Sử dụng class chung */}
        &copy; {new Date().getFullYear()} MyRecruit. All rights reserved.
      </footer>
    </div>
  );
}