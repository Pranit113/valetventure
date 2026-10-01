import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function BottomSheet({ isOpen, onClose, title, children, className }: BottomSheetProps) {
  // Prevent scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
              "fixed bottom-0 left-0 right-0 z-50 bg-surface dark:bg-surface-dark rounded-t-3xl overflow-hidden shadow-xl border-t border-border dark:border-border-dark flex flex-col max-h-[90vh]",
              className
            )}
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-12 h-1.5 rounded-full bg-border dark:bg-border-dark" />
            </div>
            
            <div className="px-5 py-3 flex items-center justify-between border-b border-border dark:border-border-dark">
              {title && <h3 className="font-semibold text-lg">{title}</h3>}
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-surface-2 dark:hover:bg-surface-2-dark -mr-2 ml-auto"
              >
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-5 pb-8 flex-1">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
