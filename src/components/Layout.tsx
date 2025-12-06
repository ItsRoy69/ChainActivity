import React from 'react';
import { motion } from 'framer-motion';
interface LayoutProps {
  children: React.ReactNode;
}
export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <header className="flex justify-between items-center mb-8 px-2 md:px-0">
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            ChainActivity
          </h1>
          <p className="text-gray-400 text-sm mt-1">Multi-chain Wallet Dashboard</p>
        </div>
      </header>
      
      <main className="space-y-6">
        {children}
      </main>
      
      <footer className="mt-12 text-center text-gray-600 text-sm py-4">
        <p>Built for Assessment • {new Date().getFullYear()}</p>
      </footer>
    </motion.div>
  );
};