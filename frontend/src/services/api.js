import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

export const registerUser = async (name, email, password) => {
  const response = await api.post('/auth/register', { name, email, password });
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('user');
};

export const getMembers = async (page = 1, limit = 10, sort = 'createdAt', order = 'desc') => {
  const response = await api.get(`/members?page=${page}&limit=${limit}&sort=${sort}&order=${order}`);
  return response.data;
};

export const searchMembers = async (phone) => {
  const response = await api.get(`/members/search?phone=${phone}`);
  return response.data;
};

export const getMember = async (id) => {
  const response = await api.get(`/members/${id}`);
  return response.data;
};

export const getMemberTransactions = async (id) => {
  const response = await api.get(`/members/${id}/transactions`);
  return response.data;
};

export const recordPurchase = async (memberId, amount) => {
  const response = await api.post('/purchases', { memberId, amount });
  return response.data;
};

export const getRewards = async () => {
  const response = await api.get('/rewards');
  return response.data;
};

export const redeemReward = async (memberId, rewardId) => {
  const response = await api.post('/redemptions', { memberId, rewardId });
  return response.data;
};

export default api;
