import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { formatPrice, formatRealCost } from '../../utils/formatters';
import { ShareSheetModal } from '../ShareSheetModal';
import confetti from 'canvas-confetti';
import {
  Swords,
  Sparkles,
  CheckCircle2,
  Share2,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Flame,
  Award,
  Eye,
  Download,
} from 'lucide-react';

export const RemixLandingView: React.FC = () => {
  const {
    remixCartData,
    applyRemixToLedger,
    dismissRemix,
    openProduct,
    currency,
  } = useStore();

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  if (!remixCartData) {
    return null;
  }

  const { items, creatorHandle, originalTotalMsrp, challengeNote, orderNumber } = remixCartData;

  const handleRemixClick = () => {
    // Joyful celebration confetti!
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.55 },
      colors: ['#ba0900', '#006c49', '#ffd700', '#1a1c1a'],
    });

    applyRemixToLedger();
  };

  return (
    <div className="flex flex-col gap-6 pt-2 pb-24 max-w-md mx-auto px-4 animate-in fade-in">
      {/* Challenge Alert Top Banner */}
      <section className="flex flex-col items-center text-center pt-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ffe8e4] text-[#ba0900] rounded-full border border-[#ba0900]/30 shadow-sm mb-2">
          <Swords className="w-3.5 h-3.5" />
          <span className="text-[10px] font-black tracking-widest uppercase">
            PvP Challenge • Fantasy Spree
          </span>
        </div>

        {/* The Exact "Can you beat my cart?" Wireframe Headline */}
        <div className="flex flex-col items-center my-1">
          <span className="font-bodoni text-xs font-bold uppercase tracking-widest text-[#5d5c5b]">
            Challenged By {creatorHandle}
          </span>
          <h1 className="font-bodoni font-black text-4xl sm:text-5xl text-[#ba0900] tracking-tight leading-none my-1 uppercase">
            Can You Beat
          </h1>
          <h1 className="font-bodoni font-black text-4xl sm:text-5xl text-[#1a1c1a] tracking-tight leading-none uppercase">
            My Cart?
          </h1>
        </div>

        <p className="text-xs text-[#5d5c5b] leading-relaxed max-w-sm mt-1">
          Someone just indulged in a <strong className="text-[#1a1c1a]">{formatPrice(originalTotalMsrp, currency)}</strong> fantasy shopping spree for exactly <strong className="text-[#006c49]">{formatRealCost(currency)}</strong>. They want to see if you have the audacity to out-spend them.
        </p>

        {/* Real Cost Callout Banner */}
        <div className="w-full bg-[#6cf8bb]/60 border border-[#006c49]/30 text-[#005236] px-4 py-2.5 rounded-xl shadow-sm flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#006c49]" />
            <div className="flex flex-col text-left">
              <span className="text-xs font-extrabold uppercase tracking-wide">
                Original Real Cost: {formatRealCost(currency)}
              </span>
              <span className="text-[11px] opacity-85">
                Zero debt, pure psychological endorphins
              </span>
            </div>
          </div>
          <span className="text-[10px] font-extrabold bg-white text-[#006c49] px-2 py-0.5 rounded border border-[#006c49]/30 uppercase">
            Read-Only
          </span>
        </div>
      </section>

      {/* Primary Hero CTA to Remix */}
      <section className="bg-white p-4 rounded-2xl border-2 border-[#1a1c1a] shadow-tactile flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-[#efeeeb] pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#ba0900]" />
            <span className="text-xs font-black uppercase text-[#1a1c1a]">
              The Remix Gauntlet
            </span>
          </div>
          {orderNumber && (
            <span className="text-[10px] font-mono text-[#5d5c5b]">
              Ref: {orderNumber}
            </span>
          )}
        </div>

        <p className="text-xs text-[#5d5c5b]">
          Click below to copy this entire cart into your own editable Fantasy Ledger. You can delete their items, add more ridiculous luxuries, ramp up quantities, and re-run fake checkout to generate your own receipt!
        </p>

        <button
          onClick={handleRemixClick}
          className="w-full bg-[#ba0900] hover:bg-[#920500] text-white py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 border-2 border-[#1a1c1a] shadow-tactile active:translate-x-0.5 active:translate-y-0.5 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Remix This Cart → Beat {formatPrice(originalTotalMsrp, currency, { compact: true })}</span>
        </button>
      </section>

      {/* Read-Only Cart Contents Breakdown */}
      <section className="flex flex-col gap-3">
        <div className="flex justify-between items-baseline px-1">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#5d5c5b]">
            Original Cart Contents ({items.length} Delusions)
          </span>
          <span className="font-bodoni font-bold text-sm text-[#ba0900]">
            Target: {formatPrice(originalTotalMsrp, currency)}
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="bg-white p-3.5 rounded-2xl border border-[#1a1c1a] shadow-tactile-sm flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={product.image}
                  alt={product.title}
                  width={56}
                  height={56}
                  loading="lazy"
                  className="w-14 h-14 rounded-xl object-cover border border-[#1a1c1a]/20 shrink-0"
                />
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#f4f3f0] text-[#5d5c5b] border border-[#1a1c1a]/10">
                      {product.categoryLabel}
                    </span>
                    {quantity > 1 && (
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-[#ba0900] text-white">
                        {quantity}x
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-xs text-[#1a1c1a] truncate mt-0.5">
                    {product.title}
                  </span>
                  <span className="text-[11px] text-[#5d5c5b] line-clamp-1 italic">
                    "{product.hook}"
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0 pl-1">
                <span className="font-bodoni font-bold text-sm text-[#ba0900]">
                  {formatPrice(product.msrp * quantity, currency)}
                </span>
                <span className="text-[10px] font-bold text-[#006c49]">
                  Real: {formatRealCost(currency)}
                </span>
                <button
                  onClick={() => openProduct(product.id)}
                  className="text-[10px] font-semibold text-[#5d5c5b] hover:text-[#1a1c1a] flex items-center gap-0.5 mt-1 hover:underline"
                >
                  <Eye className="w-3 h-3" />
                  <span>Inspect</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Alternative Action / Decline */}
      <section className="flex flex-col gap-2 pt-2">
        <button
          onClick={() => setIsShareModalOpen(true)}
          className="w-full bg-white hover:bg-[#efeeeb] text-[#1a1c1a] py-3 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 border border-[#1a1c1a] shadow-tactile-sm active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
        >
          <Share2 className="w-4 h-4 text-[#ba0900]" />
          <span>Forward Challenge & Share Card</span>
        </button>

        <button
          onClick={dismissRemix}
          className="w-full bg-[#e9e8e5] hover:bg-[#deddd9] text-[#1a1c1a] py-3 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 border border-[#1a1c1a] shadow-tactile-sm active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-[#5d5c5b]" />
          <span>Ignore Challenge & Browse Catalog Fresh</span>
        </button>

        <div className="flex items-center justify-center gap-1.5 text-center text-[#5d5c5b] pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#006c49]" />
          <span className="text-[11px]">
            No registration required. Encoded purely in the link.
          </span>
        </div>
      </section>

      {/* How Remixing Works Satirical Guide */}
      <div className="bg-[#f4f3f0] p-4 rounded-2xl border border-[#1a1c1a]/15 text-xs text-[#5d5c5b] flex flex-col gap-2">
        <span className="font-extrabold uppercase tracking-wider text-[#1a1c1a] text-[10px]">
          How The Remix Loop Works:
        </span>
        <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed">
          <li><strong>Copy to Ledger:</strong> Hit "Remix This Cart" to import their exact acquisitions.</li>
          <li><strong>Escalate the Delusion:</strong> Delete their petty items with shame or add multi-million dollar atrocities.</li>
          <li><strong>Re-Run Fake Checkout:</strong> Fire the confetti, unlock your new achievement, and share your receipt back to out-flex them!</li>
        </ol>
      </div>

      {/* Share Drawer */}
      <ShareSheetModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        items={items}
      />
    </div>
  );
};
