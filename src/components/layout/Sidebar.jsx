import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Bell, ClipboardList, Calendar, Users,
  BookOpen, BarChart2, Calculator, FileQuestion, LogOut,
  GraduationCap, Menu, X, Shield, BookMarked, Newspaper,
  UserCog, Settings, User,
} from 'lucide-react';

const studentNavItems = [
  { to: '/dashboard',    icon: LayoutDashboard,  label: 'Dashboard' },
  { to: '/profile',      icon: User,             label: 'My Profile' },
  { to: '/notices',      icon: Bell,              label: 'Notice Board' },
  { to: '/assignments',  icon: ClipboardList,     label: 'Assignments' },
  { to: '/routine',      icon: Calendar,          label: 'Class Routine' },
  { to: '/faculty',      icon: Users,             label: 'Faculty' },
  { to: '/materials',    icon: BookOpen,          label: 'Study Materials' },
  { to: '/results',      icon: BarChart2,         label: 'My Results' },
  { to: '/cgpa',         icon: Calculator,        label: 'CGPA Calculator' },
  { to: '/question-bank',icon: FileQuestion,      label: 'Question Bank' },
];

const adminNavItems = [
  { to: '/admin',              icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/profile',      icon: User,            label: 'My Profile' },
  { to: '/admin/notices',      icon: Newspaper,       label: 'Notices' },
  { to: '/admin/assignments',  icon: ClipboardList,   label: 'Assignments' },
  { to: '/admin/faculty',      icon: Users,           label: 'Faculty' },
  { to: '/admin/materials',    icon: BookOpen,        label: 'Materials' },
  { to: '/admin/results',      icon: BarChart2,       label: 'Results' },
  { to: '/admin/questions',    icon: FileQuestion,    label: 'Question Bank' },
  { to: '/admin/students',     icon: UserCog,         label: 'Students' },
  { to: '/admin/routine',      icon: Calendar,        label: 'Routine' },
];

export const Sidebar = ({ collapsed, setCollapsed }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = currentUser?.role === 'admin';
  const navItems = isAdmin ? adminNavItems : studentNavItems;
  const profileUrl = isAdmin ? '/admin/profile' : '/profile';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full z-30 flex flex-col
          bg-surface-800 border-r border-white/5
          transition-all duration-300 ease-in-out
          ${collapsed ? '-translate-x-full lg:translate-x-0 lg:w-20' : 'translate-x-0 w-72 lg:w-72'}`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5 min-h-[72px]">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-500/20">
            <GraduationCap size={20} className="text-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0 animate-fade-in">
              <p className="font-display font-bold text-sm text-white leading-tight">Metropolitan</p>
              <p className="text-xs text-white/40 leading-tight">University, Sylhet</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto text-white/40 hover:text-white transition-colors hidden lg:block"
          >
            {collapsed ? <Menu size={18} /> : <X size={18} />}
          </button>
        </div>

        {/* Role badge */}
        {!collapsed && (
          <div className="px-4 pt-3 pb-1 animate-fade-in">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium
              ${isAdmin ? 'bg-accent-500/10 text-accent-400 border border-accent-500/20' : 'bg-primary-500/10 text-primary-400 border border-primary-500/20'}`}>
              {isAdmin ? <Shield size={12} /> : <BookMarked size={12} />}
              {isAdmin ? 'Admin Panel' : `CSE | Batch 61 | Sec F`}
            </div>
          </div>
        )}

        {/* Nav items */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin' || to === '/dashboard'}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? 'active' : ''} ${collapsed ? 'justify-center' : ''}`
              }
              title={collapsed ? label : undefined}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span className="animate-fade-in">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User info + logout */}
        <div className="border-t border-white/5 p-3">
          {!collapsed && (
            <div
              onClick={() => navigate(profileUrl)}
              className="flex items-center gap-3 px-3 py-2 mb-2 animate-fade-in hover:bg-white/5 rounded-xl cursor-pointer transition-colors group"
              title="View Profile"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0 group-hover:scale-105 transition-transform">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white truncate group-hover:text-primary-300 transition-colors">{currentUser?.name}</p>
                <p className="text-xs text-white/40 truncate">{currentUser?.email}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={`sidebar-item w-full text-red-400 hover:text-red-300 hover:bg-red-500/10
              ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
