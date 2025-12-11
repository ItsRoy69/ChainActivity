import React from 'react';
import { useWalletStore } from '../store/useWalletStore';
import { motion } from 'framer-motion';
import { Coins } from 'lucide-react';

export const TokenList: React.FC = () => {
    const { tokens, account } = useWalletStore();

    if (!account) return null;

    if (tokens.length === 0) {
        return (
            <div className="text-center py-20 text-gray-500 glass-panel">
                 <div className="mb-4 text-gray-400 bg-gray-100 w-16 h-16 rounded-full mx-auto flex items-center justify-center">
                    <Coins size={32} />
                </div>
                <p className="text-gray-900 font-medium">No tokens found.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {tokens.map((token, index) => (
                <motion.div 
                    key={token.contractAddress}
                    initial={{ opacity: 0, x: -20, y: 10 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="glass-panel p-4 flex items-center justify-between group hover:bg-white/5 transition-colors"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-200">
                             {token.logo ? (
                                <img src={token.logo} alt={token.name} className="w-full h-full object-cover" />
                             ) : (
                                <span className="font-bold text-gray-500 text-xs">{token.symbol.slice(0, 3)}</span>
                             )}
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">{token.name}</h3>
                            <p className="text-xs text-gray-500">{token.symbol}</p>
                        </div>
                    </div>
                    
                    <div className="text-right">
                        <p className="font-bold text-lg text-gray-900">
                            {Number(token.balance).toLocaleString(undefined, { maximumFractionDigits: 4 })}
                        </p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};
