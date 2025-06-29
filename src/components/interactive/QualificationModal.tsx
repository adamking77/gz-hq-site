import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QualificationForm from './QualificationForm';
import { Button } from '../ui/button';

interface QualificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QualificationModal: React.FC<QualificationModalProps> = ({ isOpen, onClose }) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden bg-background border border-foreground/20 rounded-xl shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-foreground/20 hover:bg-foreground/10 hover:scale-105 transition-all duration-300 flex items-center justify-center group"
              aria-label="Close modal"
            >
              <svg
                className="w-5 h-5 text-foreground/60 group-hover:text-foreground transition-colors duration-200"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 6l12 12M6 18L18 6" />
              </svg>
            </button>

            {/* Scrollable Content */}
            <div className="max-h-[90vh] overflow-y-auto">
              <div className="p-0">
                <QualificationForm onComplete={onClose} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QualificationModal;