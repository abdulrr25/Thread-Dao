import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const apiService = {
  // DAO endpoints
  getTrendingDaos: async () => {
    const response = await axiosInstance.get('/daos/trending');
    return response.data;
  },

  getRecentActivities: async () => {
    const response = await axiosInstance.get('/activities');
    return response.data;
  },

  getPosts: async () => {
    const response = await axiosInstance.get('/posts');
    return response.data;
  },

  // Auth endpoints
  login: async (walletAddress: string) => {
    const response = await axiosInstance.post('/auth/login', { walletAddress });
    return response.data;
  },

  // DAO management
  createDao: async (daoData: any) => {
    const response = await axiosInstance.post('/daos', daoData);
    return response.data;
  },

  getDao: async (daoId: string) => {
    const response = await axiosInstance.get(`/daos/${daoId}`);
    return response.data;
  },

  updateDao: async (daoId: string, daoData: any) => {
    const response = await axiosInstance.put(`/daos/${daoId}`, daoData);
    return response.data;
  },

  // Proposal management
  createProposal: async (daoId: string, proposalData: any) => {
    const response = await axiosInstance.post(`/daos/${daoId}/proposals`, proposalData);
    return response.data;
  },

  voteOnProposal: async (proposalId: string, voteData: any) => {
    const response = await axiosInstance.post(`/proposals/${proposalId}/vote`, voteData);
    return response.data;
  },

  getProposalVotes: async (proposalId: string) => {
    const response = await axiosInstance.get(`/proposals/${proposalId}/votes`);
    return response.data;
  }
};
