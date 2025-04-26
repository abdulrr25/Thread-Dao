import CreateDAO from '@/components/DAO/CreateDAO';
import DAOManagement from '@/components/DAO/DAOManagement';

export default function DAOsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            DAO Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Create and manage your decentralized autonomous organizations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CreateDAO />
          <DAOManagement />
        </div>
      </div>
    </div>
  );
} 