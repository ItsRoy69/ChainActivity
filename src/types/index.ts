export type ChainId = '0x1' | '0x89' | '0xa4b1' | '0xa';

export interface Chain {
  id: ChainId;
  name: string;
  rpcUrl: string;
  currency: string;
  explorerUrl: string;
  logoUrl?: string;
}

export type TransactionStatus = 'pending' | 'confirmed' | 'failed';

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  status: TransactionStatus;
  chainId: ChainId;
  tokenSymbol: string;
}

export interface WalletState {
  account: string | null;
  chainId: ChainId | null;
  isConnecting: boolean;
  isLoadingActivity: boolean;
  transactions: Transaction[];
  selectedChain: ChainId;
  error: string | null;
  

  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  selectChain: (chainId: ChainId) => void;
  fetchHistory: () => Promise<void>;
}
