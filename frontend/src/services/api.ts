import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const api = {
  // User Profile
  getUserProfile: async (address: string) => {
    const response = await axios.get(`${API_URL}/users/profile/${address}`);
    return response.data;
  },

  createUserProfile: async (data: {
    walletAddress: string;
    username: string;
    bio: string;
    avatar: string;
  }) => {
    const response = await axios.post(`${API_URL}/users/profile`, data);
    return response.data;
  },

  updateUserProfile: async (address: string, data: {
    username: string;
    bio: string;
    avatar: string;
  }) => {
    const response = await axios.put(`${API_URL}/users/profile/${address}`, data);
    return response.data;
  },

  // DAOs
  getUserDaos: async (address: string) => {
    const response = await axios.get(`${API_URL}/daos/user/${address}`);
    return response.data;
  },

  getDao: async (id: string) => {
    const response = await axios.get(`${API_URL}/daos/${id}`);
    return response.data;
  },

  createDao: async (data: {
    name: string;
    description: string;
    creatorAddress: string;
    tokenName: string;
    tokenSymbol: string;
  }) => {
    const response = await axios.post(`${API_URL}/daos`, data);
    return response.data;
  },

  updateDao: async (id: string, data: {
    name: string;
    description: string;
    tokenName: string;
    tokenSymbol: string;
  }) => {
    const response = await axios.put(`${API_URL}/daos/${id}`, data);
    return response.data;
  }
}; 