// frontend/src/pages/employer/JobApplicants.jsx
import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { ChatContext } from "../../contexts/ChatContext";
import ApplicantChatBox from '../../components/Chat/ApplicantChatBox'; // ✅ THÊM DÒNG NÀY

function JobApplicants() {
    const { jobId } = useParams();
    const [job, setJob] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingStatus, setUpdatingStatus] = useState(null);
    const { currentUser } = useAuth();
    const { setReceiverId, setIsChatBoxOpen, setReceiverName, findOrCreateConversation, conversationId, receiverId, receiverName, isChatBoxOpen } = useContext(ChatContext); // ✅ THÊM state chat context

    const applicationStatuses = ['pending', 'viewed', 'interviewed', 'rejected'];

    const getStatusDisplayName = (status) => {
        switch (status) {
            case 'pending': return 'Chờ duyệt';
            case 'viewed': return 'Đã xem';
            case 'interviewed': return 'Đã phỏng vấn';
            case 'rejected': return 'Đã từ chối';
            default: return status;
        }
    };

    useEffect(() => {
        const fetchJobAndApplicants = async () => {
            if (!currentUser || currentUser.role !== 'employer') {
                setError('Bạn không có quyền truy cập trang này.');
                setLoading(false);
                return;
            }

            setLoading(true);
            setError('');
            try {
                const jobResponse = await axiosInstance.get(`/jobs/${jobId}`);
                setJob(jobResponse.data);

                const applicantsResponse = await axiosInstance.get(`/applications/jobs/${jobId}`);
                setApplicants(applicantsResponse.data);
            } catch (err) {
                console.error('Lỗi khi tải danh sách ứng viên:', err);
                setError('Không thể tải danh sách ứng viên hoặc thông tin công việc.');
                toast.error('Lỗi tải dữ liệu ứng viên.');
            } finally {
                setLoading(false);
            }
        };

        fetchJobAndApplicants();
    }, [jobId, currentUser]);

    const handleStatusChange = async (applicationId, newStatus) => {
        setUpdatingStatus(applicationId);
        try {
            const response = await axiosInstance.put(`/applications/${applicationId}/status`, { status: newStatus });
            toast.success('Cập nhật trạng thái thành công!');
            setApplicants((prevApplicants) =>
                prevApplicants.map((app) =>
                    app._id === applicationId ? { ...app, status: newStatus } : app
                )
            );
        } catch (err) {
            console.error('Lỗi khi cập nhật trạng thái:', err);
            toast.error(err.response?.data?.message || 'Không thể cập nhật trạng thái.');
        } finally {
            setUpdatingStatus(null);
        }
    };

    const handleChatClick = async (applicantId, applicantName) => {
        setReceiverId(applicantId);
        setReceiverName(applicantName);
        if (currentUser && currentUser._id && applicantId) {
            const convId = await findOrCreateConversation(applicantId);
            if (convId) {
                setIsChatBoxOpen(true);
            } else {
                toast.error('Không thể mở chat. Vui lòng thử lại.');
            }
        }
    };

    if (loading) {
        return <div className="text-center py-8 text-gray-600">Đang tải danh sách ứng viên...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500 text-lg">{error}</div>;
    }

    if (!job) {
        return <div className="text-center py-8 text-gray-600">Không tìm thấy thông tin công việc.</div>;
    }

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg my-8">
            <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">
                Ứng viên cho công việc: <span className="text-blue-600">"{job.title}"</span>
            </h2>
            <p className="text-center text-gray-600 mb-6">Tổng số đơn: {applicants.length}</p>

            {applicants.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                    Chưa có ứng viên nào nộp đơn cho công việc này.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Ứng viên</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Email</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Thư ứng tuyển</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">CV</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Ngày ứng tuyển</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Trạng thái</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applicants.map((applicant) => (
                                <tr key={applicant._id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                                    <td className="py-3 px-4 border-b border-gray-200 text-gray-800 font-medium">
                                        {applicant.applicantName || 'N/A'}
                                    </td>
                                    <td className="py-3 px-4 border-b border-gray-200 text-gray-600">
                                        {applicant.applicantEmail || 'N/A'}
                                    </td>
                                    <td className="py-3 px-4 border-b border-gray-200 text-gray-600 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                                        {applicant.coverLetter ? (
                                            <span title={applicant.coverLetter}>
                                                {applicant.coverLetter.substring(0, 50)}...
                                            </span>
                                        ) : (
                                            'Không có'
                                        )}
                                    </td>
                                    <td className="py-3 px-4 border-b border-gray-200">
                                        {applicant.cvLink ? (
                                            applicant.cvLink.startsWith('/view-cv/') ? (
                                                <Link
                                                    to={applicant.cvLink}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {applicant.cvInfo}
                                                </Link>
                                            ) : (
                                                <a
                                                    href={applicant.cvLink.startsWith('http') ? applicant.cvLink : `http://localhost:5000/${applicant.cvLink}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {applicant.cvInfo}
                                                </a>
                                            )
                                        ) : (
                                            'Không có CV'
                                        )}
                                    </td>
                                    <td className="py-3 px-4 border-b border-gray-200 text-gray-600">
                                        {applicant.appliedDate
                                            ? new Date(applicant.appliedDate).toLocaleDateString('vi-VN')
                                            : 'Không rõ'}
                                    </td>
                                    <td className="py-3 px-4 border-b border-gray-200">
                                        <span
                                            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold
                                                ${applicant.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                                                ${applicant.status === 'viewed' ? 'bg-blue-100 text-blue-800' : ''}
                                                ${applicant.status === 'interviewed' ? 'bg-green-100 text-green-800' : ''}
                                                ${applicant.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                                            `}
                                        >
                                            {getStatusDisplayName(applicant.status)}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 border-b border-gray-200">
                                        <div className="flex flex-col gap-2">
                                            <select
                                                className="border border-gray-300 rounded-md py-1 px-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                                                value={applicant.status}
                                                onChange={(e) => handleStatusChange(applicant._id, e.target.value)}
                                                disabled={updatingStatus === applicant._id || !currentUser || currentUser.role !== 'employer'}
                                            >
                                                {applicationStatuses.map((status) => (
                                                    <option key={status} value={status}>
                                                        {getStatusDisplayName(status)}
                                                    </option>
                                                ))}
                                            </select>
                                            {updatingStatus === applicant._id && (
                                                <span className="ml-2 text-blue-500 text-xs">Đang cập nhật...</span>
                                            )}
                                            <button
                                                onClick={() => handleChatClick(applicant.applicantId, applicant.applicantName)}
                                                className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-700 transition duration-300"
                                            >
                                                Chat
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            
            {/* ✅ THÊM PHẦN HIỂN THỊ CHATBOX */}
            {isChatBoxOpen && conversationId && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-end items-end p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md h-full max-h-[80vh] flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-lg font-bold">Trò chuyện với: {receiverName}</h3>
                            <button onClick={() => setIsChatBoxOpen(false)} className="text-gray-500 hover:text-gray-800">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto p-4">
                            <ApplicantChatBox conversationId={conversationId} employerId={receiverId} />
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default JobApplicants;