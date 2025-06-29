import React, { createContext, useContext, useState } from 'react';
import QualificationModal from './QualificationModal';

interface QualificationModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const QualificationModalContext = createContext<QualificationModalContextType | undefined>(undefined);

export const useQualificationModal = () => {
  const context = useContext(QualificationModalContext);
  if (!context) {
    throw new Error('useQualificationModal must be used within a QualificationModalProvider');
  }
  return context;
};

interface QualificationModalProviderProps {
  children: React.ReactNode;
}

export const QualificationModalProvider: React.FC<QualificationModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <QualificationModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
      <QualificationModal isOpen={isOpen} onClose={closeModal} />
    </QualificationModalContext.Provider>
  );
};