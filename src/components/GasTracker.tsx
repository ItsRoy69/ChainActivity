import React, { useEffect } from 'react';
import { Fuel } from 'lucide-react';
import { useWalletStore } from '../store/useWalletStore';

export const GasTracker: React.FC = () => {
    const { gasPrice, fetchGasPrice, selectedChain } = useWalletStore();

    useEffect(() => {
        fetchGasPrice();
        const interval = setInterval(fetchGasPrice, 15000);
        return () => clearInterval(interval);
    }, [fetchGasPrice, selectedChain]);

    if (!gasPrice) return null;

    return (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium text-gray-600 border border-gray-200" title="Current Gas Price">
            <Fuel size={14} className="text-brand-orange" />
            <span>{gasPrice} gwei</span>
        </div>
    );
};
