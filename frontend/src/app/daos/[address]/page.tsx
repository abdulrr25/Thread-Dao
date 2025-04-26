import { notFound } from 'next/navigation';
import DAODetails from '@/components/DAO/DAODetails';

interface PageProps {
  params: {
    address: string;
  };
}

export default async function DAOPage({ params }: PageProps) {
  const { address } = params;

  // Fetch DAO data
  const response = await fetch(`http://localhost:3001/api/daos/${address}`);
  if (!response.ok) {
    notFound();
  }

  const dao = await response.json();

  return (
    <div className="container mx-auto px-4 py-8">
      <DAODetails dao={dao} />
    </div>
  );
} 