'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

interface WalletContextType {
  publicKey: PublicKey | null;
  connected: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  network: WalletAdapterNetwork;
  connection: Connection;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  const [connected, setConnected] = useState(false);
  const network = WalletAdapterNetwork.Mainnet;
  const connection = new Connection('https://api.mainnet-beta.solana.com');

  useEffect(() => {
    // Check if wallet is already connected
    const checkConnection = async () => {
      if (typeof window !== 'undefined' && window.solana?.isConnected) {
        setPublicKey(new PublicKey(window.solana.publicKey));
        setConnected(true);
      }
    };
    checkConnection();
  }, []);

  const connect = async () => {
    if (typeof window !== 'undefined' && window.solana) {
      try {
        const resp = await window.solana.connect();
        setPublicKey(new PublicKey(resp.publicKey));
        setConnected(true);
      } catch (err) {
        console.error('Failed to connect wallet:', err);
      }
    }
  };

  const disconnect = async () => {
    if (typeof window !== 'undefined' && window.solana) {
      try {
        await window.solana.disconnect();
        setPublicKey(null);
        setConnected(false);
      } catch (err) {
        console.error('Failed to disconnect wallet:', err);
      }
    }
  };

  return (
    <WalletContext.Provider
      value={{
        publicKey,
        connected,
        connect,
        disconnect,
        network,
        connection,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
} 