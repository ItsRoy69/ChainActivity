import React from 'react';
import { motion } from 'framer-motion';
import { useWalletStore } from '../store/useWalletStore';

import { ErrorToast } from './ErrorToast';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { account, isConnecting, connectWallet, disconnectWallet, setAccount, setChainId } = useWalletStore();

  React.useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', (chainId: string) => {
        setChainId(chainId as any);
        window.location.reload();
      });

      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      });
    }
  }, [setAccount, setChainId]);

  return (
    <div className="bg-white font-sans text-[#333333]">
      <ErrorToast />
      <header className="flex justify-between items-center py-4 px-6 md:px-10 max-w-[1440px] mx-auto w-full">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center">
              <span className="font-bold text-white text-lg">C</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-[#1A1A1A]">ChainActivity</span>
          </div>
    
        </div>

        <div>
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