import React, { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export default function Toast({ message, isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 20, x: '-50%' }}
          className="fixed bottom-24 left-1/2 bg-slate-900/95 text-white px-4 py-2.5 rounded-full text-[13px] font-bold shadow-xl flex items-center gap-2 z-[9999] whitespace-nowrap"
        >
          <CheckCircle2 size={16} className="text-green-400" />
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
