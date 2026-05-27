import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Users, MessageSquare, User } from 'lucide-react';

const BottomNav = () => {
  const navItems = [
    { name: 'Feed', path: '/feed', icon: Home, glow: 'cyan' },
    { name: 'Explore', path: '/explore', icon: Compass, glow: 'purple' },
    { name: 'Communities', path: '/community', icon: Users, glow: 'pink' },
    { name: 'Messages', path: '/messages', icon: MessageSquare, glow: 'green' },
    { name: 'Profile', path: '/profile', icon: User, glow: 'purple' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 w-full bg-black/80 backdrop-blur-xl border-t border-white/10 flex justify-around items-center p-3 z-50">
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) => `
            flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300
            ${isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'}
          `}
        >
          {({ isActive }) => (
            <>
              <item.icon size={24} className={isActive ? `text-[var(--neon-${item.glow})] filter drop-shadow-[0_0_8px_var(--neon-${item.glow})]` : ''} />
              <span className={`text-[10px] font-semibold ${isActive ? `text-[var(--neon-${item.glow})]` : 'hidden'} transition-all`}>{item.name}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
