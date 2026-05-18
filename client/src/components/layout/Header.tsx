import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { useEffect, useState } from 'react';

export const Header = () => {
  const { user, logout } = useAuth();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('smart-leads-dark');
    const initial = stored ? stored === '1' : false;
    setDark(initial);
    document.documentElement.classList.toggle('dark', initial);
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('smart-leads-dark', next ? '1' : '0');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-outline-variant bg-surface/95 backdrop-blur dark:border-gray-700 dark:bg-gray-800/95">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-on-surface-variant dark:text-gray-400">Smart Leads</div>
          <h1 className="text-xl font-bold tracking-tight text-primary dark:text-white sm:text-3xl">Lead Management Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={toggleDark}>
            <span className="material-symbols-outlined dark:text-yellow-400">{dark ? 'dark_mode' : 'light_mode'}</span>
          </Button>
          <div className="hidden flex-col items-end sm:flex">
            <span className="text-sm font-semibold text-primary dark:text-white">{user?.name ?? 'User'}</span>
            <span className="text-xs text-on-surface-variant dark:text-gray-400">{user?.email ?? ''}</span>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant bg-surface-container-low text-outline dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300">
            <span className="material-symbols-outlined">person</span>
          </div>
          <Button variant="ghost" onClick={logout}>
            <span className="material-symbols-outlined text-[18px] dark:text-gray-300">logout</span>
            <span className="hidden sm:inline dark:text-gray-300">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};