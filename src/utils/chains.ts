import type { Chain, ChainId } from '../types';

export const CHAINS: Record<ChainId, Chain> = {
  '0x1': {
    id: '0x1',
    name: 'Ethereum',
    rpcUrl: 'https://eth.llamarpc.com',
    currency: 'ETH',
    explorerUrl: 'https://etherscan.io',
  },
  '0x89': {
    id: '0x89',
    name: 'Polygon',
    rpcUrl: 'https://polygon.llamarpc.com',
    currency: 'MATIC',
    explorerUrl: 'https://polygonscan.com',
  },
  '0xa4b1': {
    id: '0xa4b1',
    name: 'Arbitrum One',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    currency: 'ETH',
    explorerUrl: 'https://arbiscan.io',
  },
  '0xa': {
    id: '0xa',
    name: 'Optimism',
    rpcUrl: 'https://mainnet.optimism.io',
    currency: 'ETH',
    explorerUrl: 'https://optimistic.etherscan.io',
  },
};

export const SUPPORTED_CHAINS = Object.values(CHAINS);

export const DEFAULT_CHAIN: ChainId = '0x1';
