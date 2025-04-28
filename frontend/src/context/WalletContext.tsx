'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
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
  network: WalletAdapterNetwork;
}

interface SolanaWindow extends Window {
  solana?: {
    isConnected: boolean;
    publicKey?: { toString: () => string };
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    on: (event: string, callback: (publicKey: string | null) => void) => void;
    removeListener: (event: string, callback: (publicKey: string | null) => void) => void;
  };
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

  const handleAccountChanged = useCallback((publicKey: string | null) => {
    if (publicKey) {
      setPublicKey(publicKey);
      setConnected(true);
      toast({
        title: "Account Changed",
        description: "Your wallet account has been changed.",
      });
    } else {
      setPublicKey(null);
      setConnected(false);
      toast({
        title: "Account Disconnected",
        description: "Your wallet account has been disconnected.",
      });
    }
  }, [toast]);

  const handleConnectError = useCallback((error: Error) => {
    console.error('Wallet connection error:', error);
    toast({
      title: "Connection Error",
      description: error.message || "Failed to connect wallet",
      variant: "destructive",
    });
  }, [toast]);

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== 'undefined') {
        const solanaWindow = window as SolanaWindow;
        if (solanaWindow.solana?.isConnected) {
          try {
            const publicKey = solanaWindow.solana.publicKey?.toString();
            if (publicKey) {
              setPublicKey(publicKey);
              setConnected(true);
            }
          } catch (err) {
            handleConnectError(err as Error);
          }
        }
      }
    };
    checkConnection();

    const solanaWindow = window as SolanaWindow;
    if (solanaWindow.solana) {
      solanaWindow.solana.on('accountChanged', handleAccountChanged);
    }

    return () => {
      if (solanaWindow.solana) {
        solanaWindow.solana.removeListener('accountChanged', handleAccountChanged);
      }
    };
  }, [handleAccountChanged, handleConnectError]);

  const connect = async () => {
    if (typeof window !== 'undefined') {
      const solanaWindow = window as SolanaWindow;
      if (solanaWindow.solana) {
        try {
          await solanaWindow.solana.connect();
          const publicKey = solanaWindow.solana.publicKey?.toString();
          if (publicKey) {
            setPublicKey(publicKey);
            setConnected(true);
            toast({
              title: "Wallet Connected",
              description: "Your wallet has been connected successfully.",
            });
          }
        } catch (err) {
          handleConnectError(err as Error);
        }
      } else {
        toast({
          title: "Error",
          description: "Phantom wallet not found. Please install Phantom wallet.",
          variant: "destructive",
        });
      }
    }
  };

  const disconnect = async () => {
    if (typeof window !== 'undefined') {
      const solanaWindow = window as SolanaWindow;
      if (solanaWindow.solana) {
        try {
          await solanaWindow.solana.disconnect();
          setPublicKey(null);
          setConnected(false);
          toast({
            title: "Wallet Disconnected",
            description: "Your wallet has been disconnected successfully.",
          });
        } catch (err) {
          handleConnectError(err as Error);
        }
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
              network,
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