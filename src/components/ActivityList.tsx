import React, { useState } from 'react';
import { useWalletStore } from '../store/useWalletStore';
import { ArrowUpRight, ArrowDownLeft, Clock, ExternalLink, Download, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { CHAINS } from '../utils/chains';

export const ActivityList: React.FC = () => {
    const { transactions, isLoadingActivity, account, selectedChain, hasMore, fetchHistory } = useWalletStore();
    const chainConfig = CHAINS[selectedChain] || CHAINS['0x1'];
    const [expandedTx, setExpandedTx] = useState<string | null>(null);

    const toggleExpand = (hash: string) => {
        setExpandedTx(prev => prev === hash ? null : hash);
    };

    const [filterType, setFilterType] = useState<'all' | 'sent' | 'received'>('all');

    const filteredTransactions = transactions.filter(tx => {
        if (filterType === 'all') return true;
        const isSent = tx.from.toLowerCase() === account?.toLowerCase();
        return filterType === 'sent' ? isSent : !isSent;
    });

    const exportToCSV = () => {
        if (!transactions.length) return;
        
        const headers = ['Hash', 'Type', 'From', 'To', 'Value', 'Token', 'Timestamp', 'Date'];
        const rows = transactions.map(tx => {
            const isSent = tx.from.toLowerCase() === account?.toLowerCase();
            return [
                tx.hash,
                isSent ? 'SENT' : 'RECEIVED',
                tx.from,
                tx.to,
                tx.value,
                tx.tokenSymbol,
                tx.timestamp,
                new Date(tx.timestamp).toLocaleString()
            ].join(',');
        });
        
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `transactions_${selectedChain}_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!account) {
        return (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="text-center py-20 text-gray-500 glass-panel"
            >
                <div className="mb-4 text-gray-400 bg-gray-100 dark:bg-white/10 w-16 h-16 rounded-full mx-auto flex items-center justify-center">
                    <Clock size={32} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Wallet Connected</h3>
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
                 <div className="mb-4 text-gray-400 bg-gray-100 dark:bg-white/10 w-16 h-16 rounded-full mx-auto flex items-center justify-center">
                    <Clock size={32} />
                </div>
                <p className="text-gray-900 dark:text-gray-100 font-medium">No transactions found on {chainConfig.name}.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <Filter size={16} className="text-gray-500" />
                    <select 
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as any)}
                        className="bg-transparent border-none text-sm font-medium text-gray-700 dark:text-gray-300 focus:ring-0 cursor-pointer"
                    >
                        <option value="all">All Transactions</option>
                        <option value="sent">Sent</option>
                        <option value="received">Received</option>
                    </select>
                </div>
                <button 
                    onClick={exportToCSV}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-brand-orange bg-brand-orange/10 hover:bg-brand-orange/20 rounded-full transition-colors"
                >
                    <Download size={14} />
                    Export CSV
                </button>
            </div>

            <div className="space-y-3">
            {filteredTransactions.map((tx, index) => {
                const isSent = tx.from.toLowerCase() === account.toLowerCase();
                const explorerLink = `${chainConfig.explorerUrl}/tx/${tx.hash}`;

                return (
                    <motion.div 
                        key={tx.hash}
                        initial={{ opacity: 0, x: -20, y: 10 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                        className="glass-panel p-4 flex flex-col gap-4 group hover:bg-white/5 transition-colors cursor-pointer"
                        onClick={() => toggleExpand(tx.hash)}
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-full shrink-0 ${isSent ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                                {isSent ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                            </div>
                        <div>
                            <h3 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2 flex-wrap">
                                {isSent ? 'Sent' : 'Received'} {tx.tokenSymbol}
                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                                    tx.status === 'confirmed' ? 'bg-green-500/10 border-green-500/20 text-green-600' : 
                                    tx.status === 'pending' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-600' : 'bg-red-500/10 border-red-500/20 text-red-600'
                                }`}>
                                    {tx.status}
                                </span>
                            </h3>
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                <Clock size={12} />
                                {new Date(tx.timestamp).toLocaleString(undefined, {
                                    dateStyle: 'medium',
                                    timeStyle: 'short'
                                })}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t border-gray-100 dark:border-gray-800 sm:border-t-0 pt-3 sm:pt-0 mt-0">
                        <div className="text-right">
                            <p className={`font-bold text-lg mb-0 break-all ${isSent ? 'text-gray-900 dark:text-gray-100' : 'text-green-600'}`}>
                                {isSent ? '-' : '+'}{Number(tx.value).toFixed(4)} {tx.tokenSymbol}
                            </p>
                            {tx.valueUsd && (
                                <p className="text-xs text-gray-500 font-medium">
                                    ≈ ${tx.valueUsd}
                                </p>
                            )}
                        </div>
                            <a 
                                href={explorerLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-blue-400 hover:text-blue-300 flex items-center justify-end gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                View <ExternalLink size={10} />
                            </a>
                        </div>
                    </div>

                    {expandedTx === tx.hash && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-400 overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">From</span>
                                    <span className="font-mono break-all">{tx.from}</span>
                                </div>
                                <div>
                                    <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">To</span>
                                    <span className="font-mono break-all">{tx.to || 'Contract Creation'}</span>
                                </div>
                                <div className="sm:col-span-2">
                                    <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Transaction Hash</span>
                                    <span className="font-mono break-all">{tx.hash}</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                    </motion.div>
                );
            })}
            
             {hasMore && (
                <div className="flex justify-center pt-4">
                    <button
                        onClick={() => fetchHistory()}
                        disabled={isLoadingActivity}
                        className="px-6 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 hover:border-brand-orange hover:text-brand-orange rounded-full text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoadingActivity ? 'Loading...' : 'Load More'}
                    </button>
                </div>
            )}
        </div>
    </div>
    );
};
