import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WalletState, ChainId } from '../types';
import { DEFAULT_CHAIN, CHAINS } from '../utils/chains';
import { ethers } from 'ethers';

interface WalletStore extends WalletState {}

export const useWalletStore = create<WalletStore>()(
  persist(
    (set, get) => ({
      account: null,
      chainId: null,
      isConnecting: false,
      isLoadingActivity: false,
      transactions: [],
      selectedChain: DEFAULT_CHAIN,
      gasPrice: null,
      tokens: [],
      nfts: [],
      error: null,
      pageKey: undefined,
      hasMore: false,

      fetchGasPrice: async () => {
         const { selectedChain } = get();
         try {
             const { fetchCurrentGasPrice } = await import('../utils/ethereum');
             const price = await fetchCurrentGasPrice(selectedChain);
             set({ gasPrice: price });
         } catch (error) {
             console.error("Failed to fetch gas price store:", error);
         }
      },

      fetchTokens: async () => {
          const { account, selectedChain } = get();
          if (!account) return;

          try {
              const { fetchTokenBalances } = await import('../utils/ethereum');
              const tokens = await fetchTokenBalances(account, selectedChain);
              set({ tokens });
          } catch (error) {
              console.error("Failed to fetch tokens:", error);
          }
      },

      fetchNFTs: async () => {
          const { account, selectedChain } = get();
          if (!account) return;

          try {
              const { fetchNFTs } = await import('../utils/ethereum');
              const nfts = await fetchNFTs(account, selectedChain);
              set({ nfts });
          } catch (error) {
              console.error("Failed to fetch NFTs:", error);
          }
      },

      connectWallet: async () => {
        set({ isConnecting: true, error: null });
        try {
          if (!window.ethereum) {
            throw new Error('No Ethereum wallet found');
          }
          
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.send("eth_requestAccounts", []);
          const network = await provider.getNetwork();
          
          
          
          const chainIdHex = '0x' + network.chainId.toString(16);
          const isSupported = Object.keys(CHAINS).includes(chainIdHex);

          set({ 
            account: accounts[0], 
            chainId: chainIdHex as ChainId,
            selectedChain: isSupported ? (chainIdHex as ChainId) : DEFAULT_CHAIN
          });
          
          get().fetchHistory(true);
          get().fetchTokens();
          get().fetchNFTs();

        } catch (err: any) {
          if (err.code === 4001 || err.code === -32002) {
             set({ error: null });
             return;
          }
           if (err.error && (err.error.code === -32002 || err.error.code === 4001)) {
              set({ error: null });
              return;
           }

          console.error("Connection error:", err);
          set({ error: err.message || 'Failed to connect wallet' });
        } finally {
          set({ isConnecting: false });
        }
      },

      disconnectWallet: () => {
        set({ account: null, chainId: null, transactions: [], tokens: [], nfts: [], pageKey: undefined, hasMore: false, selectedChain: DEFAULT_CHAIN });
      },

      selectChain: async (chainId: ChainId) => {
        set({ selectedChain: chainId });
        const { account } = get();
        
        if (account) {
            try {
                const { switchNetwork } = await import('../utils/ethereum');
                await switchNetwork(chainId);
                await switchNetwork(chainId);
                
                get().fetchHistory(true);
                get().fetchTokens();
                get().fetchNFTs();
            } catch (err: any) {
                console.error("Failed to switch network:", err);
                set({ error: "Failed to switch network. Please try again." });
            }
        }
      },

      fetchHistory: async (reset = false) => {
         const { account, selectedChain, pageKey } = get();
         if (!account) return;

         set({ isLoadingActivity: true, error: null });
         if (reset) {
             set({ transactions: [], pageKey: undefined, hasMore: false });
         }

         try {
             const keyToUse = reset ? undefined : pageKey;
             
             const { fetchWalletHistory } = await import('../utils/ethereum');
             const response = await fetchWalletHistory(account, selectedChain, keyToUse);
             
             set((state) => ({ 
                 transactions: reset ? response.transactions : [...state.transactions, ...response.transactions],
                 pageKey: response.pageKey,
                 hasMore: !!response.pageKey
             }));
         } catch (err: any) {
             console.error("Fetch history error:", err);
             set({ error: "Failed to fetch history" });
         } finally {
             set({ isLoadingActivity: false });
         }
      },

      setAccount: (account: string | null) => set({ account, transactions: [] }),
      setChainId: (chainId: ChainId) => set({ chainId }),
      clearError: () => set({ error: null })
    }),
    {
      name: 'chain-activity-storage',
      partialize: (state) => ({ selectedChain: state.selectedChain }),
    }
  )
);
