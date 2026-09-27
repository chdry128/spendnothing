import React, { useRef, useState } from 'react';
import { useStore } from '../../store/useStore';
import { PRODUCTS } from '../../data/products';
import { ProductCard } from '../ProductCard';
import { formatPrice, formatRealCost } from '../../utils/formatters';
import { buildShareableRemixUrl } from '../../utils/remixCodec';
import { ShareSheetModal } from '../ShareSheetModal';
import { ArrowRight, Flame, Share2, Sparkles, Users, Shuffle, Dice5 } from 'lucide-react';

export const PlayView: React.FC = () => {
  const {
    getTotalMSRP,
    getCartItemCount,
    openSurpriseMe,
    cart,
    userProfile,
    showToast,
    currency,
  } = useStore();
  const catalogRef = useRef<HTMLDivElement>(null);
  const [productLimit, setProductLimit] = useState(8);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const total = getTotalMSRP();
  const itemCount = getCartItemCount();

  const handleStartSpree = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleShareChallenge = () => {
    setIsShareModalOpen(true);
  };

  const displayedProducts = PRODUCTS.slice(0, productLimit);

  return (
    <div className="flex flex-col gap-6 pt-2 pb-12 max-w-md mx-auto px-4">
      {/* Editorial Poster Hero Section */}
      <section className="flex flex-col gap-2 pt-1">
        <div className="flex items-center gap-2">
          <span className="bg-[#e3e2e0] text-[#1a1c1a] px-2 py-0.5 rounded text-[11px] font-extrabold uppercase tracking-widest border border-[#1a1c1a]/10">
            Paris Issue Nº 01
          </span>
          <span className="bg-[#ba0900] text-white px-2 py-0.5 rounded text-[11px] font-extrabold uppercase tracking-widest border border-[#1a1c1a]/20">
            Zero Liabilities
          </span>
        </div>

        <div className="flex flex-col leading-none mt-1">
          <h1 className="font-bodoni font-bold text-4xl uppercase text-[#1a1c1a] tracking-tight">
            Shop Anything.{' '}
            <span className="text-[#ba0900]">Spend Nothing.</span>
          </h1>
        </div>

        <p className="text-sm text-[#5d5c5b] leading-relaxed max-w-sm mt-1">
          What would you buy if money didn't matter? Indulge every irrational financial urge with absolute impunity.
        </p>

        {/* Hero CTA Cluster */}
        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={handleStartSpree}
            className="w-full bg-[#ba0900] hover:bg-[#920500] text-white min-h-[48px] py-2.5 px-4 rounded-xl shadow-tactile border border-[#1a1c1a] flex items-center justify-between text-xs font-extrabold uppercase tracking-wider active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            <span>Start The Reckless Spree</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={openSurpriseMe}
            className="w-full bg-[#f4f3f0] hover:bg-[#e9e8e5] text-[#1a1c1a] min-h-[44px] py-2 px-4 rounded-xl shadow-tactile-sm border border-[#1a1c1a] flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            <Sparkles className="w-4 h-4 text-[#ba0900]" />
            <span>🎲 Surprise Me (Random Spree Generator)</span>
          </button>
        </div>
      </section>

      {/* Live Financial Ledger & Zero-Spend Comparison Dashboard */}
      <section className="bg-white rounded-2xl p-4 border border-[#1a1c1a] shadow-tactile flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#5d5c5b]">
            Audit Ledger Statement
          </span>
          <span className="bg-[#6cf8bb]/60 border border-[#006c49]/30 text-[#005236] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-sm uppercase">
            <span className="w-2 h-2 rounded-full bg-[#006c49] animate-pulse" />
            100% Fictional
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* Real Money Column */}
          <div className="bg-[#f4f3f0] p-3 rounded-xl border border-[#e4e2dc] flex flex-col justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5d5c5b]">
              Real Money Owed
            </span>
            <div className="my-1.5">
              <span className="font-bodoni font-bold text-2xl text-[#006c49]">
                {formatRealCost(currency)}
              </span>
            </div>
            <span className="text-[11px] text-[#5d5c5b] font-medium">
              Guaranteed forever
            </span>
          </div>

          {/* Fantasy Money Column */}
          <div className="bg-[#e9e8e5] p-3 rounded-xl border border-[#1a1c1a]/15 flex flex-col justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5d5c5b]">
              Current Fantasy Tab
            </span>
            <div className="my-1.5">
              <span className="font-bodoni font-bold text-2xl text-[#ba0900] truncate block">
                {formatPrice(total, currency)}
              </span>
            </div>
            <span className="text-[11px] text-[#5d5c5b] font-medium">
              {itemCount} {itemCount === 1 ? 'ridiculous acquisition' : 'ridiculous acquisitions'}
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Product Stream */}
      <section ref={catalogRef} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-[#ba0900]" />
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#ba0900]">
              Impulse Catalog ({PRODUCTS.length} Curated Exhibits)
            </span>
          </div>
          <h2 className="font-bodoni font-bold text-2xl uppercase text-[#1a1c1a] tracking-tight">
            What's Your First Terrible Decision?
          </h2>
          <p className="text-xs text-[#5d5c5b]">
            Tap to claim. Zero credit checks. Infinite psychological satisfaction.
          </p>
        </div>

        {/* Product List */}
        <div className="flex flex-col gap-4">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Load More Exhibits Button */}
        {productLimit < PRODUCTS.length && (
          <button
            onClick={() => setProductLimit((prev) => Math.min(PRODUCTS.length, prev + 8))}
            className="w-full py-3 px-4 bg-[#efeeeb] hover:bg-[#e3e2e0] text-[#1a1c1a] rounded-xl text-xs font-bold uppercase tracking-wider border border-[#1a1c1a] shadow-tactile-sm active:scale-95 transition-all mt-2"
          >
            Load More Terrible Decisions ({PRODUCTS.length - productLimit} Remaining)
          </button>
        )}
      </section>

      {/* High-Fashion Satirical Social Teaser Card */}
      <section className="bg-[#e3e2e0] rounded-2xl p-4 border border-[#1a1c1a] shadow-tactile flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4 text-[#ba0900]" />
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#5d5c5b]">
            Social Flex Protocol
          </span>
        </div>

        <h3 className="font-bodoni font-bold text-lg uppercase text-[#1a1c1a] leading-tight">
          Can your friends out-waste you?
        </h3>

        <p className="text-xs text-[#5d5c5b] leading-relaxed">
          Assemble the most absurd cart in human history and export the bill to your group chat. Crown the ultimate imaginary billionaire.
        </p>

        <div className="pt-2">
          <button
            onClick={handleShareChallenge}
            className="w-full bg-white hover:bg-[#f4f3f0] text-[#1a1c1a] min-h-[44px] py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-[#1a1c1a] shadow-tactile-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-[#ba0900]" />
            <span>Challenge Friends: "Can You Beat My Cart?"</span>
          </button>
        </div>
      </section>

      <section id="about" className="flex flex-col gap-2 border-t border-[#e4e2dc] pt-5">
        <h2 className="font-bodoni font-bold text-xl uppercase text-[#1a1c1a]">
          About Fake Shopping
        </h2>
        <p className="text-xs text-[#5d5c5b] leading-relaxed">
          Fake Shopping is a free satirical shopping simulator for building impossible luxury carts. Every listing and price is fictional, so you can browse, compete, and share without a checkout or real-world purchase.
        </p>
        <p className="text-[11px] text-[#5d5c5b]">
          Catalog issue: September 2026. Last updated: September 26, 2026.
        </p>
        <nav aria-label="Information links" className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-bold uppercase tracking-wider text-[#ba0900]">
          <a href="#privacy" className="underline underline-offset-2">Privacy</a>
          <a href="#terms" className="underline underline-offset-2">Terms</a>
          <a href="#contact" className="underline underline-offset-2">Contact</a>
        </nav>
        <div id="privacy" className="text-[11px] text-[#5d5c5b]">
          <h3 className="font-bold uppercase text-[#1a1c1a]">Privacy</h3>
          <p>Fantasy carts and preferences stay in your browser unless you explicitly share a cart link.</p>
        </div>
        <div id="terms" className="text-[11px] text-[#5d5c5b]">
          <h3 className="font-bold uppercase text-[#1a1c1a]">Terms</h3>
          <p>This is an entertainment experience. No listed item is available for purchase and no money is charged.</p>
        </div>
        <div id="contact" className="text-[11px] text-[#5d5c5b]">
          <h3 className="font-bold uppercase text-[#1a1c1a]">Contact</h3>
          <p>For product or accessibility feedback, use the project contact channel where this simulator is hosted.</p>
        </div>
      </section>

      <section className="flex flex-col gap-3 border-t border-[#e4e2dc] pt-5" aria-label="Fake Shopping questions and answers">
        <h2 className="font-bodoni font-bold text-xl uppercase text-[#1a1c1a]">
          What Is Fake Shopping?
        </h2>
        <p className="text-xs text-[#5d5c5b] leading-relaxed">
          Fake Shopping is a free fantasy-shopping game for consequence-free browsing. It turns impossible luxury objects into an imaginary cart so you can explore extravagant choices, compare fictional totals, and enjoy the drama of overspending without a checkout.
        </p>

        <h2 className="font-bodoni font-bold text-xl uppercase text-[#1a1c1a]">
          Are the Purchases Real?
        </h2>
        <p className="text-xs text-[#5d5c5b] leading-relaxed">
          No. Fake Shopping does not sell the listed products, collect payment, or create orders. Product names, specifications, prices, and reviews are fictional entertainment content, and your cart stays in this browser unless you choose to share it.
        </p>

        <h2 className="font-bodoni font-bold text-xl uppercase text-[#1a1c1a]">
          How Do Sharing and Challenges Work?
        </h2>
        <p className="text-xs text-[#5d5c5b] leading-relaxed">
          Build a fantasy cart, use Surprise Me to generate a random spree, then share the result as a challenge. Friends can compare imaginary totals and decide who made the most extravagant decision. Sharing is optional and no account is required.
        </p>
      </section>

      {/* Share Sheet Drawer */}
      <ShareSheetModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        items={cart}
      />
    </div>
  );
};
