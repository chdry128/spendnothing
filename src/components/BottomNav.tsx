import React from 'react';
import { useStore } from '../store/useStore';
import { TabType } from '../types';
import { formatRealCost } from '../utils/formatters';
import { ShoppingBag, Globe, Gamepad2, ShoppingCart } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, getCartItemCount, currency } = useStore();
  const itemCount = getCartItemCount();

  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'play',
      label: 'Play',
      icon: <ShoppingBag className="w-5 h-5" />,
    },
    {
      id: 'worlds',
      label: 'Worlds',
      icon: <Globe className="w-5 h-5" />,
    },
    {
      id: 'game',
      label: 'Game',
      icon: <Gamepad2 className="w-5 h-5" />,
    },
    {
      id: 'cart',
      label: `Cart (${formatRealCost(currency)})`,
      icon: (
        <div className="relative">
          <ShoppingCart className="w-5 h-5" />
          {itemCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-[#ba0900] text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full min-w-4 text-center border border-white">
              {itemCount}
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <nav aria-label="Primary navigation" className="fixed bottom-0 w-full z-40 bg-[#faf9f6]/95 backdrop-blur-xl border-t border-[#e4e2dc] shadow-[0_-2px_10px_rgba(0,0,0,0.04)]">
      <div className="max-w-3xl mx-auto flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id || (item.id === 'cart' && activeTab === 'receipt');

          return (
            <a
              key={item.id}
              href={item.id === 'play' ? '/#play' : `/#${item.id}`}
              onClick={(event) => {
                event.preventDefault();
                setActiveTab(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center min-w-[64px] py-1 transition-all active:scale-95 ${
                isActive
                  ? 'text-[#ba0900] font-bold'
                  : 'text-[#5d5c5b] hover:text-[#1a1c1a] font-medium'
              }`}
            >
              <div className={`transition-transform ${isActive ? 'scale-110' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[11px] font-bold tracking-wider mt-1 uppercase">
                {item.label}
              </span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#ba0900] mt-0.5 animate-pulse" />
              )}
            </a>
          );
        })}
      </div>
    </nav>
  );
};
