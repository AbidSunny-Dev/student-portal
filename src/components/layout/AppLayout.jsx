import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-surface-900">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main content */}
      <div
        className={`flex flex-col flex-1 min-w-0 transition-all duration-300
          ${collapsed ? 'lg:ml-20' : 'lg:ml-72'}`}
      >
        <Navbar onMenuToggle={() => setCollapsed(!collapsed)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
