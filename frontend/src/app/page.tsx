'use client';

import { useWallet } from '../context/WalletContext';

export default function Home() {
  const { publicKey, connected, connect, disconnect } = useWallet();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to ThreadDAO
        </h1>
        
        <div className="flex flex-col items-center gap-4">
          {!connected ? (
            <button
              onClick={connect}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Connect Wallet
            </button>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <p className="text-gray-600 dark:text-gray-300">
                Connected: {publicKey?.toBase58()}
              </p>
              <button
                onClick={disconnect}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 