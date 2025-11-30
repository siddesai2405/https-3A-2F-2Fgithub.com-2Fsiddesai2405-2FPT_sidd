import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Calendar,
  Heart,
  MessageCircle,
  Apple,
  Stethoscope,
  BarChart3,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { path: '/', label: 'Home', icon: <Home size={24} /> },
  { path: '/calendar', label: 'Calendar', icon: <Calendar size={24} /> },
  { path: '/mood', label: 'Mood', icon: <Heart size={24} /> },
  { path: '/chat', label: 'Chat', icon: <MessageCircle size={24} /> },
  { path: '/food', label: 'Food', icon: <Apple size={24} /> },
  { path: '/gynecologist', label: 'Doctors', icon: <Stethoscope size={24} /> },
  { path: '/stats', label: 'Stats', icon: <BarChart3 size={24} /> },
  { path: '/settings', label: 'Settings', icon: <Settings size={24} /> },
];

export const BottomNav: React.FC = () => {
  const location = useLocation();

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40',
        'bg-white border-t border-border',
        'dark:bg-card dark:border-border',
        'flex justify-around items-center',
        'h-20 md:h-24 lg:h-20'
      )}
    >
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex flex-col items-center justify-center gap-1',
              'flex-1 h-full py-2 px-1',
              'transition-colors duration-200',
              'hover:bg-secondary hover:text-secondary-foreground',
              isActive
                ? 'text-primary'
                : 'text-muted-foreground'
            )}
          >
            <div className={cn(
              'transition-transform duration-200',
              isActive && 'scale-110'
            )}>
              {item.icon}
            </div>
            <span className="text-xs font-medium truncate">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};
