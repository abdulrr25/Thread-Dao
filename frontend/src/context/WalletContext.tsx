'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { useToast } from '../hooks/use-toast';

interface WalletContextType {
  publicKey: string | null;
  connected: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const { toast } = useToast();

  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = clusterApiUrl(network);
  const wallets = [new PhantomWalletAdapter()];

  useEffect(() => {
    // Check if wallet is already connected
    const checkConnection = async () => {
      if (typeof window !== 'undefined' && window.solana?.isConnected) {
        try {
          const publicKey = window.solana.publicKey?.toString();
          if (publicKey) {
            setPublicKey(publicKey);
            setConnected(true);
          }
        } catch (err) {
          console.error('Failed to check wallet connection:', err);
        }
      }
    };
    checkConnection();

    // Listen for account changes
    const handleAccountChanged = (publicKey: string | null) => {
      if (publicKey) {
        setPublicKey(publicKey);
        setConnected(true);
      } else {
        setPublicKey(null);
        setConnected(false);
      }
    };

    if (window.solana) {
      window.solana.on('accountChanged', handleAccountChanged);
    }

    return () => {
      if (window.solana) {
        window.solana.removeListener('accountChanged', handleAccountChanged);
      }
    };
  }, []);

  const connect = async () => {
    if (typeof window !== 'undefined' && window.solana) {
      try {
        await window.solana.connect();
        const publicKey = window.solana.publicKey?.toString();
        if (publicKey) {
          setPublicKey(publicKey);
          setConnected(true);
          toast({
            title: "Wallet Connected",
            description: "Your wallet has been connected successfully.",
          });
        }
      } catch (err) {
        console.error('Failed to connect wallet:', err);
        toast({
          title: "Error",
          description: "Failed to connect wallet",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Error",
        description: "Phantom wallet not found",
        variant: "destructive",
      });
    }
  };

  const disconnect = async () => {
    if (window.solana) {
      try {
        await window.solana.disconnect();
        setPublicKey(null);
        setConnected(false);
        toast({
          title: "Wallet Disconnected",
          description: "Your wallet has been disconnected successfully.",
        });
      } catch (err) {
        console.error('Failed to disconnect wallet:', err);
        toast({
          title: "Error",
          description: "Failed to disconnect wallet",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletContext.Provider
            value={{
              publicKey,
              connected,
              connect,
              disconnect,
            }}
          >
            {children}
          </WalletContext.Provider>
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
} 