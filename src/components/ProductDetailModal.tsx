import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { PRODUCTS } from '../data/products';
import { formatPrice, formatRealCost } from '../utils/formatters';
import {
  ArrowLeft,
  Heart,
  Plane,
  ShieldCheck,
  ThumbsUp,
  AlertTriangle,
  ShoppingCart,
  Share2,
  Star,
  Plus,
  Check,
  Sparkles,
  Copy,
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProductId,
    closeProduct,
    cart,
    addToCart,
    removeFromCart,
    likedIds,
    toggleLike,
    showToast,
    openProduct,
    currency,
  } = useStore();

  const [promptCopied, setPromptCopied] = useState(false);

  if (!selectedProductId) return null;

  const product = PRODUCTS.find((p) => p.id === selectedProductId);
  if (!product) return null;

  const isAdded = cart.some((item) => item.product.id === product.id);
  const isLiked = likedIds.includes(product.id);

  // Cross-sell items
  const crossSells = PRODUCTS.filter((p) =>
    product.complementaryIds?.includes(p.id) || (p.id !== product.id && p.category === product.category)
  ).slice(0, 2);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `I just added the ${product.title} (${formatPrice(product.msrp, currency)} value) to my cart for ${formatRealCost(currency)}!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText?.(window.location.href);
      showToast('Intimidation link copied to clipboard!', 'Go shame your friends');
    }
  };

  const handleCopyPrompt = () => {
    if (product.imagePrompt) {
      navigator.clipboard?.writeText?.(product.imagePrompt);
      setPromptCopied(true);
      showToast('Image prompt copied to clipboard!', 'Use in any image generator');
      setTimeout(() => setPromptCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex justify-center animate-in fade-in duration-200">
      <div className="bg-[#faf9f6] w-full max-w-lg min-h-screen pb-28 flex flex-col border-x border-[#1a1c1a]/20 shadow-2xl relative">
        {/* Top Sticky Bar */}
        <div className="sticky top-0 z-30 bg-[#faf9f6]/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-[#e4e2dc]">
          <button
            onClick={closeProduct}
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1a1c1a] hover:text-[#ba0900] active:scale-95 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Sector</span>
          </button>

          <div className="flex items-center gap-1.5 bg-[#e9e8e5] px-2.5 py-1 rounded-full border border-[#1a1c1a]/10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ba0900] animate-pulse" />
            <span className="text-[11px] font-bold text-[#1a1c1a] uppercase tracking-wider">
              {product.stockCount || 9} in imaginary stock
            </span>
          </div>
        </div>

        {/* Hero Showcase Image */}
        <div className="px-4 pt-4">
          <div className="relative w-full rounded-2xl overflow-hidden border-2 border-[#1a1c1a] shadow-tactile bg-[#efeeeb]">
            {/* Top Badges */}
            <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between gap-1.5 pointer-events-none">
              <span className="bg-[#1a1c1a] text-white text-[11px] font-extrabold uppercase px-2.5 py-1 rounded shadow-sm">
                {product.weight || 'Weighs 8.4 Tons'}
              </span>

              <div className="flex items-center gap-1.5 pointer-events-auto">
                <span className="bg-[#006c49] text-white text-[11px] font-extrabold uppercase px-2.5 py-1 rounded shadow-sm">
                  Zero Practical Value
                </span>
                <button
                  onClick={() => toggleLike(product.id)}
                  className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-[#1a1c1a] flex items-center justify-center text-[#ba0900] shadow-sm hover:scale-110 active:scale-90 transition-all"
                  title="Save to Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#ba0900]' : ''}`} />
                </button>
              </div>
            </div>

            <div className="w-full h-80 bg-cover bg-center" style={{ backgroundImage: `url('${product.image}')` }}>
              <img src={product.image} alt={product.title} width={1200} height={800} loading="lazy" className="w-full h-full object-cover opacity-0" />
            </div>

            {/* Zeppelin Delivery Strip */}
            <div className="bg-[#f4f3f0] px-4 py-2.5 flex items-center justify-between border-t border-[#1a1c1a]/20">
              <div className="flex items-center gap-2">
                <Plane className="w-4 h-4 text-[#ba0900]" />
                <span className="text-xs font-bold text-[#1a1c1a] uppercase tracking-wider">
                  {product.deliveryType ? `Delivery: ${product.deliveryType}` : 'Delivery: Cargo Zeppelin'}
                </span>
              </div>
              <span className="text-[11px] font-extrabold text-[#006c49] uppercase">
                {product.deliveryEta || 'Estimated ETA: 45 Mins'}
              </span>
            </div>
          </div>
        </div>

        {/* Editorial Meta & Pricing Box */}
        <section className="px-4 pt-4 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-1.5 text-xs">
            <span className="text-[11px] font-extrabold text-[#ba0900] uppercase tracking-widest">
              {product.sectorLabel} / {product.itemCode || '#TERRIBLE-DECISION'}
            </span>
            <span className="text-[10px] font-bold text-[#5d5c5b] uppercase bg-[#e9e8e5] px-2 py-0.5 rounded">
              {product.categoryLabel}
            </span>
          </div>

          <h1 className="font-bodoni font-bold text-2xl text-[#1a1c1a] leading-tight">
            {product.title}
          </h1>

          {/* One line card hook */}
          <p className="text-xs text-[#5d5c5b] leading-relaxed italic">
            "{product.hook || product.description}"
          </p>

          {/* Price Dualism Box */}
          <div className="mt-1 bg-white p-4 rounded-xl border border-[#1a1c1a] shadow-tactile-sm flex flex-col gap-2.5">
            <div className="flex items-baseline justify-between">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#5d3f3a]">
                  Fictional MSRP Strike
                </span>
                <span className="text-base line-through text-[#926f69] font-medium decoration-[#ba0900] decoration-2">
                  {formatPrice(product.msrp, currency)}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#ba0900]">
                  Unlimited Shopping Price
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="font-bodoni font-black text-3xl text-[#ba0900] leading-none">
                    {formatRealCost(currency)}
                  </span>
                  <span className="text-xs font-extrabold text-[#1a1c1a] uppercase">
                    {currency}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#6cf8bb]/40 border border-[#006c49]/20 p-2.5 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#005236]">
                <ShieldCheck className="w-4 h-4 text-[#006c49]" />
                <span className="text-xs font-bold">
                  Real Money Owed: <strong>{formatRealCost(currency)} Guaranteed</strong>
                </span>
              </div>
              <span className="text-[10px] font-extrabold bg-white px-2 py-0.5 rounded text-[#006c49] border border-[#006c49]/30 uppercase">
                100% Pretend
              </span>
            </div>
          </div>
        </section>

        {/* Psychological Rationale: Why You Want This vs Why You Definitely Don't Need This */}
        <section className="px-4 py-3 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#5d5c5b]">
              Psychological Rationale
            </span>
            <span className="text-xs text-[#926f69] font-semibold">Analysis v4.2</span>
          </div>

          {/* Why You Want This */}
          <div className="bg-white p-4 rounded-xl border border-[#1a1c1a] shadow-tactile-sm flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[#006c49]">
              <ThumbsUp className="w-4 h-4" />
              <h2 className="text-xs font-extrabold uppercase tracking-wider">
                Why You Want This
              </h2>
            </div>
            <p className="text-xs text-[#1a1c1a] leading-relaxed">
              {product.whyWant}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {product.whyWantBadges.map((badge, idx) => (
                <span
                  key={idx}
                  className="bg-[#efeeeb] text-[#1a1c1a] text-[10px] font-bold px-2 py-0.5 rounded border border-[#1a1c1a]/10"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Why You Definitely Don't Need This */}
          <div className="bg-[#f4f3f0] p-4 rounded-xl border border-[#1a1c1a] shadow-tactile-sm flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[#ba0900]">
              <AlertTriangle className="w-4 h-4" />
              <h2 className="text-xs font-extrabold uppercase tracking-wider">
                Why You Definitely Don't Need This
              </h2>
            </div>
            <p className="text-xs text-[#5d5c5b] leading-relaxed">
              {product.whyDontNeed}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {product.whyDontNeedBadges.map((badge, idx) => (
                <span
                  key={idx}
                  className="bg-[#ffdad6] text-[#93000a] text-[10px] font-extrabold px-2 py-0.5 rounded border border-[#93000a]/20"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Ridiculous Spec Sheet */}
        <section className="px-4 py-2 flex flex-col gap-2">
          <div className="flex items-center justify-between pb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#5d5c5b]">
              Ridiculous Spec Sheet
            </span>
            <span className="text-xs text-[#5d5c5b] font-mono">
              Item ID: {product.itemCode || '#SPEC-ZERO'}
            </span>
          </div>

          <div className="bg-white rounded-xl border border-[#1a1c1a] shadow-tactile-sm overflow-hidden text-xs">
            {product.specs.map((spec, i) => (
              <div
                key={i}
                className={`p-3 flex items-center justify-between ${
                  i % 2 === 0 ? 'bg-[#f4f3f0]' : 'bg-white'
                }`}
              >
                <span className="font-bold uppercase text-[#5d5c5b]">{spec.label}</span>
                <span className="font-semibold text-[#1a1c1a] text-right">{spec.value}</span>
              </div>
            ))}

            {product.included && product.included.length > 0 && (
              <div className="p-3 bg-[#e9e8e5] flex flex-col gap-1.5 border-t border-[#1a1c1a]/20">
                <span className="font-bold uppercase text-[#5d5c5b]">Included in Crate:</span>
                <div className="flex flex-wrap gap-1.5">
                  {product.included.map((inc, idx) => (
                    <span
                      key={idx}
                      className="bg-white text-[#1a1c1a] px-2 py-0.5 rounded text-[11px] border border-[#1a1c1a]/15 font-medium"
                    >
                      {inc}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Image Generation Prompt Drawer (for creative asset generation/sourcing) */}
        {product.imagePrompt && (
          <section className="px-4 py-1">
            <div className="bg-[#efeeeb] p-3 rounded-xl border border-[#1a1c1a]/15 text-xs flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-[#ba0900] font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="text-[10px] uppercase tracking-wider">Asset Generation Prompt</span>
                </div>
                <button
                  onClick={handleCopyPrompt}
                  className="flex items-center gap-1 text-[10px] font-bold text-[#1a1c1a] hover:text-[#ba0900] bg-white px-2 py-0.5 rounded border border-[#1a1c1a]/15"
                >
                  {promptCopied ? <Check className="w-3 h-3 text-[#006c49]" /> : <Copy className="w-3 h-3" />}
                  <span>{promptCopied ? 'Copied' : 'Copy Prompt'}</span>
                </button>
              </div>
              <p className="text-[11px] text-[#5d5c5b] font-mono leading-relaxed line-clamp-2">
                {product.imagePrompt}
              </p>
            </div>
          </section>
        )}

        {/* Deluded Customer Reviews */}
        {product.reviews && product.reviews.length > 0 && (
          <section className="px-4 py-3 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <h2 className="font-bodoni font-bold text-base text-[#1a1c1a]">
                  Deluded Customer Reviews
                </h2>
                <span className="bg-[#e9e8e5] px-1.5 py-0.5 rounded text-xs font-bold">5.0 ★</span>
              </div>
              <span className="text-[11px] font-extrabold text-[#006c49] uppercase">
                Verified Zero-Payers
              </span>
            </div>

            {product.reviews.map((rev, idx) => (
              <div
                key={idx}
                className="bg-white p-3.5 rounded-xl border border-[#1a1c1a] shadow-tactile-sm flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#ffdad4] text-[#ba0900] font-bodoni font-bold flex items-center justify-center text-xs">
                      {rev.author.substring(1, 3).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-bold text-xs text-[#1a1c1a] block leading-tight">
                        {rev.author}
                      </span>
                      <span className="text-[10px] text-[#5d5c5b]">{rev.role}</span>
                    </div>
                  </div>

                  <div className="flex text-[#ba0900]">
                    {[...Array(rev.stars)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#ba0900]" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-[#1a1c1a] italic leading-relaxed">
                  "{rev.text}"
                </p>
                <span className="text-[10px] text-[#926f69] font-medium">{rev.time}</span>
              </div>
            ))}
          </section>
        )}

        {/* Interactive Cart Action Console */}
        <section className="px-4 py-3">
          <div className="bg-[#e3e2e0] p-4 rounded-2xl border-2 border-[#1a1c1a] shadow-tactile flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#1a1c1a]">
                Fantasy Tab Impact
              </span>
              <span className="font-bodoni font-black text-xl text-[#ba0900]">
                +{formatPrice(product.msrp, currency)}
              </span>
            </div>

            <button
              onClick={() => {
                if (isAdded) {
                  removeFromCart(product.id);
                } else {
                  addToCart(product, 1);
                }
              }}
              className={`w-full py-3.5 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 border-2 border-[#1a1c1a] shadow-tactile active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all ${
                isAdded
                  ? 'bg-[#006c49] text-white hover:bg-[#005236]'
                  : 'bg-[#ba0900] text-white hover:bg-[#920500]'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Claimed for {formatRealCost(currency)} (In Cart)</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Imaginary Cart — {formatRealCost(currency)}</span>
                </>
              )}
            </button>

            <button
              onClick={handleShare}
              className="w-full bg-white text-[#1a1c1a] hover:bg-[#f4f3f0] py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-[#1a1c1a] shadow-tactile-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              <Share2 className="w-4 h-4 text-[#ba0900]" />
              <span>Share to Intimidate Friends</span>
            </button>

            <div className="text-center pt-1">
              <span className="text-[10px] font-bold text-[#5d5c5b] uppercase tracking-widest">
                Zero Credit Card Required. Zero Buyer Remorse.
              </span>
            </div>
          </div>
        </section>

        {/* Complementary Ego Traps */}
        {crossSells.length > 0 && (
          <section className="px-4 pt-2 pb-6 flex flex-col gap-2.5">
            <h3 className="font-bodoni font-bold text-base text-[#1a1c1a]">
              Complementary Ego Traps
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {crossSells.map((cross) => (
                <div
                  key={cross.id}
                  onClick={() => openProduct(cross.id)}
                  className="bg-white rounded-xl overflow-hidden border border-[#1a1c1a] shadow-tactile-sm p-2 flex flex-col justify-between cursor-pointer group"
                >
                  <div className="relative w-full h-24 rounded-lg overflow-hidden bg-[#efeeeb] mb-2">
                    <img
                      src={cross.image}
                      alt={cross.title}
                      width={400}
                      height={267}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute top-1 left-1 bg-[#1a1c1a] text-white text-[9px] font-bold px-1 rounded uppercase">
                      {cross.subBadge || `${formatRealCost(currency)} COST`}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bodoni font-bold text-xs text-[#1a1c1a] line-clamp-1">
                      {cross.title}
                    </h4>
                    <span className="text-[10px] line-through text-[#926f69]">
                      {formatPrice(cross.msrp, currency)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-bodoni font-bold text-sm text-[#ba0900]">
                      {formatRealCost(currency)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(cross, 1);
                      }}
                      className="w-6 h-6 rounded bg-[#efeeeb] hover:bg-[#ba0900] hover:text-white border border-[#1a1c1a] flex items-center justify-center transition-colors"
                      title="Quick Add"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
