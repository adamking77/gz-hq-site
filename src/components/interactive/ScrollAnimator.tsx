import React, { type PropsWithChildren } from 'react';
import { useScrollTrigger } from '../../hooks/useScrollTrigger'; // Adjusted path

interface ScrollAnimatorProps extends PropsWithChildren {
  animationClass: string;
  threshold?: number;
  rootMargin?: string;
}

export function ScrollAnimator({
  children,
  animationClass,
  threshold,
  rootMargin,
}: ScrollAnimatorProps) {
  const { ref, isVisible } = useScrollTrigger({ threshold, rootMargin });

  return (
    <div ref={ref} className={isVisible ? animationClass : ''}>
      {children}
    </div>
  );
}
// export default ScrollAnimator; // Changed to named export