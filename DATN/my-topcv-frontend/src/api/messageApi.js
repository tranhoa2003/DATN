import axiosInstance from '../api/axiosInstance';

export const fetchConversations = async () => {
  const res = await axiosInstance.get('/conversations');
  return res.data;
};

export const findOrCreateConversation = async (otherUserId) => {
  const res = await axiosInstance.get(`/conversations/find/${otherUserId}`);
  return res.data;
};

export const fetchMessages = async (conversationId) => {
  const res = await axiosInstance.get(`/messages/${conversationId}`);
  return res.data;
};

export const postMessage = async (payload) => {
  const res = await axiosInstance.post('/messages', payload);
  return res.data;
};