import React, { useEffect, useState, useCallback } from 'react';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

const THEME_CHANGE_REQUEST_EVENT = 'theme-change-request';
const THEME_ACTUALLY_CHANGED_EVENT = 'theme-actually-changed';

export function ThemeToggle() {
  const [currentActualTheme, setCurrentActualTheme] = useState<'light' | 'dark' | undefined>(undefined);

  useEffect(() => {
    // On mount, read the theme from the DOM
    const initialTheme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark';
    setCurrentActualTheme(initialTheme);

    const handleActualThemeChange = (event: Event) => {
      const { actualTheme } = (event as CustomEvent).detail;
      setCurrentActualTheme(actualTheme);
    };
    document.addEventListener(THEME_ACTUALLY_CHANGED_EVENT, handleActualThemeChange);

    const root = window.document.documentElement;
    const observerCallback = () => {
      const newActual = root.getAttribute('data-theme') as 'light' | 'dark';
      if (newActual && newActual !== currentActualTheme) {
        setCurrentActualTheme(newActual);
      }
    };
    const observer = new MutationObserver(observerCallback);
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    
    return () => {
      document.removeEventListener(THEME_ACTUALLY_CHANGED_EVENT, handleActualThemeChange);
      observer.disconnect();
    };
  }, []); // Empty dependency array

  const isActuallyDark = currentActualTheme === 'dark';

  const handleToggle = useCallback(() => {
    const newPreference = isActuallyDark ? 'light' : 'dark';
    document.dispatchEvent(new CustomEvent(THEME_CHANGE_REQUEST_EVENT, { detail: { theme: newPreference } }));
  }, [isActuallyDark]);

  if (currentActualTheme === undefined) {
    return <div className="w-[50px] h-[26px] bg-transparent" />; // Render a transparent placeholder
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isActuallyDark}
      onClick={handleToggle}
      className={cn(
        "relative inline-flex items-center justify-center w-[50px] h-[26px] rounded-full p-0.5 transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isActuallyDark ? "bg-slate-700" : "bg-slate-200"
      )}
    >
      <span className="sr-only">Toggle theme</span>
      <span aria-hidden="true" className={cn(
        "absolute left-[4px] transition-opacity duration-300 ease-in-out",
        isActuallyDark ? "opacity-50" : "opacity-100"
      )}>
        <Sun className="w-4 h-4 text-slate-800 dark:text-slate-300" />
      </span>
      <span aria-hidden="true" className={cn(
        "absolute right-[4px] transition-opacity duration-300 ease-in-out",
        isActuallyDark ? "opacity-100" : "opacity-50"
      )}>
        <Moon className="w-4 h-4 text-slate-800 dark:text-slate-300" />
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none inline-block w-[20px] h-[20px] transform rounded-full bg-white shadow-lg ring-0 transition-transform duration-300 ease-in-out",
          isActuallyDark ? "translate-x-[12px]" : "translate-x-[-12px]"
        )}
      />
    </button>
  );
}