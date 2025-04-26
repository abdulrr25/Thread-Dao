import DAODashboard from '@/components/DAO/DAODashboard';

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Your Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Track your DAO activities and manage your memberships
          </p>
        </div>

        <DAODashboard />
      </div>
    </div>
  );
} 