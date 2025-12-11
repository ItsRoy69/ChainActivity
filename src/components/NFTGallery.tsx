import React from 'react';
import { useWalletStore } from '../store/useWalletStore';
import { motion } from 'framer-motion';
import { Image as ImageIcon } from 'lucide-react';

export const NFTGallery: React.FC = () => {
    const { nfts, account } = useWalletStore();

    if (!account) return null;

    if (nfts.length === 0) {
        return (
            <div className="text-center py-20 text-gray-500 glass-panel">
                 <div className="mb-4 text-gray-400 bg-gray-100 w-16 h-16 rounded-full mx-auto flex items-center justify-center">
                    <ImageIcon size={32} />
                </div>
                <p className="text-gray-900 font-medium">No NFTs found.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {nfts.map((nft, index) => (
                <motion.div 
                    key={`${nft.contractAddress}-${nft.tokenId}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="glass-panel overflow-hidden group hover:scale-[1.02] transition-transform duration-200"
                >
                    <div className="aspect-square bg-gray-100 relative overflow-hidden">
                        {nft.image ? (
                            <img src={nft.image} alt={nft.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                                <ImageIcon size={40} />
                            </div>
                        )}
                        <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/50 backdrop-blur-md rounded-full text-[10px] text-white font-medium uppercase">
                            {nft.type}
                        </div>
                    </div>
                    
                    <div className="p-3">
                        <h3 className="font-bold text-gray-900 truncate text-sm" title={nft.name}>{nft.name}</h3>
                        <p className="text-xs text-gray-500 truncate" title={nft.collectionName}>{nft.collectionName}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};
