import { Menu, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar = ({ onMenuToggle }) => {
  const { currentUser, notices } = useAuth();
  const unread = notices?.filter(n => n.isNew).length || 0;

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-BD', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <header className="h-16 bg-surface-800/60 backdrop-blur-sm border-b border-white/5 flex items-center px-4 gap-4">
      <button
        onClick={onMenuToggle}
        className="text-white/60 hover:text-white transition-colors lg:hidden"
      >
        <Menu size={22} />
      </button>

      <div className="flex-1">
        <p className="text-xs text-white/40">{dateStr}</p>
        <p className="text-sm font-semibold text-white">
          {currentUser?.role === 'admin' ? '⚙ Admin Panel' : `Semester 3.1 — Section F`}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <div className="relative">
          <button className="w-9 h-9 rounded-xl bg-surface-700 border border-white/5 flex items-center justify-center text-white/60 hover:text-white transition-colors">
            <Bell size={16} />
          </button>
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </div>

        {/* User avatar */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-primary-500/20">
          {currentUser?.name?.charAt(0) || 'U'}
        </div>
      </div>
    </header>
  );
};
