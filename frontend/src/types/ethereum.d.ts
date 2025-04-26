interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    isConnected: () => boolean;
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    on: (event: string, callback: (params: any) => void) => void;
    removeListener: (event: string, callback: (params: any) => void) => void;
    selectedAddress: string | null;
    chainId: string;
    networkVersion: string;
    _metamask: {
      isUnlocked: () => Promise<boolean>;
    };
  };
} 