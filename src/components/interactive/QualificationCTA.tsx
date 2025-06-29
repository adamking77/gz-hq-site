import React from 'react';
import { Button } from '../ui/button';
import { useQualificationModal } from './QualificationModalProvider';

interface QualificationCTAProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  children?: React.ReactNode;
  text?: string;
}

const QualificationCTA: React.FC<QualificationCTAProps> = ({ 
  variant = 'outline',
  size = 'lg', 
  className = '',
  children,
  text = 'Get Started'
}) => {
  // Try to get modal context, fallback if not available
  let openModal: (() => void) | null = null;
  try {
    const context = useQualificationModal();
    openModal = context.openModal;
  } catch (error) {
    // Provider not available, will use fallback
  }
  
  const defaultClassName = "font-light text-base px-8 py-3 border-2 border-foreground/30 rounded-full hover:scale-105 hover:bg-gradient-to-r hover:from-background hover:to-accent/30 transition-all duration-300";
  
  const handleClick = () => {
    if (openModal) {
      openModal();
    } else {
      window.location.href = '/qualification-form';
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={`${defaultClassName} ${className}`}
      onClick={handleClick}
    >
      {children || text}
    </Button>
  );
};

export default QualificationCTA;