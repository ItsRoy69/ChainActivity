import { Network, Alchemy, AssetTransfersCategory, SortingOrder, TokenBalanceType, NftTokenType } from "alchemy-sdk";
import type { ChainId, Transaction, Token, NFT } from '../types';

const getAlchemyNetwork = (chainId: ChainId): Network => {
  switch (chainId) {
    case '0x89': return Network.MATIC_MAINNET;
    case '0xa4b1': return Network.ARB_MAINNET;
    case '0xa': return Network.OPT_MAINNET;
    default: return Network.ETH_MAINNET;
  }
};

export interface FetchHistoryResponse {
    transactions: Transaction[];
    pageKey?: string;
}

export const fetchWalletHistory = async (address: string, chainId: ChainId, pageKey?: string): Promise<FetchHistoryResponse> => {
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
    withMetadata: true,
    pageKey: pageKey
  });

  const transactions = data.transfers.map(tx => ({
    hash: tx.hash,
    from: tx.from,
    to: tx.to || '',
    value: tx.value?.toString() || '0',
    timestamp: tx.metadata.blockTimestamp ? new Date(tx.metadata.blockTimestamp).getTime() : Date.now(),
    status: 'confirmed' as const,
    chainId,
    tokenSymbol: tx.asset || 'ETH',
    valueUsd: (Number(tx.value || 0) * 2500).toFixed(2)
  }));

  return { transactions, pageKey: data.pageKey };
};

export const fetchTokenBalances = async (address: string, chainId: ChainId): Promise<Token[]> => {
    const network = getAlchemyNetwork(chainId);
    const config = {
      apiKey: import.meta.env.VITE_ALCHEMY_API_KEY,
      network: network,
    };
    const alchemy = new Alchemy(config);

    const balances = await alchemy.core.getTokenBalances(address, {
        type: TokenBalanceType.ERC20
    });


    const nonZeroStringBalances = balances.tokenBalances.filter(token => {

        return token.tokenBalance && token.tokenBalance !== "0x0000000000000000000000000000000000000000000000000000000000000000";
    });

    const tokens: Token[] = [];


    for (const token of nonZeroStringBalances.slice(0, 20)) {
        try {
            const metadata = await alchemy.core.getTokenMetadata(token.contractAddress);
            let balance = 0;
            if (token.tokenBalance && metadata.decimals) {
                balance = Number(token.tokenBalance) / Math.pow(10, metadata.decimals);
            }

            tokens.push({
                symbol: metadata.symbol || "UNKNOWN",
                name: metadata.name || "Unknown Token",
                balance: balance.toFixed(4),
                contractAddress: token.contractAddress,
                logo: metadata.logo || undefined,
                decimals: metadata.decimals || 18 
            });
        } catch (e) {
            console.warn("Failed to get metadata for token:", token.contractAddress);
        }
    }
    

    const nativeBalance = await alchemy.core.getBalance(address);
    const nativeBalanceFormatted = (Number(nativeBalance) / 1e18).toFixed(4);
    

    let nativeSymbol = "ETH";
    let nativeName = "Ethereum";
    if (chainId === '0x89') { nativeSymbol = "MATIC"; nativeName = "Polygon"; }
    
    tokens.unshift({
        symbol: nativeSymbol,
        name: nativeName,
        balance: nativeBalanceFormatted,
        contractAddress: "native",
        decimals: 18,
        isNative: true
    });

    return tokens;
}

export const fetchNFTs = async (address: string, chainId: ChainId): Promise<NFT[]> => {
    const network = getAlchemyNetwork(chainId);
    const config = {
      apiKey: import.meta.env.VITE_ALCHEMY_API_KEY,
      network: network,
    };
    const alchemy = new Alchemy(config);

    const nfts = await alchemy.nft.getNftsForOwner(address, {
        excludeFilters: [NftTokenType.ERC1155 as any], 
        pageSize: 12
    });


    return nfts.ownedNfts.map((nft: any) => ({
        contractAddress: nft.contract.address,
        tokenId: nft.tokenId,
        name: nft.title || `#${nft.tokenId}`,
        collectionName: nft.contract.name || "Unknown Collection",
        image: nft.media?.[0]?.gateway || nft.media?.[0]?.thumbnail,
        type: nft.tokenType
    }));
}

export const fetchCurrentGasPrice = async (chainId: ChainId): Promise<string> => {
  const network = getAlchemyNetwork(chainId);
  const config = {
      apiKey: import.meta.env.VITE_ALCHEMY_API_KEY,
      network: network,
  };
  const alchemy = new Alchemy(config);

  try {
      const feeData = await alchemy.core.getFeeData();
      if (feeData.gasPrice) {

          const gasInGwei = Number(feeData.gasPrice) / 1000000000;
          return gasInGwei.toFixed(0);
      }
      return '0';
  } catch (error) {
      console.error("Failed to fetch gas price:", error);
      return '0';
  }
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
