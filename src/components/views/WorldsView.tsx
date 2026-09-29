import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { PRODUCTS } from '../../data/products';
import { CategoryId, ChaosBudgetTier } from '../../types';
import { ProductCard } from '../ProductCard';
import { formatPrice } from '../../utils/formatters';
import { Sliders, Quote } from 'lucide-react';

export const WorldsView: React.FC = () => {
  const { chaosBudgetTier, setChaosBudgetTier, currency } = useStore();
  const [selectedSector, setSelectedSector] = useState<CategoryId>('all');

  const budgetCaps: Record<ChaosBudgetTier, number> = {
    '10k': 10000,
    '100k': 100000,
    '1m': 1000000,
    'inf': Infinity,
  };

  const indicatorLabels: Record<ChaosBudgetTier, string> = {
    '10k': 'SAFE DELUSIONS ONLY',
    '100k': 'POOR LIFE CHOICES',
    '1m': 'DEBT CONNOISSEUR',
    'inf': 'UNFILTERED IMPULSE',
  };

  const sectors: { id: CategoryId; label: string }[] = [
    { id: 'all', label: 'All Worlds' },
    { id: 'tech', label: "Tech I Don't Need" },
    { id: 'cars', label: 'Dream Cars' },
    { id: 'home', label: 'Dream Home' },
    { id: 'fashion', label: 'Fashion Flex' },
    { id: 'gaming', label: 'Gaming' },
    { id: 'travel', label: 'Travel' },
    { id: 'luxury', label: 'Luxury' },
    { id: 'food', label: 'Food' },
    { id: 'nostalgia', label: 'Nostalgia' },
    { id: 'collectibles', label: 'Collectibles' },
    { id: 'weird', label: 'Weird Stuff' },
    { id: 'why-exist', label: 'Why Does This Exist' },
    { id: 'rich', label: 'Rich Person Behavior' },
    { id: 'dream', label: 'Dream Life' },
    { id: 'absurd', label: 'Absurd' },
  ];

  // Filter products by sector and chaos budget
  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesSector = selectedSector === 'all' || p.category === selectedSector;
    const matchesBudget = p.msrp <= budgetCaps[chaosBudgetTier];
    return matchesSector && matchesBudget;
  });

  return (
    <div className="flex flex-col gap-6 pt-1 pb-16 max-w-7xl mx-auto">
      {/* Sticky Horizon Filter Ribbon */}
      <section className="sticky top-28 z-30 bg-[#faf9f6]/95 backdrop-blur-md pb-2 pt-1 border-b border-[#e4e2dc]/60">
        <div className="flex items-center justify-between px-4 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ba0900] animate-pulse" />
            <span className="text-[11px] font-extrabold tracking-widest uppercase text-[#5d5c5b]">
              Curated Sectors ({sectors.length - 1} Worlds)
            </span>
          </div>
          <span className="text-[10px] font-extrabold text-[#006c49] tracking-widest uppercase bg-[#6cf8bb]/40 border border-[#006c49]/20 px-2 py-0.5 rounded-full">
            {filteredProducts.length} Exhibits Matching
          </span>
        </div>

        {/* Horizontal Category Ribbon with all 15 categories */}
        <div className="flex items-center gap-2 overflow-x-auto px-4 no-scrollbar py-1">
          {sectors.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setSelectedSector(sec.id)}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all active:scale-95 border ${
                selectedSector === sec.id
                  ? 'bg-[#1a1c1a] text-white border-[#1a1c1a] shadow-sm'
                  : 'bg-[#e9e8e5] text-[#5d5c5b] hover:bg-[#e3e2e0] border-transparent'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>
      </section>

      {/* Chaos Budget Selector Bar */}
      <section className="px-4">
        <div className="bg-[#f4f3f0] p-3 rounded-2xl border border-[#1a1c1a] shadow-tactile-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-[#ba0900]" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#1a1c1a]">
                Chaos Budget Tier
              </span>
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#ba0900]">
              {indicatorLabels[chaosBudgetTier]}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {(
              [
                { tier: '10k', title: formatPrice(10000, currency, { compact: true }), sub: 'Small' },
                { tier: '100k', title: formatPrice(100000, currency, { compact: true }), sub: 'Bad Idea' },
                { tier: '1m', title: formatPrice(1000000, currency, { compact: true }), sub: 'Serious?' },
                { tier: 'inf', title: '∞ MAX', sub: 'Ascended' },
              ] as const
            ).map((b) => (
              <button
                key={b.tier}
                onClick={() => setChaosBudgetTier(b.tier)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all border active:scale-95 ${
                  chaosBudgetTier === b.tier
                    ? 'bg-[#ba0900] text-white border-[#1a1c1a] shadow-tactile-sm'
                    : 'bg-[#efeeeb] text-[#1a1c1a] hover:bg-[#e3e2e0] border-[#1a1c1a]/15'
                }`}
              >
                <span className="text-[10px] font-black uppercase tracking-wider">
                  {b.title}
                </span>
                <span className="text-[10px] font-semibold opacity-90 truncate">
                  {b.sub}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Curated In-Stream Vignette */}
      <section className="px-4">
        <div className="bg-[#e9e8e5] p-4 rounded-2xl border border-[#1a1c1a] shadow-tactile-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#ba0900]">
              Curator Commentary
            </span>
            <Quote className="w-4 h-4 text-[#5d5c5b]" />
          </div>
          <p className="font-bodoni italic text-base text-[#1a1c1a] leading-snug">
            "Consumerism is the highest form of fiction. Here, your cart is just speculative creative writing."
          </p>
          <div className="mt-2 text-right">
            <span className="text-[10px] font-bold text-[#5d5c5b] uppercase">
              — Fake Shopping Journal, Issue No. 12
            </span>
          </div>
        </div>
      </section>

      {/* Product Grid / Section Stream */}
      <section className="px-4 flex flex-col gap-4">
        {filteredProducts.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-[#1a1c1a] text-center flex flex-col items-center gap-2">
            <p className="text-sm font-bold text-[#1a1c1a]">
              No delusions match this budget and sector.
            </p>
            <p className="text-xs text-[#5d5c5b]">
              Try setting your Chaos Budget Tier to ∞ MAX for unfiltered absurdity.
            </p>
            <button
              onClick={() => {
                setChaosBudgetTier('inf');
                setSelectedSector('all');
              }}
              className="mt-2 bg-[#ba0900] text-white text-xs font-bold px-3 py-1.5 rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                actionLabel={
                  product.category === 'tech'
                    ? 'Acquire Delusion'
                    : product.category === 'rich'
                    ? 'Buy Out of Spite'
                    : product.category === 'dream'
                    ? 'Claim Sanctuary'
                    : product.category === 'cars'
                    ? 'Floor The Gas'
                    : product.category === 'fashion'
                    ? 'Drape in Hubris'
                    : '+ Add to Fantasy'
                }
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
