import type { ReactNode } from 'react';

import { Header } from './Header';
import { Sidebar } from './Sidebar';

type AppShellProps = {
  children: ReactNode;
};

export const AppShell = ({ children }: AppShellProps) => (
  <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(96,99,238,0.08),_transparent_26%),linear-gradient(180deg,_#fbf8fa_0%,_#f5f3f4_100%)] text-on-surface dark:bg-gray-900 dark:text-gray-100">
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Header />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  </div>
);