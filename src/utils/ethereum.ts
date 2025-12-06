import { Network, Alchemy, AssetTransfersCategory, SortingOrder } from "alchemy-sdk";
import type { ChainId, Transaction } from '../types';

const getAlchemyNetwork = (chainId: ChainId): Network => {
  switch (chainId) {
    case '0x89': return Network.MATIC_MAINNET;
    case '0xa4b1': return Network.ARB_MAINNET;
    case '0xa': return Network.OPT_MAINNET;
    default: return Network.ETH_MAINNET;
  }
};

export const fetchWalletHistory = async (address: string, chainId: ChainId): Promise<Transaction[]> => {
  const network = getAlchemyNetwork(chainId);
  
  const config = {
      apiKey: import.meta.env.VITE_ALCHEMY_API_KEY,
      network: network,
  };
  
  const alchemy = new Alchemy(config);

  const data = await alchemy.core.getAssetTransfers({
    fromBlock: "0x0",
    fromAddress: address,
    category: [AssetTransfersCategory.EXTERNAL, AssetTransfersCategory.ERC20],
    maxCount: 10,
    order: SortingOrder.DESCENDING,
    withMetadata: true
  });

  return data.transfers.map(tx => ({
    hash: tx.hash,
    from: tx.from,
    to: tx.to || '',
    value: tx.value?.toString() || '0',
    timestamp: tx.metadata.blockTimestamp ? new Date(tx.metadata.blockTimestamp).getTime() : Date.now(),
    status: 'confirmed',
    chainId,
    tokenSymbol: tx.asset || 'ETH',
    valueUsd: (Number(tx.value || 0) * 2500).toFixed(2)
  }));
};

export const switchNetwork = async (chainId: ChainId): Promise<void> => {
  if (!window.ethereum) throw new Error("No Ethereum wallet found");

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }],
    });
  } catch (error: any) {
    if (error.code === 4902) {
      const { CHAINS } = await import('./chains');
      const chain = CHAINS[chainId];
      
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: chain.id,
            chainName: chain.name,
            rpcUrls: [chain.rpcUrl],
            nativeCurrency: {
              name: chain.currency,
              symbol: chain.currency, 
              decimals: 18,
            },
            blockExplorerUrls: [chain.explorerUrl],
          },
        ],
      });
    } else {
      throw error;
    }
  }
};
