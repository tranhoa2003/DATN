import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import Home from './components/Home'; // Import component Home
import VerifyOTP from './components/Auth/VerifyOTP';
import AdminUserManagement from './components/Auth/AdminUserManagement';
import UserProfile from './components/UserProfile'; // Import UserProfile
import PrivateRoute from './components/PrivateRoute'; // Đảm bảo import PrivateRoute
import JobList from './components/JobList';
import JobDetail from './components/JobDetail'; // import JobDetail
import CVList from './components/CVList'; // Import CVList
import CVDetail from './components/CVDetail'; // Import CVDetail
import CVForm from './components/CVForm/CVForm'; // Đảm bảo import CVForm
import PostJobForm from './components/PostJobForm'; // Import PostJobForm
import ManageJobs from './components/ManageJobs'; // Import ManageJobs
import EmployerProfileForm from './components/EmployerProfileForm'; // Import EmployerProfileForm
// import { useAuth } from './contexts/AuthContext'; // Import AuthContext
import { useContext } from 'react';
import AuthContext from './contexts/AuthContext';
import MyApplications from './components/MyApplications';
import DashboardPage from './pages/DashboardPage';
import AdminUserList from './components/admin/AdminUserList'; // hoặc ./pages/admin nếu bạn để trong pages
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ManageApplications from './pages/employer/ManageApplications'; // Trang mới
import JobApplicants from './pages/employer/JobApplicants';     // Trang mới
import Layout from './components/Layout'; // thêm dòng này
import ApplicationDetails from './pages/employer/ApplicationDetails';
import { ChatProvider } from "./contexts/ChatContext"; // ✅ Thêm dòng này nếu bạn chưa có
import ApplicantChatPage from "./pages/applicant/ApplicantChatPage";


function App() {
  const [count, setCount] = useState(0);
  const { currentUser } = useContext(AuthContext);


  return (
    <>

      {/* Thêm Routes và Route ở đây */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      {/* Bọc toàn bộ Routes bằng ChatProvider */}
      <ChatProvider> {/* */}
        <Routes>
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="verify-otp" element={<VerifyOTP />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
           
            
            <Route path="jobs" element={<JobList />} />
            <Route path="jobs/:id" element={<JobDetail />} />

            {/* Protected routes */}
            <Route path="user-profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
            <Route path="cvs" element={<PrivateRoute><CVList /></PrivateRoute>} />
            <Route path="view-cv/:id" element={<PrivateRoute><CVDetail /></PrivateRoute>} />
            <Route path="create-cv" element={<PrivateRoute><CVForm /></PrivateRoute>} />
            <Route path="edit-cv/:id" element={<PrivateRoute><CVForm /></PrivateRoute>} />
            <Route path="post-job" element={<PrivateRoute><PostJobForm /></PrivateRoute>} />
            <Route path="edit-job/:id" element={<PrivateRoute><PostJobForm /></PrivateRoute>} />
            <Route path="manage-jobs" element={<PrivateRoute><ManageJobs /></PrivateRoute>} />
            <Route path="employer-profile" element={<PrivateRoute>{currentUser?.role === 'employer' ? <EmployerProfileForm /> : <div>Bạn không có quyền truy cập trang này.</div>}</PrivateRoute>} />
            <Route path="my-applications" element={<PrivateRoute><MyApplications /></PrivateRoute>} />
            <Route path="dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="admin/users" element={<PrivateRoute><AdminUserList /></PrivateRoute>} />
            <Route path="employer/manage-applications" element={<PrivateRoute><ManageApplications /></PrivateRoute>} />
            <Route path="employer/applications/:jobId" element={<PrivateRoute><JobApplicants /></PrivateRoute>} />
            <Route path="employer/application/:id" element={<PrivateRoute><ApplicationDetails /></PrivateRoute>} />
            <Route path="/chat" element={<ApplicantChatPage />} />
          </Route>
           
        </Routes>
      </ChatProvider>
    </>
  );
}

export default App;