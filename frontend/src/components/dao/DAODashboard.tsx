'use client';

import { useWallet } from '@/context/WalletContext';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

interface Activity {
  id: string;
  type: 'proposal_created' | 'proposal_voted' | 'member_joined' | 'member_left';
  dao_address: string;
  dao_title: string;
  user_address: string;
  data: any;
  created_at: string;
}

interface Proposal {
  id: string;
  proposal: string;
  status: 'pending' | 'approved' | 'rejected';
  votes: {
    voter: string;
    vote: 'yes' | 'no';
  }[];
}

interface DAO {
  address: string;
  title: string;
  members: string[];
  proposals: Proposal[];
}

export default function DAODashboard() {
  const { publicKey, connected } = useWallet();

  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      if (!publicKey) throw new Error('Wallet not connected');
      
      const response = await fetch(`http://localhost:3001/api/activities?user=${publicKey.toBase58()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch activities');
      }
      return response.json();
    },
    enabled: connected,
  });

  const { data: daos, isLoading: daosLoading } = useQuery({
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

  if (!connected) {
    return (
      <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <p className="text-gray-600 dark:text-gray-300">
          Please connect your wallet to view your dashboard
        </p>
      </div>
    );
  }

  if (activitiesLoading || daosLoading) {
    return (
      <div className="text-center p-6">
        <p className="text-gray-600 dark:text-gray-300">Loading dashboard...</p>
      </div>
    );
  }

  const userDAOs = daos?.data.filter((dao: DAO) => 
    dao.members.includes(publicKey?.toBase58() || '')
  );

  const formatActivity = (activity: Activity) => {
    switch (activity.type) {
      case 'proposal_created':
        return `Created a new proposal in ${activity.dao_title}`;
      case 'proposal_voted':
        return `Voted on a proposal in ${activity.dao_title}`;
      case 'member_joined':
        return `Joined ${activity.dao_title}`;
      case 'member_left':
        return `Left ${activity.dao_title}`;
      default:
        return 'Unknown activity';
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Your DAOs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userDAOs?.map((dao: DAO) => (
            <Link
              key={dao.address}
              href={`/daos/${dao.address}`}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <h3 className="font-medium text-gray-900 dark:text-white">
                {dao.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Members: {dao.members.length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Active Proposals: {dao.proposals.filter(p => p.status === 'pending').length}
              </p>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {activities?.data.map((activity: Activity) => (
            <div
              key={activity.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-900 dark:text-white">
                    {formatActivity(activity)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(activity.created_at).toLocaleString()}
                  </p>
                </div>
                <Link
                  href={`/daos/${activity.dao_address}`}
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  View DAO
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 