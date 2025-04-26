'use client';

import { useState } from 'react';
import { useWallet } from '../../context/WalletContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface CreateDAOForm {
  title: string;
  description: string;
}

export default function CreateDAO() {
  const { publicKey, connected } = useWallet();
  const [form, setForm] = useState<CreateDAOForm>({
    title: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const createDAOMutation = useMutation({
    mutationFn: async (formData: CreateDAOForm) => {
      if (!publicKey) throw new Error('Wallet not connected');
      
      const response = await fetch('http://localhost:3001/api/daos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          creator: publicKey.toBase58(),
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create DAO');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daos'] });
      setForm({ title: '', description: '' });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected || !publicKey) {
      alert('Please connect your wallet first');
      return;
    }

    setIsSubmitting(true);
    try {
      await createDAOMutation.mutateAsync(form);
    } catch (error) {
      console.error('Error creating DAO:', error);
      alert('Failed to create DAO');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Create a New DAO
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={form.title}
            onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Description
          </label>
          <textarea
            id="description"
            value={form.description}
            onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !connected}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creating...' : 'Create DAO'}
        </button>
      </form>
    </div>
  );
} 