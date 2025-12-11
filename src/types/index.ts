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
  valueUsd?: string;
  timestamp: number;
  status: TransactionStatus;
  chainId: ChainId;
  tokenSymbol: string;
}

export interface Token {
    symbol: string;
    name: string;
    balance: string;
    contractAddress: string;
    logo?: string;
    decimals: number;
    isNative?: boolean;
}

export interface NFT {
    contractAddress: string;
    tokenId: string;
    name: string;
    collectionName: string;
    image?: string;
    type: string;
}

export interface WalletState {
  account: string | null;
  chainId: ChainId | null;
  isConnecting: boolean;
  isLoadingActivity: boolean;
  transactions: Transaction[];
  selectedChain: ChainId;
  error: string | null;
  gasPrice: string | null;
  tokens: Token[];
  nfts: NFT[];
  pageKey?: string;
  hasMore: boolean;
  
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  selectChain: (chainId: ChainId) => Promise<void>;
  fetchHistory: (reset?: boolean) => Promise<void>;
  fetchTokens: () => Promise<void>;
  fetchNFTs: () => Promise<void>;
  clearError: () => void;
  setAccount: (account: string | null) => void;
  setChainId: (chainId: ChainId) => void;
  fetchGasPrice: () => Promise<void>;
}
