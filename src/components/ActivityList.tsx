import React from 'react';
import { useWalletStore } from '../store/useWalletStore';
import { ArrowUpRight, ArrowDownLeft, Clock, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { CHAINS } from '../utils/chains';

export const ActivityList: React.FC = () => {
    const { transactions, isLoadingActivity, account, selectedChain } = useWalletStore();
    const chainConfig = CHAINS[selectedChain];

    if (!account) {
        return (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="text-center py-20 text-gray-500 glass-panel"
            >
                <div className="mb-4 text-gray-600 bg-white/5 w-16 h-16 rounded-full mx-auto flex items-center justify-center">
                    <Clock size={32} />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No Wallet Connected</h3>
                <p>Connect your wallet to view blockchain activity.</p>
            </motion.div>
        );
    }

    if (isLoadingActivity) {
        return (
            <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-24 bg-glass animate-pulse rounded-xl border border-glassBorder" />
                ))}
            </div>
        );
    }

    if (transactions.length === 0) {
        return (
            <div className="text-center py-20 text-gray-500 glass-panel">
                 <div className="mb-4 text-gray-600 bg-white/5 w-16 h-16 rounded-full mx-auto flex items-center justify-center">
                    <Clock size={32} />
                </div>
                <p>No transactions found on {chainConfig.name}.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {transactions.map((tx, index) => {
                const isSent = tx.from.toLowerCase() === account.toLowerCase();
                const explorerLink = `${chainConfig.explorerUrl}/tx/${tx.hash}`;

                return (
                    <motion.div 
                        key={tx.hash}
                        initial={{ opacity: 0, x: -20, y: 10 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                        className="glass-panel p-4 flex flex-col sm:flex-row sm:items-center justify-between group hover:bg-white/5 transition-colors gap-4"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-full shrink-0 ${isSent ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                                {isSent ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                            </div>
                            <div>
                                <h3 className="font-medium text-white flex items-center gap-2 flex-wrap">
                                    {isSent ? 'Sent' : 'Received'} {tx.tokenSymbol}
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                                        tx.status === 'confirmed' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 
                                        tx.status === 'pending' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                                    }`}>
                                        {tx.status}
                                    </span>
                                </h3>
                                <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                    <Clock size={12} />
                                    {new Date(tx.timestamp).toLocaleString(undefined, {
                                        dateStyle: 'medium',
                                        timeStyle: 'short'
                                    })}
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t border-glassBorder sm:border-t-0 pt-3 sm:pt-0 mt-0">
                            <p className={`font-bold text-lg mb-1 break-all ${isSent ? 'text-white' : 'text-green-400'}`}>
                                {isSent ? '-' : '+'}{Number(tx.value).toFixed(4)} {tx.tokenSymbol}
                            </p>
                            <a 
                                href={explorerLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-blue-400 hover:text-blue-300 flex items-center justify-end gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                View <ExternalLink size={10} />
                            </a>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};
