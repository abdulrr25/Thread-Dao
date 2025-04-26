'use client';

import { useState } from 'react';
import { useWallet } from '../../context/WalletContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';

interface DAO {
  address: string;
  title: string;
  creator: string;
  members: string[];
  created_at: string;
}

export default function DAOManagement() {
  const { publicKey, connected } = useWallet();
  const [selectedDAO, setSelectedDAO] = useState<DAO | null>(null);
  const queryClient = useQueryClient();

  const { data: daos, isLoading } = useQuery({
    queryKey: ['daos'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3001/api/daos');
      if (!response.ok) {
        throw new Error('Failed to fetch DAOs');
      }
      return response.json();
    },
    enabled: connected,
  });

  const joinDAOMutation = useMutation({
    mutationFn: async (daoAddress: string) => {
      if (!publicKey) throw new Error('Wallet not connected');
      const response = await fetch(`http://localhost:3001/api/daos/${daoAddress}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress: publicKey.toBase58() }),
      });
      if (!response.ok) {
        throw new Error('Failed to join DAO');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daos'] });
    },
  });

  const createProposalMutation = useMutation({
    mutationFn: async ({ daoAddress, proposal }: { daoAddress: string; proposal: string }) => {
      if (!publicKey) throw new Error('Wallet not connected');
      const response = await fetch(`http://localhost:3001/api/daos/${daoAddress}/proposals`, {
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
      queryClient.invalidateQueries({ queryKey: ['daos'] });
    },
  });

  if (!connected) {
    return (
      <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <p className="text-gray-600 dark:text-gray-300">
          Please connect your wallet to manage DAOs
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center p-6">
        <p className="text-gray-600 dark:text-gray-300">Loading DAOs...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        DAO Management
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* DAO List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Your DAOs
          </h3>
          <div className="space-y-4">
            {daos?.data.map((dao: DAO) => (
              <div
                key={dao.address}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Link href={`/daos/${dao.address}`} className="block">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {dao.title}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Members: {dao.members.length}
                  </p>
                </Link>
                {!dao.members.includes(publicKey?.toBase58() || '') && (
                  <button
                    onClick={() => joinDAOMutation.mutate(dao.address)}
                    disabled={joinDAOMutation.isPending}
                    className="mt-2 px-3 py-1 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    Join DAO
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* DAO Details */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          {selectedDAO ? (
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                {selectedDAO.title}
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Members
                  </h4>
                  <ul className="space-y-2">
                    {selectedDAO.members.map((member) => (
                      <li
                        key={member}
                        className="text-sm text-gray-600 dark:text-gray-300"
                      >
                        {member}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Create Proposal
                  </h4>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const proposal = formData.get('proposal') as string;
                      createProposalMutation.mutate({
                        daoAddress: selectedDAO.address,
                        proposal,
                      });
                    }}
                    className="space-y-2"
                  >
                    <textarea
                      name="proposal"
                      rows={3}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      Submit Proposal
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">
              Select a DAO to view details
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 