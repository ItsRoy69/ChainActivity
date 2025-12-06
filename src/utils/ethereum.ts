import { ethers } from 'ethers';
import { ChainId, Transaction } from '../types';
import { CHAINS } from './chains';


const generateMockTransactions = (address: string, chainId: ChainId): Transaction[] => {
  const chainName = CHAINS[chainId].name;
  const symbol = CHAINS[chainId].currency;
  
  return Array.from({ length: 5 }).map((_, i) => ({
    hash: ethers.hexlify(ethers.randomBytes(32)),
    from: i % 2 === 0 ? address : ethers.hexlify(ethers.randomBytes(20)),
    to: i % 2 === 0 ? ethers.hexlify(ethers.randomBytes(20)) : address,
    value: ethers.formatEther(ethers.parseEther((Math.random() * 2).toFixed(4))),
    timestamp: Date.now() - (i * 3600 * 1000) - (Math.random() * 1000 * 60),
    status: i === 0 ? 'pending' : 'confirmed',
    chainId,
    tokenSymbol: symbol,
  }));
};

export const fetchWalletHistory = async (address: string, chainId: ChainId): Promise<Transaction[]> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  try {     
     return generateMockTransactions(address, chainId);
  } catch (error) {
    console.error("Failed to fetch history", error);
    throw error;
  }
};
