import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Users, MessageSquare, Bell, Settings, User } from 'lucide-react';
import { useSelector } from 'react-redux';

const Sidebar = () => {
  const { user } = useSelector(state => state.auth);

  const navItems = [
    { name: 'Feed', path: '/feed', icon: Home, glow: 'cyan' },
    { name: 'Explore', path: '/explore', icon: Compass, glow: 'purple' },
    { name: 'Communities', path: '/community', icon: Users, glow: 'pink' },
    { name: 'Messages', path: '/messages', icon: MessageSquare, glow: 'green' },
    { name: 'Notifications', path: '/notifications', icon: Bell, glow: 'cyan' },
    { name: 'Profile', path: '/profile', icon: User, glow: 'purple' },
    { name: 'Settings', path: '/settings', icon: Settings, glow: 'pink' },
  ];

  return (
    <aside className="hidden md:flex w-[260px] h-screen bg-black/40 backdrop-blur-lg border-r border-white/5 flex-col p-6 sticky top-0 shrink-0">
      <div className="mb-12 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-purple)] animate-pulse-neon shadow-[0_0_20px_rgba(0,245,255,0.4)]"></div>
        <h1 className="text-3xl font-black tracking-widest neon-text-cyan">WISPR</h1>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300
              ${isActive ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon size={22} className={isActive ? `text-[var(--neon-${item.glow})] filter drop-shadow-[0_0_8px_var(--neon-${item.glow})]` : ''} />
                <span className={`font-semibold ${isActive ? 'tracking-wider' : ''} transition-all`}>{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {user && (
        <div className="mt-auto pt-6 border-t border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 border border-white/10 flex items-center justify-center font-bold text-[var(--neon-cyan)]">
            {user.username?.[0]?.toUpperCase() || 'W'}
          </div>
          <div>
            <div className="font-bold text-sm text-white">{user.username}</div>
            <div className="text-xs text-[var(--neon-purple)]">{user.tier || 'Phantom'}</div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
