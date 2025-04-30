import { apiClient } from '@/lib/api';
import type { Dao, Proposal, Vote, Member } from '@/types';

export const daoService = {
  // DAO Management
  async createDao(data: Partial<Dao>): Promise<Dao> {
    const response = await apiClient.post<Dao>('/daos', data);
    return response.data;
  },

  async getDao(id: string): Promise<Dao> {
    const response = await apiClient.get<Dao>(`/daos/${id}`);
    return response.data;
  },

  async updateDao(id: string, data: Partial<Dao>): Promise<Dao> {
    const response = await apiClient.patch<Dao>(`/daos/${id}`, data);
    return response.data;
  },

  async deleteDao(id: string): Promise<void> {
    await apiClient.delete(`/daos/${id}`);
  },

  async listDaos(params?: { page?: number; limit?: number; search?: string }): Promise<{ data: Dao[]; total: number }> {
    const response = await apiClient.get<{ data: Dao[]; total: number }>('/daos', { params });
    return response.data;
  },

  // Proposal Management
  async createProposal(daoId: string, data: Partial<Proposal>): Promise<Proposal> {
    const response = await apiClient.post<Proposal>(`/daos/${daoId}/proposals`, data);
    return response.data;
  },

  async getProposal(daoId: string, proposalId: string): Promise<Proposal> {
    const response = await apiClient.get<Proposal>(`/daos/${daoId}/proposals/${proposalId}`);
    return response.data;
  },

  async updateProposal(daoId: string, proposalId: string, data: Partial<Proposal>): Promise<Proposal> {
    const response = await apiClient.patch<Proposal>(`/daos/${daoId}/proposals/${proposalId}`, data);
    return response.data;
  },

  async deleteProposal(daoId: string, proposalId: string): Promise<void> {
    await apiClient.delete(`/daos/${daoId}/proposals/${proposalId}`);
  },

  async listProposals(daoId: string, params?: { page?: number; limit?: number; status?: string }): Promise<{ data: Proposal[]; total: number }> {
    const response = await apiClient.get<{ data: Proposal[]; total: number }>(`/daos/${daoId}/proposals`, { params });
    return response.data;
  },

  // Vote Management
  async castVote(daoId: string, proposalId: string, data: { vote: 'yes' | 'no' | 'abstain'; reason?: string }): Promise<Vote> {
    const response = await apiClient.post<Vote>(`/daos/${daoId}/proposals/${proposalId}/votes`, data);
    return response.data;
  },

  async getVote(daoId: string, proposalId: string, voteId: string): Promise<Vote> {
    const response = await apiClient.get<Vote>(`/daos/${daoId}/proposals/${proposalId}/votes/${voteId}`);
    return response.data;
  },

  async updateVote(daoId: string, proposalId: string, voteId: string, data: { vote: 'yes' | 'no' | 'abstain'; reason?: string }): Promise<Vote> {
    const response = await apiClient.patch<Vote>(`/daos/${daoId}/proposals/${proposalId}/votes/${voteId}`, data);
    return response.data;
  },

  async deleteVote(daoId: string, proposalId: string, voteId: string): Promise<void> {
    await apiClient.delete(`/daos/${daoId}/proposals/${proposalId}/votes/${voteId}`);
  },

  async listVotes(daoId: string, proposalId: string, params?: { page?: number; limit?: number }): Promise<{ data: Vote[]; total: number }> {
    const response = await apiClient.get<{ data: Vote[]; total: number }>(`/daos/${daoId}/proposals/${proposalId}/votes`, { params });
    return response.data;
  },

  // Member Management
  async joinDao(daoId: string): Promise<Member> {
    const response = await apiClient.post<Member>(`/daos/${daoId}/members`);
    return response.data;
  },

  async leaveDao(daoId: string): Promise<void> {
    await apiClient.delete(`/daos/${daoId}/members`);
  },

  async getMember(daoId: string, memberId: string): Promise<Member> {
    const response = await apiClient.get<Member>(`/daos/${daoId}/members/${memberId}`);
    return response.data;
  },

  async updateMember(daoId: string, memberId: string, data: Partial<Member>): Promise<Member> {
    const response = await apiClient.patch<Member>(`/daos/${daoId}/members/${memberId}`, data);
    return response.data;
  },

  async listMembers(daoId: string, params?: { page?: number; limit?: number; role?: string }): Promise<{ data: Member[]; total: number }> {
    const response = await apiClient.get<{ data: Member[]; total: number }>(`/daos/${daoId}/members`, { params });
    return response.data;
  },
}; 