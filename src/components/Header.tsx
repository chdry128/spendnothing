import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Currency } from '../types';
import { formatPrice, formatRealCost } from '../utils/formatters';
import { Sparkles, ChevronDown, User, ShieldCheck, Trophy, RotateCcw } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    getTotalMSRP,
    currency,
    setCurrency,
    surpriseImpulseBuy,
    openSurpriseMe,
    setActiveTab,
    userProfile,
    clearCart,
  } = useStore();

  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const total = getTotalMSRP();

  const currencyLabels: Record<Currency, string> = {
    USD: 'USD $',
    EUR: 'EUR €',
    GBP: 'GBP £',
    JPY: 'JPY ¥',
    FANTASY: 'FANTASY ₣',
  };

  return (
    <header className="fixed top-0 w-full z-40 bg-[#faf9f6]/90 backdrop-blur-xl border-b border-[#e4e2dc] shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col gap-2">
        {/* Top line: Logo & Brand + Currency + Real Money $0 + Profile */}
        <div className="flex items-center justify-between">
          {/* Logo & Dropdown */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('play')}
              className="flex items-center gap-2 group text-left transition-transform active:scale-95"
            >
              {/* Distinctive Logo Icon matching Google Stitch mockups */}
              <div className="relative w-8 h-8 rounded-lg bg-[#1a1c1a] flex items-center justify-center shadow-sm">
                <span className="text-white font-extrabold text-base tracking-tighter font-sans">U</span>
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#ba0900] rounded-full border-2 border-[#1a1c1a] animate-pulse"></span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-bodoni font-bold text-lg uppercase tracking-tight text-[#1a1c1a]">
                  Unlimited Shopping
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#ba0900]">
                  Spend Nothing
                </span>
              </div>
            </button>

            {/* Currency selector */}
            <div className="relative">
              <button
                onClick={() => setCurrencyOpen(!currencyOpen)}
                className="flex items-center gap-0.5 px-2 py-1 text-xs font-semibold text-[#5d5c5b] bg-[#efeeeb] hover:bg-[#e3e2e0] rounded transition-colors"
                title="Select Fictional Currency"
              >
                <span>{currencyLabels[currency]}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#5d5c5b]" />
              </button>

              {currencyOpen && (
                <div className="absolute left-0 mt-1 w-32 bg-white rounded-lg shadow-tactile border border-[#1a1c1a] z-50 py-1 text-xs">
                  {(['USD', 'EUR', 'GBP', 'JPY', 'FANTASY'] as Currency[]).map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setCurrency(c);
                        setCurrencyOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-[#efeeeb] flex items-center justify-between ${
                        currency === c ? 'font-bold text-[#ba0900]' : 'text-[#1a1c1a]'
                      }`}
                    >
                      <span>{c}</span>
                      {currency === c && <span>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right cluster: Surprise Me + Real Money $0 + Profile Avatar */}
          <div className="flex items-center gap-2">
            <button
              onClick={openSurpriseMe}
              className="bg-[#1a1c1a] hover:bg-[#333] text-white text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
              title="Surprise Me (Random Spree Generator)"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#ffd700]" />
              <span className="hidden sm:inline">Surprise Me</span>
            </button>

            <div className="bg-[#6cf8bb]/80 border border-[#006c49]/20 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#006c49]" />
              <span className="text-[11px] font-extrabold text-[#00714d] tracking-wider uppercase">
                Real: {formatRealCost(currency)}
              </span>
            </div>

            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-8 h-8 rounded-full bg-[#ba0900] text-white flex items-center justify-center hover:opacity-95 active:scale-95 transition-transform shadow-sm"
                title="User Dossier"
              >
                <User className="w-4 h-4 text-white" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-tactile-lg border-2 border-[#1a1c1a] z-50 p-3 flex flex-col gap-2">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#e4e2dc]">
                    <div className="w-9 h-9 rounded-full bg-[#ba0900] text-white flex items-center justify-center font-bold font-bodoni text-sm">
                      OK
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-xs text-[#1a1c1a] truncate">{userProfile.handle}</span>
                      <span className="text-[10px] text-[#ba0900] font-bold uppercase">{userProfile.prestige}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 text-xs text-[#5d5c5b]">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="font-bold text-[#1a1c1a]">{userProfile.statusTier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lifetime Fake Spent:</span>
                      <span className="font-bold text-[#ba0900]">{formatPrice(userProfile.totalFakeSpent, currency, { compact: true })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gauntlet Wins:</span>
                      <span className="font-bold text-[#006c49]">{userProfile.wins}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#e4e2dc] flex flex-col gap-1.5">
                    <button
                      onClick={() => {
                        setActiveTab('game');
                        setProfileOpen(false);
                      }}
                      className="w-full bg-[#efeeeb] hover:bg-[#e3e2e0] text-[#1a1c1a] font-bold py-1.5 rounded text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Trophy className="w-3.5 h-3.5 text-[#ba0900]" />
                      <span>Open Arena Challenges</span>
                    </button>
                    <button
                      onClick={() => {
                        clearCart();
                        setProfileOpen(false);
                      }}
                      className="w-full text-left px-2 py-1 text-[11px] text-[#ba1a1a] hover:underline flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset / Flush Current Cart</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Second Row: Imaginary Cart tally + Surprise Me Action Button */}
        <div className="flex items-center justify-between bg-[#f4f3f0] px-3 py-1.5 rounded-lg border border-[#e4e2dc]/60">
          <button
            onClick={() => setActiveTab('cart')}
            className="flex items-baseline gap-2 group text-left"
          >
            <span className="text-[11px] font-bold tracking-widest text-[#5d3f3a] uppercase">
              Imaginary Cart:
            </span>
            <span className="font-bodoni font-bold text-xl text-[#ba0900] group-hover:underline transition-all">
              {formatPrice(total, currency)}
            </span>
          </button>

          <button
            onClick={surpriseImpulseBuy}
            className="flex items-center gap-1.5 bg-[#e3e2e0] hover:bg-[#d5d4d1] active:scale-95 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider text-[#1a1c1a] border border-[#1a1c1a]/10 transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#ba0900]" />
            <span>Surprise Me</span>
          </button>
        </div>
      </div>
    </header>
  );
};
