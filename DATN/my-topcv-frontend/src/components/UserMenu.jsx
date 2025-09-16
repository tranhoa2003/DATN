// src/components/UserMenu.jsx
import { useState, useContext, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import {
  Bookmark,
  FileText,
  Briefcase,
  Bell,
  Settings,
  Star,
  LogOut,
} from "lucide-react";
import "../styles/UserMenu.css";

export default function UserMenu() {
  const { currentUser, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!currentUser) return null;

  return (
    <div className="user-menu" ref={menuRef}>
      {/* Avatar */}
      <div className="user-avatar" onClick={() => setOpen(!open)}>
        <img
          src={currentUser.avatar || "https://static.topcv.vn/avatars/HA6uSV983q4ke2e6SA6W_67af29ac862a3_cvtpl.jpg"}
          alt="avatar"
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="menu-dropdown">
          <div className="menu-header">
            <img
              src={currentUser.avatar || "/default-avatar.png"}
              alt="avatar"
              className="menu-avatar"
            />
            <div>
              <strong>{currentUser.name}</strong>
              <p className="menu-email">{currentUser.email}</p>
              <p className="menu-id">ID: {currentUser._id}</p>
            </div>
          </div>

          {/* Quản lý tìm việc */}
          <div className="menu-section">
            <p className="menu-title">Quản lý tìm việc</p>
            <NavLink to="/saved-jobs">
              <Bookmark size={16} /> Việc làm đã lưu
            </NavLink>
            <NavLink to="/applied-jobs">
              <Briefcase size={16} /> Việc làm đã ứng tuyển
            </NavLink>
            <NavLink to="/recommended-jobs">
              <Star size={16} /> Việc làm phù hợp
            </NavLink>
          </div>

          {/* Quản lý CV */}
          <div className="menu-section">
            <p className="menu-title">Quản lý CV & Cover letter</p>
            <NavLink to="/cvs">
              <FileText size={16} /> CV của tôi
            </NavLink>
            <NavLink to="/cover-letters">
              <FileText size={16} /> Cover Letter của tôi
            </NavLink>
          </div>

          {/* Cài đặt */}
          <div className="menu-section">
            <p className="menu-title">Cài đặt</p>
            <NavLink to="/settings/email">
              <Bell size={16} /> Cài đặt email & thông báo
            </NavLink>
            <NavLink to="/settings/security">
              <Settings size={16} /> Cá nhân & Bảo mật
            </NavLink>
          </div>

          {/* Nâng cấp */}
          <div className="menu-section">
            <NavLink to="/upgrade">
              <Star size={16} /> ✨ Nâng cấp tài khoản
            </NavLink>
          </div>

          {/* Đăng xuất */}
          <div className="menu-section">
            <button onClick={logout} className="logout-btn">
              <LogOut size={16} /> Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
