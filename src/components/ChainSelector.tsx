import React from 'react';
import { useWalletStore } from '../store/useWalletStore';
import { SUPPORTED_CHAINS } from '../utils/chains';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export const ChainSelector: React.FC = () => {
    const { selectedChain, selectChain } = useWalletStore();

    return (
        <div className="flex bg-glass p-1 rounded-xl border border-glassBorder backdrop-blur-sm overflow-x-auto no-scrollbar max-w-full">
            {SUPPORTED_CHAINS.map((chain) => {
                const isSelected = selectedChain === chain.id;
                return (
                    <button
                        key={chain.id}
                        onClick={() => selectChain(chain.id)}
                        className={clsx(
                            "relative px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap outline-none",
                            isSelected ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        {isSelected && (
                            <motion.div
                                layoutId="activeChain"
                                className="absolute inset-0 bg-brand-orange/20 rounded-lg"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10">{chain.name}</span>
                    </button>
                );
            })}
        </div>
    );
};
