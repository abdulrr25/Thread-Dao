'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  chainId: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  switchChain: (chainId: string) => Promise<void>;
}

const WalletContext = createContext<WalletContextType | null>(null);

const SUPPORTED_CHAINS = {
  '0x1': 'Ethereum Mainnet',
  '0x89': 'Polygon Mainnet',
  '0x13881': 'Mumbai Testnet',
};

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chainId, setChainId] = useState<string | null>(null);
  const { toast } = useToast();

  const connect = async () => {
    if (typeof window.ethereum === 'undefined') {
      toast({
        title: "MetaMask not found",
        description: "Please install MetaMask to use this application",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsConnecting(true);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      
      setAddress(account);
      setChainId(chainId);
      setIsConnected(true);
      
      toast({
        title: "Wallet Connected",
        description: `Connected to ${SUPPORTED_CHAINS[chainId as keyof typeof SUPPORTED_CHAINS] || 'Unknown Network'}`,
      });
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    setAddress(null);
    setIsConnected(false);
    setChainId(null);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  const switchChain = async (targetChainId: string) => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: targetChainId }],
      });
      setChainId(targetChainId);
      toast({
        title: "Network Switched",
        description: `Switched to ${SUPPORTED_CHAINS[targetChainId as keyof typeof SUPPORTED_CHAINS] || 'Unknown Network'}`,
      });
    } catch (error: any) {
      if (error.code === 4902) {
        // Chain not added to MetaMask
        toast({
          title: "Network Not Found",
          description: "Please add this network to MetaMask first",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to switch network",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          
          if (accounts.length > 0) {
            setAddress(accounts[0]);
            setChainId(chainId);
            setIsConnected(true);
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };

    checkConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length > 0) {
      setAddress(accounts[0]);
      setIsConnected(true);
    } else {
      setAddress(null);
      setIsConnected(false);
    }
  };

  const handleChainChanged = (newChainId: string) => {
    setChainId(newChainId);
    toast({
      title: "Network Changed",
      description: `Switched to ${SUPPORTED_CHAINS[newChainId as keyof typeof SUPPORTED_CHAINS] || 'Unknown Network'}`,
    });
  };

  return (
    <WalletContext.Provider 
      value={{ 
        address, 
        isConnected, 
        isConnecting,
        chainId,
        connect, 
        disconnect,
        switchChain 
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