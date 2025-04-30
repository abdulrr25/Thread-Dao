import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const api = {
  // DAO endpoints
  getTrendingDaos: async () => {
    const response = await axios.get(`${API_URL}/daos/trending`);
    return response.data;
  },

  getRecentActivities: async () => {
    const response = await axios.get(`${API_URL}/activities`);
    return response.data;
  },

  getPosts: async () => {
    const response = await axios.get(`${API_URL}/posts`);
    return response.data;
  },

  // Auth endpoints
  login: async (walletAddress: string) => {
    const response = await axios.post(`${API_URL}/auth/login`, { walletAddress });
    return response.data;
  },

  // DAO management
  createDao: async (daoData: any) => {
    const response = await axios.post(`${API_URL}/daos`, daoData);
    return response.data;
  },

  getDao: async (daoId: string) => {
    const response = await axios.get(`${API_URL}/daos/${daoId}`);
    return response.data;
  },

  updateDao: async (daoId: string, daoData: any) => {
    const response = await axios.put(`${API_URL}/daos/${daoId}`, daoData);
    return response.data;
  },

  // Proposal management
  createProposal: async (daoId: string, proposalData: any) => {
    const response = await axios.post(`${API_URL}/daos/${daoId}/proposals`, proposalData);
    return response.data;
  },

  voteOnProposal: async (proposalId: string, voteData: any) => {
    const response = await axios.post(`${API_URL}/proposals/${proposalId}/vote`, voteData);
    return response.data;
  },

  getProposalVotes: async (proposalId: string) => {
    const response = await axios.get(`${API_URL}/proposals/${proposalId}/votes`);
    return response.data;
  }
};
