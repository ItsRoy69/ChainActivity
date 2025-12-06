import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WalletState, ChainId } from '../types';
import { DEFAULT_CHAIN } from '../utils/chains';
import { fetchWalletHistory } from '../utils/ethereum';
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
      error: null,

      connectWallet: async () => {
        set({ isConnecting: true, error: null });
        try {
          if (!window.ethereum) {
            throw new Error('MetaMask is not installed');
          }
          
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.send("eth_requestAccounts", []);
          const network = await provider.getNetwork();
          
          
          const chainIdHex = '0x' + network.chainId.toString(16);
          set({ 
            account: accounts[0], 
            chainId: chainIdHex as ChainId 
          });
          
          get().fetchHistory();

        } catch (err: any) {
          set({ error: err.message || 'Failed to connect wallet' });
        } finally {
          set({ isConnecting: false });
        }
      },

      disconnectWallet: () => {
        set({ account: null, chainId: null, transactions: [] });
      },

      selectChain: (chainId: ChainId) => {
        set({ selectedChain: chainId });
        const { account } = get();
        if (account) {
            get().fetchHistory();
        }
      },

      fetchHistory: async () => {
         const { account, selectedChain } = get();
         if (!account) return;

         set({ isLoadingActivity: true, error: null });
         try {
             const txs = await fetchWalletHistory(account, selectedChain);
             set({ transactions: txs });
         } catch (err: any) {
             console.error("Fetch history error:", err);
             set({ error: "Failed to fetch history" });
         } finally {
             set({ isLoadingActivity: false });
         }
      }
    }),
    {
      name: 'chain-activity-storage',
      partialize: (state) => ({ selectedChain: state.selectedChain }),
    }
  )
);
