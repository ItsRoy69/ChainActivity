import React from 'react';
import { useWalletStore } from '../store/useWalletStore';
import { Wallet, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

export const WalletConnect: React.FC = () => {
  const { account, isConnecting, connectWallet, disconnectWallet } = useWalletStore();

  const handleConnect = () => {
    if (account) {
      disconnectWallet();
    } else {
      connectWallet();
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      className={clsx(
        "flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-200 outline-none focus:ring-2 focus:ring-brand-orange/50",
        account 
          ? "bg-glass border border-glassBorder hover:bg-white/10 text-white" 
          : "bg-brand-orange hover:bg-[#45b045] text-white shadow-lg shadow-brand-orange/20"
      )}
    >
      {isConnecting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Wallet className="w-4 h-4 ml-0.5" />
      )}
      <span className="text-sm">
        {isConnecting 
          ? "Connecting..." 
          : account 
            ? formatAddress(account)
            : "Connect Wallet"
        }
      </span>
    </button>
  );
};
