import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', icon: 'dashboard', to: '/app', end: true }
];

export const Sidebar = () => (
  <aside className="hidden w-72 shrink-0 border-r border-outline-variant bg-surface dark:border-gray-700 dark:bg-gray-800 lg:flex lg:flex-col">
    <div className="flex items-center gap-3 px-6 py-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-sm font-bold text-white dark:bg-blue-600">SL</div>
      <div>
        <div className="text-lg font-bold text-primary dark:text-white">Smart Leads</div>
        <div className="text-xs text-on-surface-variant dark:text-gray-400">Lead Management</div>
      </div>
    </div>
    <nav className="flex flex-col gap-2 px-4">
      {navItems.map((item) => (
        <NavLink
          key={item.label}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-colors ${
              isActive ? 'bg-secondary-fixed text-on-secondary-fixed shadow-soft dark:bg-blue-600 dark:text-white' : 'text-on-surface-variant hover:bg-surface-container-high dark:text-gray-300 dark:hover:bg-gray-700'
            }`
          }
        >
          <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  </aside>
);
