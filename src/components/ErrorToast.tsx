import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';
import { useWalletStore } from '../store/useWalletStore';

export const ErrorToast: React.FC = () => {
  const error = useWalletStore((state) => state.error);
  const clearError = useWalletStore((state) => state.clearError);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  return (
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-50 max-w-md w-full"
        >
          <div className="bg-[#1A1A1A] border border-red-500/30 text-white p-4 rounded-xl shadow-2xl flex items-start gap-3 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
            
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            
            <div className="flex-1 mr-4">
              <h4 className="font-bold text-sm text-red-100 mb-1">Error Occurred</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                {error}
              </p>
            </div>

            <button 
              onClick={clearError}
              className="p-1 hover:bg-white/5 rounded-full transition-colors text-gray-500 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
