import React from 'react';
import { motion } from 'framer-motion';
import { useWalletStore } from '../store/useWalletStore';

import { ErrorToast } from './ErrorToast';
import { GasTracker } from './GasTracker';
import { ThemeToggle } from './ThemeToggle';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { account, isConnecting, connectWallet, disconnectWallet, setAccount, setChainId } = useWalletStore();

  React.useEffect(() => {
    if (window.ethereum) {
      const handleChainChanged = (chainId: string) => {
        setChainId(chainId as any);
      };

      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      };

      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('chainChanged', handleChainChanged);
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, [setAccount, setChainId]);

  return (
    <div className="bg-white dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-200">
      <ErrorToast />
      <header className="flex justify-between items-center py-4 px-6 md:px-10 max-w-[1440px] mx-auto w-full border-b border-transparent dark:border-white/10">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center">
              <span className="font-bold text-white text-lg">C</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">ChainActivity</span>
          </div>
    
        </div>

        <div className="flex items-center gap-4">
             <GasTracker />
             <ThemeToggle />
             <button 
             onClick={() => account ? disconnectWallet() : connectWallet()}
             disabled={isConnecting}
             className="text-brand-orange hover:text-[#45b045] font-medium border-b border-brand-orange/30 hover:border-brand-orange transition-all pb-0.5 disabled:opacity-50 disabled:cursor-not-allowed">
             {isConnecting ? "Connecting..." : account ? `${account.slice(0,6)}...${account.slice(-4)}` : "Connect Wallet"}
           </button>
        </div>
      </header>
      
      <main className="w-full">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};