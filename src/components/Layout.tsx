import React from 'react';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white font-sans text-[#333333]">
      <header className="flex justify-between items-center py-4 px-6 md:px-10 max-w-[1440px] mx-auto w-full">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center">
              <span className="font-bold text-white text-lg">C</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-[#1A1A1A]">ChainActivity</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6 text-gray-500 font-medium">
            <a href="#" className="hover:text-brand-orange transition-colors">Portfolio</a>
            <a href="#" className="hover:text-brand-orange transition-colors">Swap</a>
            <a href="#" className="hover:text-brand-orange transition-colors">Community</a>
            <a href="#" className="hover:text-brand-orange transition-colors">Portfolio API</a>
            <a href="#" className="hover:text-brand-orange transition-colors">More</a>
          </nav>
        </div>

        <div>
           <button className="text-brand-orange hover:text-[#45b045] font-medium border-b border-brand-orange/30 hover:border-brand-orange transition-all pb-0.5">
             Connect Wallet
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