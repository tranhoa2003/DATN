// frontend/src/components/Home.jsx
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/Home.css';

function Home() {
    const navigate = useNavigate();
    const { currentUser, logout, loading } = useContext(AuthContext); // Thêm 'loading'

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Vô hiệu hóa logic tính tiến độ hồ sơ nếu người dùng chưa đăng nhập
    const [profileProgress, setProfileProgress] = useState(0);
    useEffect(() => {
        if (currentUser) {
            const calculateProgress = () => {
                let progress = 0;
                if (currentUser.profile?.name) progress += 20;
                if (currentUser.profile?.contactInfo) progress += 20;
                if (currentUser.profile?.experience?.length > 0) progress += 30;
                if (currentUser.profile?.education?.length > 0) progress += 30;
                return progress > 100 ? 100 : progress;
            };
            setProfileProgress(calculateProgress());
        }
    }, [currentUser]);

    // Nếu đang loading, hiển thị một trạng thái chờ
    if (loading) {
        return <div>Đang tải trang chủ...</div>;
    }

    // Hiển thị giao diện tùy thuộc vào trạng thái đăng nhập
    return (
        <div className="home-container">
            <header className="home-header">
                <h1>{currentUser ? `Chào mừng, ${currentUser.name}!` : 'Chào mừng đến với MyRecruit!'}</h1>
                <p className="subtitle">
                    Khám phá những cơ hội mới và xây dựng sự nghiệp thành công.
                </p>
            </header>

            {currentUser ? (
                // Nội dung cho người dùng đã đăng nhập
                <section className="dashboard-grid">
                    <div className="card profile-progress-card">
                        <div className="progress-circle-container">
                            <div className="progress-circle" style={{ background: `conic-gradient(#0a66c2 ${profileProgress * 3.6}deg, #e6e6e6 ${profileProgress * 3.6}deg)` }}>
                                <span className="progress-text">{profileProgress}%</span>
                            </div>
                        </div>
                        <h3>Hoàn thành hồ sơ</h3>
                        <p>Hồ sơ càng đầy đủ, cơ hội càng cao!</p>
                        <Link to="/profile" className="action-link">Cập nhật ngay <i className="fas fa-arrow-right"></i></Link>
                    </div>

                    <div className="card recommended-jobs-card">
                        <h3>Việc làm dành cho bạn</h3>
                        <ul>
                            <li><Link to="/jobs/1" className="job-link">Lập trình viên ReactJS (Hà Nội)</Link></li>
                            <li><Link to="/jobs/2" className="job-link">Chuyên viên Marketing (TP.HCM)</Link></li>
                        </ul>
                        <Link to="/jobs" className="action-link view-all">Xem tất cả <i className="fas fa-arrow-right"></i></Link>
                    </div>

                    <div className="card news-card">
                        <h3>Tin tức thị trường</h3>
                        <ul>
                            <li><a href="#" className="news-link">5 xu hướng công nghệ 2025 bạn cần biết</a></li>
                            <li><a href="#" className="news-link">Kỹ năng mềm giúp bạn phỏng vấn thành công</a></li>
                        </ul>
                        <a href="#" className="action-link view-all">Xem thêm <i className="fas fa-arrow-right"></i></a>
                    </div>
                </section>
            ) : (
                // Nội dung cho người dùng chưa đăng nhập
                <section className="call-to-action-section">
                    <div className="cta-card">
                        <h2>Bạn chưa có tài khoản?</h2>
                        <p>Tham gia cộng đồng của chúng tôi để khám phá hàng ngàn cơ hội việc làm hấp dẫn!</p>
                        <Link to="/register" className="cta-button">Tạo tài khoản ngay</Link>
                    </div>
                    <div className="cta-card">
                        <h2>Tìm kiếm công việc</h2>
                        <p>Duyệt qua danh sách công việc mới nhất mà không cần đăng nhập.</p>
                        <Link to="/jobs" className="cta-button">Xem việc làm</Link>
                    </div>
                </section>
            )}

            {currentUser && (
                <footer className="home-footer">
                    <button onClick={handleLogout} className="logout-button">
                        Đăng xuất
                    </button>
                </footer>
            )}
        </div>
    );
}

export default Home;