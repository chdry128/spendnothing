import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { PRODUCTS } from '../../data/products';
import { formatPrice, formatRealCost } from '../../utils/formatters';
import { buildShareableRemixUrl } from '../../utils/remixCodec';
import { ShareSheetModal } from '../ShareSheetModal';
import confetti from 'canvas-confetti';
import {
  Flame,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  Trash2,
  HeartCrack,
  Plus,
  Minus,
  ShoppingCart,
  Share2,
  PlusCircle,
  Dice5,
  Sparkles,
} from 'lucide-react';

export const CartView: React.FC = () => {
  const {
    cart,
    getTotalMSRP,
    updateQuantity,
    removeFromCart,
    clearCart,
    addToCart,
    checkout,
    showToast,
    openProduct,
    setActiveTab,
    openSurpriseMe,
    userProfile,
    currency,
  } = useStore();

  const [delusionTier, setDelusionTier] = useState<string>('unlimited');
  const [moonBaseAdded, setMoonBaseAdded] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  const total = getTotalMSRP();
  const itemCount = cart.reduce((acc, c) => acc + c.quantity, 0);

  // Chaos level calculation
  const getChaosLevel = () => {
    if (total > 50000000) return { title: 'Cosmic Financial Hazard', percent: 99 };
    if (total > 15000000) return { title: 'Unhinged Billionaire', percent: 88 };
    if (total > 1000000) return { title: 'Reckless Speculator', percent: 64 };
    if (total > 100000) return { title: 'Poor Life Choices', percent: 42 };
    return { title: 'Modest Decadence', percent: 18 };
  };

  const chaos = getChaosLevel();

  const handleCheckout = () => {
    if (cart.length === 0) {
      showToast('Your fantasy cart is empty! Add some reckless absurdities first.', 'NO LIABILITIES');
      return;
    }

    // Fire joyful confetti!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ba0900', '#006c49', '#ffd700', '#1a1c1a'],
    });

    checkout();
  };

  const handleAddMoonBase = () => {
    const moonProduct = PRODUCTS.find((p) => p.id === 'moon-parking');
    if (moonProduct && !moonBaseAdded) {
      addToCart(moonProduct, 1);
      setMoonBaseAdded(true);
      showToast(`Moon Base spot secured! Fictional damage increased by ${formatPrice(8500000, currency)}`, `+${formatRealCost(currency)} REAL`);
    }
  };

  const handleShareCart = () => {
    setIsShareModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-5 pt-2 pb-16 max-w-md mx-auto px-4">
      {/* Official Audit Fantasy Ledger Header */}
      <section className="bg-white p-4 rounded-2xl border-2 border-[#1a1c1a] shadow-tactile flex flex-col gap-3 relative overflow-hidden">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <span className="text-[10px] font-extrabold text-[#5d5c5b] uppercase tracking-widest">
              Official Audit
            </span>
            <h1 className="font-bodoni font-bold text-2xl text-[#1a1c1a] uppercase leading-tight">
              Your Fantasy Ledger
            </h1>
          </div>
          <div className="bg-[#f4f3f0] px-2.5 py-1 rounded-md border border-[#1a1c1a]/15 flex items-center gap-1 shadow-sm">
            <Flame className="w-3.5 h-3.5 text-[#ba0900]" />
            <span className="text-[10px] font-extrabold text-[#ba0900] uppercase tracking-wider">
              Risk: Zero
            </span>
          </div>
        </div>

        <p className="text-xs text-[#5d5c5b] italic">
          Status: You have completely lost the plot.
        </p>

        {/* Big Numbers Display */}
        <div className="bg-[#f4f3f0] p-3 rounded-xl border border-[#1a1c1a]/20 flex flex-col gap-1.5">
          <span className="text-[10px] font-extrabold uppercase text-[#5d5c5b] tracking-wider">
            Total Imaginary Damage
          </span>
          <div className="flex items-baseline justify-between flex-wrap gap-1">
            <span className="font-bodoni font-black text-3xl sm:text-4xl text-[#ba0900] tracking-tight leading-none">
              {formatPrice(total, currency)}
            </span>
            <span className="text-xs text-[#926f69] line-through font-semibold">
              MSRP: Priceless
            </span>
          </div>

          <div className="flex items-center justify-between bg-[#6cf8bb]/60 border border-[#006c49]/30 text-[#005236] px-3 py-2 rounded-lg mt-1 shadow-sm">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#006c49]" />
              <span className="text-xs font-extrabold uppercase tracking-wide">
                Real Money To Pay:
              </span>
            </div>
            <span className="font-bodoni font-black text-xl leading-none">
              {formatRealCost(currency)}
            </span>
          </div>
        </div>

        {/* Chaos Level Meter */}
        <div className="flex flex-col gap-1.5 mt-1">
          <div className="flex justify-between items-center text-[#1a1c1a]">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#ba0900] flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              Chaos Level: {chaos.title}
            </span>
            <span className="font-bodoni font-bold text-base text-[#1a1c1a]">
              {chaos.percent}%
            </span>
          </div>

          <div className="w-full bg-[#e9e8e5] h-2.5 rounded-full overflow-hidden border border-[#1a1c1a]/10">
            <div
              className="bg-[#ba0900] h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${chaos.percent}%` }}
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#5d5c5b]">
            <TrendingUp className="w-3.5 h-3.5 text-[#006c49]" />
            <span>
              You have outspent <strong className="text-[#1a1c1a]">94%</strong> of imaginary peers today.
            </span>
          </div>
        </div>
      </section>

      {/* Sanity Filter / Delusion Tier */}
      <section className="bg-[#f4f3f0] p-3 rounded-2xl border border-[#1a1c1a] shadow-tactile-sm flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5d5c5b]">
            Sanity Filter
          </span>
          <span className="text-xs text-[#926f69] font-medium">Select Delusion Tier</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            { id: '10k', label: `${formatPrice(10000, currency, { compact: true })} Impulse` },
            { id: '100k', label: `${formatPrice(100000, currency, { compact: true })} Bad Idea` },
            { id: '1m', label: `${formatPrice(1000000, currency, { compact: true })} Mid-Life` },
            { id: 'unlimited', label: '∞ Unlimited Chaos' },
          ].map((tier) => (
            <button
              key={tier.id}
              onClick={() => setDelusionTier(tier.id)}
              className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all border ${
                delusionTier === tier.id
                  ? 'bg-[#ba0900] text-white border-[#1a1c1a] shadow-tactile-sm'
                  : 'bg-white text-[#1a1c1a] hover:bg-[#efeeeb] border-[#1a1c1a]/15'
              }`}
            >
              {tier.label}
            </button>
          ))}
        </div>
      </section>

      {/* Loot Roster */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-extrabold uppercase text-[#5d5c5b] tracking-wider">
            Loot Roster ({itemCount} {itemCount === 1 ? 'Item' : 'Items'})
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={openSurpriseMe}
              className="text-[#ba0900] text-xs font-extrabold uppercase tracking-wider flex items-center gap-1 hover:underline"
              title="Generate a random cart"
            >
              <Dice5 className="w-3.5 h-3.5" />
              <span>Surprise Me</span>
            </button>

            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-[#5d5c5b] hover:text-[#ba0900] text-xs font-extrabold uppercase tracking-wider flex items-center gap-1 hover:underline ml-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Flush</span>
              </button>
            )}
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-[#1a1c1a] shadow-tactile-sm text-center flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#efeeeb] flex items-center justify-center text-[#5d5c5b]">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <h3 className="font-bodoni font-bold text-lg text-[#1a1c1a]">
              Your Cart is Suspiciously Solvent
            </h3>
            <p className="text-xs text-[#5d5c5b] max-w-xs">
              You haven't accumulated any fictional debt yet. Let's fix this immediately.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 w-full max-w-xs pt-1">
              <button
                onClick={() => setActiveTab('play')}
                className="flex-1 bg-[#ba0900] text-white px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border border-[#1a1c1a] shadow-tactile-sm"
              >
                Browse Catalog
              </button>
              <button
                onClick={openSurpriseMe}
                className="flex-1 bg-[#1a1c1a] text-white px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border border-[#1a1c1a] shadow-tactile-sm flex items-center justify-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#6cf8bb]" />
                <span>Surprise Me</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {cart.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl p-3 border border-[#1a1c1a] shadow-tactile-sm flex flex-col gap-2 relative group"
              >
                <div
                  onClick={() => openProduct(product.id)}
                  className="flex gap-3 cursor-pointer"
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#efeeeb] shrink-0 border border-[#1a1c1a]/15">
                    <img
                      src={product.image}
                      alt={product.title}
                      width={80}
                      height={80}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="flex flex-col flex-1 justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <span className="font-bodoni font-bold text-base text-[#1a1c1a] truncate">
                          {product.title}
                        </span>
                        <span className="bg-[#1a1c1a] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded tracking-wide shrink-0 uppercase">
                          {product.tag}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#5d5c5b] line-clamp-1">
                        {product.hook || product.subtitle}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between mt-1">
                      <span className="font-bodoni font-bold text-lg text-[#ba0900]">
                        {formatPrice(product.msrp * quantity, currency)}
                      </span>
                      <span className="text-[10px] font-extrabold text-[#006c49] uppercase">
                        {formatRealCost(currency)} Real
                      </span>
                    </div>
                  </div>
                </div>

                {/* Qty & Remove Bar */}
                <div className="flex items-center justify-between bg-[#f4f3f0] px-3 py-1.5 rounded-xl border border-[#1a1c1a]/10 mt-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(product.id, -1)}
                      className="w-7 h-7 rounded-lg bg-white border border-[#1a1c1a]/20 text-[#1a1c1a] flex items-center justify-center shadow-sm active:scale-90 transition-transform"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-bold text-xs text-[#1a1c1a] px-1">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, 1)}
                      className="w-7 h-7 rounded-lg bg-white border border-[#1a1c1a]/20 text-[#1a1c1a] flex items-center justify-center shadow-sm active:scale-90 transition-transform"
                      title="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="text-[#ba1a1a] text-xs font-semibold flex items-center gap-1 hover:underline"
                  >
                    <HeartCrack className="w-3.5 h-3.5" />
                    <span>Remove with shame</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Absurd Upsell / "Why Stop Now?" Prompt */}
      {!moonBaseAdded && (
        <section className="bg-[#e9e8e5] p-4 rounded-2xl border-2 border-[#1a1c1a] shadow-tactile flex flex-col gap-2 relative overflow-hidden">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-extrabold bg-[#ba0900] text-white px-2 py-0.5 rounded uppercase">
              Why Stop Now?
            </span>
            <span className="text-[11px] font-bold text-[#006c49]">
              100% Free Fictional Add-on
            </span>
          </div>

          <div className="flex flex-col mt-0.5">
            <span className="font-bodoni font-bold text-lg text-[#1a1c1a]">
              Private Moon Base Parking Permit
            </span>
            <p className="text-xs text-[#5d5c5b] mt-0.5 leading-relaxed">
              Guaranteed subterranean crater spot inside Sea of Tranquility. Avoid rover clamp fees.
            </p>
          </div>

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1a1c1a]/15">
            <div className="flex flex-col">
              <span className="font-bodoni font-bold text-lg text-[#ba0900]">
                +{formatPrice(8500000, currency)}
              </span>
              <span className="text-[10px] font-bold text-[#5d5c5b]">
                Real: {formatRealCost(currency)}
              </span>
            </div>

            <button
              onClick={handleAddMoonBase}
              className="bg-[#1a1c1a] hover:bg-[#333] text-white px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-tactile-sm active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add To Ruin</span>
            </button>
          </div>
        </section>
      )}

      {/* Checkout Action Bar & Social Proof */}
      <section className="flex flex-col gap-2.5 pt-2">
        <button
          onClick={handleCheckout}
          disabled={cart.length === 0}
          className={`w-full py-4 px-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 border-2 border-[#1a1c1a] shadow-tactile active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all ${
            cart.length > 0
              ? 'bg-[#ba0900] text-white hover:bg-[#920500]'
              : 'bg-[#ccc] text-[#666] cursor-not-allowed'
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Proceed To Fake Checkout ({formatPrice(total, currency, { compact: true })} → {formatRealCost(currency)}) →</span>
        </button>

        <button
          onClick={handleShareCart}
          className="w-full bg-white hover:bg-[#f4f3f0] text-[#1a1c1a] py-3 px-4 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-[#1a1c1a] shadow-tactile-sm active:translate-x-0.5 active:translate-y-0.5 transition-all"
        >
          <Share2 className="w-4 h-4 text-[#ba0900]" />
          <span>Share Cart: "Can You Beat My Cart?"</span>
        </button>

        <div className="flex items-center justify-center gap-1.5 text-center mt-1 text-[#5d5c5b]">
          <ShieldCheck className="w-4 h-4 text-[#006c49]" />
          <span className="text-xs">
            No card details. No personal data. Pure psychological satisfaction.
          </span>
        </div>
      </section>

      {/* Full Viral Share Drawer */}
      <ShareSheetModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        items={cart}
      />
    </div>
  );
};
