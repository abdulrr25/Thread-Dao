'use client';

import { useState } from 'react';
import { useWallet } from '@/context/WalletContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface Proposal {
  id: string;
  proposal: string;
  proposer: string;
  status: 'pending' | 'approved' | 'rejected';
  votes: {
    voter: string;
    vote: 'yes' | 'no';
  }[];
  created_at: string;
}

interface DAO {
  address: string;
  title: string;
  description: string;
  creator: string;
  members: string[];
  created_at: string;
}

interface DAODetailsProps {
  dao: DAO;
}

export default function DAODetails({ dao }: DAODetailsProps) {
  const { publicKey, connected } = useWallet();
  const [newProposal, setNewProposal] = useState('');
  const [newMemberAddress, setNewMemberAddress] = useState('');
  const queryClient = useQueryClient();

  const { data: proposals, isLoading } = useQuery({
    queryKey: ['proposals', dao.address],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3001/api/daos/${dao.address}/proposals`);
      if (!response.ok) {
        throw new Error('Failed to fetch proposals');
      }
      return response.json();
    },
  });

  const createProposalMutation = useMutation({
    mutationFn: async (proposal: string) => {
      if (!publicKey) throw new Error('Wallet not connected');
      
      const response = await fetch(`http://localhost:3001/api/daos/${dao.address}/proposals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          proposal,
          proposer: publicKey.toBase58(),
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create proposal');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals', dao.address] });
      setNewProposal('');
    },
  });

  const voteMutation = useMutation({
    mutationFn: async ({ proposalId, vote }: { proposalId: string; vote: 'yes' | 'no' }) => {
      if (!publicKey) throw new Error('Wallet not connected');
      
      const response = await fetch(`http://localhost:3001/api/daos/${dao.address}/proposals/${proposalId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voter: publicKey.toBase58(),
          vote,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to vote');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals', dao.address] });
    },
  });

  const memberManagementMutation = useMutation({
    mutationFn: async ({ walletAddress, action }: { walletAddress: string; action: 'invite' | 'remove' }) => {
      if (!publicKey) throw new Error('Wallet not connected');
      
      const response = await fetch(`http://localhost:3001/api/daos/${dao.address}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
          action,
          requester: publicKey.toBase58(),
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${action} member`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daos'] });
      setNewMemberAddress('');
    },
  });

  const isCreator = publicKey && dao.creator === publicKey.toBase58();
  const isMember = publicKey && dao.members.includes(publicKey.toBase58());

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {dao.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {dao.description}
        </p>
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <span>Created by: {dao.creator}</span>
          <span>•</span>
          <span>Members: {dao.members.length}</span>
          <span>•</span>
          <span>Created: {new Date(dao.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      {isCreator && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Manage Members
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              memberManagementMutation.mutate({
                walletAddress: newMemberAddress,
                action: 'invite',
              });
            }}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="memberAddress"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Wallet Address
              </label>
              <input
                type="text"
                id="memberAddress"
                value={newMemberAddress}
                onChange={(e) => setNewMemberAddress(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter wallet address"
                required
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={memberManagementMutation.isPending}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
              >
                Invite Member
              </button>
              <button
                type="button"
                onClick={() =>
                  memberManagementMutation.mutate({
                    walletAddress: newMemberAddress,
                    action: 'remove',
                  })
                }
                disabled={memberManagementMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
              >
                Remove Member
              </button>
            </div>
          </form>
        </div>
      )}

      {isMember && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Create Proposal
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createProposalMutation.mutate(newProposal);
            }}
            className="space-y-4"
          >
            <textarea
              value={newProposal}
              onChange={(e) => setNewProposal(e.target.value)}
              placeholder="Enter your proposal..."
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              rows={4}
              required
            />
            <button
              type="submit"
              disabled={createProposalMutation.isPending}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
            >
              Submit Proposal
            </button>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Proposals
        </h2>
        {isLoading ? (
          <p className="text-gray-600 dark:text-gray-300">Loading proposals...</p>
        ) : proposals?.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">No proposals yet</p>
        ) : (
          <div className="space-y-4">
            {proposals?.map((proposal: Proposal) => (
              <div
                key={proposal.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-gray-900 dark:text-white">{proposal.proposal}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Proposed by: {proposal.proposer}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      proposal.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : proposal.status === 'approved'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}
                  >
                    {proposal.status}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>
                    Yes: {proposal.votes.filter((v) => v.vote === 'yes').length}
                  </span>
                  <span>
                    No: {proposal.votes.filter((v) => v.vote === 'no').length}
                  </span>
                </div>
                {isMember && proposal.status === 'pending' && (
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() =>
                        voteMutation.mutate({ proposalId: proposal.id, vote: 'yes' })
                      }
                      disabled={voteMutation.isPending}
                      className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                    >
                      Vote Yes
                    </button>
                    <button
                      onClick={() =>
                        voteMutation.mutate({ proposalId: proposal.id, vote: 'no' })
                      }
                      disabled={voteMutation.isPending}
                      className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                    >
                      Vote No
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 