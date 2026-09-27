import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { ChaosBudgetTier, CartItem } from '../types';
import {
  generateSurpriseCart,
  makeCartWorse,
  SurpriseScenario,
} from '../utils/surpriseGenerator';
import { formatPrice, formatRealCost } from '../utils/formatters';
import confetti from 'canvas-confetti';
import {
  X,
  Sparkles,
  RotateCcw,
  Flame,
  ShoppingCart,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Eye,
  Dice5,
  ShieldCheck,
} from 'lucide-react';

export const SurpriseMeModal: React.FC = () => {
  const {
    isSurpriseMeOpen,
    closeSurpriseMe,
    chaosBudgetTier,
    addMultipleToCart,
    setActiveTab,
    openProduct,
    showToast,
    currency,
  } = useStore();

  const [activeTier, setActiveTier] = useState<ChaosBudgetTier | 'random'>(
    chaosBudgetTier || 'random'
  );
  const [items, setItems] = useState<CartItem[]>([]);
  const [scenario, setScenario] = useState<SurpriseScenario | null>(null);
  const [escalationCount, setEscalationCount] = useState(0);
  const [lastEscalationMsg, setLastEscalationMsg] = useState<string | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);

  // Initialize or regenerate when modal opens
  useEffect(() => {
    if (isSurpriseMeOpen) {
      regenerate(activeTier);
      setEscalationCount(0);
      setLastEscalationMsg(null);
    }
  }, [isSurpriseMeOpen]);

  const regenerate = (tierChoice: ChaosBudgetTier | 'random') => {
    setIsShuffling(true);
    const result = generateSurpriseCart(tierChoice === 'random' ? undefined : tierChoice);
    setItems(result.items);
    setScenario(result.scenario);
    setEscalationCount(0);
    setLastEscalationMsg(null);
    setTimeout(() => setIsShuffling(false), 200);
  };

  const handleSelectTier = (tier: ChaosBudgetTier | 'random') => {
    setActiveTier(tier);
    regenerate(tier);
  };

  // ACTION 1: "Reroll"
  const handleReroll = () => {
    regenerate(activeTier);
    showToast('🎲 Rerolled! Fresh batch of financial delirium generated.', 'Zero Liabilities');
  };

  // ACTION 2: "Make It Worse"
  const handleMakeItWorse = () => {
    const result = makeCartWorse(items);
    setItems(result.newItems);
    setEscalationCount((prev) => prev + 1);
    setLastEscalationMsg(result.message);

    // Visual confetti pop with fiery colors
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#ba0900', '#ff5722', '#ff9800', '#1a1c1a'],
    });

    showToast(
      result.message,
      `+${formatPrice(result.escalationDelta, currency, { compact: true })} DELUSION`
    );
  };

  // ACTION 3: "Add All"
  const handleAddAll = () => {
    if (items.length === 0) return;

    // Trigger joyful confetti explosion
    confetti({
      particleCount: 80,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#ba0900', '#006c49', '#ffd700', '#1a1c1a'],
    });

    addMultipleToCart(items);
    closeSurpriseMe();
    setActiveTab('cart');
  };

  if (!isSurpriseMeOpen) return null;

  const total = items.reduce((sum, item) => sum + item.product.msrp * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="relative w-full max-w-lg bg-[#faf9f6] text-[#1a1c1a] rounded-3xl border-4 border-[#1a1c1a] shadow-tactile-lg flex flex-col max-h-[92vh] overflow-hidden my-auto">
        {/* Top Header Bar */}
        <div className="bg-[#e9e8e5] px-4 py-3 border-b-2 border-[#1a1c1a] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#ba0900] text-white flex items-center justify-center font-bold text-xs">
              <Dice5 className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#ba0900]">
                Algorithmic Spree Engine
              </span>
              <span className="text-xs font-black uppercase text-[#1a1c1a]">
                Surprise Me Generator
              </span>
            </div>
          </div>

          <button
            onClick={closeSurpriseMe}
            className="w-8 h-8 rounded-full bg-white hover:bg-[#deddd9] border border-[#1a1c1a] flex items-center justify-center text-[#1a1c1a] transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Container */}
        <div className="p-4 overflow-y-auto flex flex-col gap-4 flex-1">
          {/* Chaos Budget Selector Ribbon */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5d5c5b]">
                Target Delusion Tier:
              </span>
              <span className="text-[10px] font-bold text-[#006c49]">
                Zero Liabilities Guaranteed
              </span>
            </div>

            <div className="grid grid-cols-5 gap-1.5">
              {(
                [
                  { id: '10k', label: '$10K Flex' },
                  { id: '100k', label: '$100K Baller' },
                  { id: '1m', label: '$1M Whale' },
                  { id: 'inf', label: '∞ Unhinged' },
                  { id: 'random', label: '🎲 Absurd' },
                ] as const
              ).map((tab) => {
                const isSelected = activeTier === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleSelectTier(tab.id)}
                    className={`py-2 px-1 rounded-xl text-[10px] font-extrabold uppercase tracking-tight text-center transition-all border ${
                      isSelected
                        ? 'bg-[#1a1c1a] text-white border-[#1a1c1a] shadow-tactile-sm scale-[1.02]'
                        : 'bg-white hover:bg-[#efeeeb] text-[#5d5c5b] border-[#1a1c1a]/20'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scenario Headline & Price Dualism Banner */}
          <div className="bg-white p-4 rounded-2xl border-2 border-[#1a1c1a] shadow-tactile flex flex-col gap-2 relative overflow-hidden">
            {escalationCount > 0 && (
              <div className="absolute top-2 right-2 bg-[#ba0900] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                <Flame className="w-3 h-3" />
                <span>Escalation lvl {escalationCount}</span>
              </div>
            )}

            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#ba0900]">
                {scenario?.title || 'Algorithmic Financial Collapse'}
              </span>
              <p className="text-xs text-[#5d5c5b] mt-0.5 line-clamp-1">
                {scenario?.subtitle || 'Indulge without consequences.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between pt-2 border-t border-[#efeeeb] gap-1">
              <div>
                <span className="text-[10px] font-bold text-[#5d5c5b] uppercase block">
                  Total Fictional Damage
                </span>
                <span className="font-bodoni font-black text-3xl sm:text-4xl text-[#ba0900] tracking-tight leading-none">
                  {formatPrice(total, currency)}
                </span>
              </div>

              <div className="bg-[#6cf8bb]/60 border border-[#006c49]/30 text-[#005236] px-2.5 py-1 rounded-lg self-start sm:self-auto flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#006c49]" />
                <span className="text-xs font-black uppercase">
                  Real Billed: {formatRealCost(currency)}
                </span>
              </div>
            </div>

            {/* Escalation Warning Note */}
            {lastEscalationMsg && (
              <div className="bg-[#ba0900]/10 border border-[#ba0900]/30 rounded-xl p-2.5 text-xs text-[#ba0900] font-semibold flex items-center gap-2 mt-1">
                <AlertTriangle className="w-4 h-4 shrink-0 text-[#ba0900]" />
                <span className="leading-snug">{lastEscalationMsg}</span>
              </div>
            )}
          </div>

          {/* Itemized Generated Cart Cards */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5d5c5b]">
                Generated Items ({items.length})
              </span>
              <span className="text-[10px] text-[#5d5c5b] italic">
                Ready for immediate transfer to ledger
              </span>
            </div>

            <div
              className={`flex flex-col gap-2 transition-opacity ${
                isShuffling ? 'opacity-40' : 'opacity-100'
              }`}
            >
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="bg-white p-3 rounded-xl border border-[#1a1c1a] shadow-sm flex items-center justify-between gap-3 hover:border-[#ba0900] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={product.image}
                      alt={product.title}
                      width={48}
                      height={48}
                      loading="lazy"
                      className="w-12 h-12 rounded-lg object-cover border border-[#1a1c1a]/20 shrink-0"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-bold text-[#ba0900] uppercase tracking-wider">
                        {product.categoryLabel}
                      </span>
                      <span className="font-bold text-xs text-[#1a1c1a] truncate">
                        {quantity > 1 ? `${quantity}x ` : ''}
                        {product.title}
                      </span>
                      <span className="text-[11px] text-[#5d5c5b] line-clamp-1 italic">
                        "{product.hook}"
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0 pl-1">
                    <span className="font-bodoni font-bold text-sm text-[#ba0900]">
                      {formatPrice(product.msrp * quantity, currency, { compact: true })}
                    </span>
                    <button
                      onClick={() => openProduct(product.id)}
                      className="text-[10px] font-semibold text-[#5d5c5b] hover:text-[#1a1c1a] flex items-center gap-0.5 mt-0.5 hover:underline"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Inspect</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Viral Actions Panel (The 3 Core Actions) */}
        <div className="bg-[#f4f3f0] p-4 border-t-2 border-[#1a1c1a] shrink-0 flex flex-col gap-2">
          {/* Main "Add All" Action Button */}
          <button
            onClick={handleAddAll}
            className="w-full bg-[#ba0900] hover:bg-[#920500] text-white py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 border-2 border-[#1a1c1a] shadow-tactile active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add All To Fantasy Ledger ({formatPrice(total, currency, { compact: true })} → $0)</span>
          </button>

          {/* Sub-Actions: "Reroll" and "Make It Worse" */}
          <div className="grid grid-cols-2 gap-2">
            {/* Action 2: Reroll */}
            <button
              onClick={handleReroll}
              className="bg-white hover:bg-[#efeeeb] text-[#1a1c1a] py-2.5 px-3 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 border border-[#1a1c1a] shadow-tactile-sm active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <RotateCcw className="w-4 h-4 text-[#5d5c5b]" />
              <span>Reroll Cart</span>
            </button>

            {/* Action 3: Make It Worse */}
            <button
              onClick={handleMakeItWorse}
              className="bg-[#ffe8e4] hover:bg-[#ffd9d4] text-[#ba0900] py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 border border-[#ba0900] shadow-tactile-sm active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <Flame className="w-4 h-4 text-[#ba0900] animate-bounce" />
              <span>Make It Worse 🔥</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-center text-[#5d5c5b] pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#006c49]" />
            <span className="text-[11px]">
              Everything billed at $0.00. No credit cards harmed.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
