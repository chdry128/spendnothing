import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { formatPrice, formatRealCost } from '../../utils/formatters';
import { buildShareableRemixUrl } from '../../utils/remixCodec';
import {
  buildChallengeCaption,
  buildTwitterChallengeText,
  copyTextToClipboard,
  isMobileDevice,
  isNativeShareSupported,
  openFacebookShare,
  openTwitterShare,
  triggerNativeShare,
} from '../../utils/shareUtils';
import { downloadStoryReceiptImage, getStoryReceiptFile } from '../../utils/receiptImageGenerator';
import { ShareSheetModal } from '../ShareSheetModal';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Award,
  Receipt,
  Truck,
  Download,
  Users,
  RotateCcw,
  Check,
  Send,
  Plane,
  Brain,
  Sparkles,
  Share2,
  Copy,
  FileText,
  Smartphone,
  Flame,
} from 'lucide-react';

interface CheckoutConfirmationViewProps {
  onOpenStoryModal: () => void;
}

export const CheckoutConfirmationView: React.FC<CheckoutConfirmationViewProps> = ({
  onOpenStoryModal,
}) => {
  const { currentReceipt, setActiveTab, clearCart, showToast, currency, userProfile } = useStore();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [isDownloadingImage, setIsDownloadingImage] = useState(false);
  const [isSharingNative, setIsSharingNative] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  if (!currentReceipt) {
    return (
      <div className="pt-20 text-center flex flex-col items-center gap-3">
        <p className="text-sm text-[#5d5c5b]">No recent receipt found.</p>
        <button
          onClick={() => setActiveTab('play')}
          className="bg-[#ba0900] text-white px-4 py-2 rounded-xl text-xs font-bold"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  const remixUrl = buildShareableRemixUrl(currentReceipt.items, {
    creatorHandle: userProfile.handle,
    challengeNote: 'Can you beat my cart?',
    orderNumber: currentReceipt.orderNumber,
  });

  const fullCaption = buildChallengeCaption({
    items: currentReceipt.items,
    creatorHandle: userProfile.handle,
    totalMsrp: currentReceipt.subtotalMsrp,
    remixUrl,
    orderNumber: currentReceipt.orderNumber,
    currency,
  });

  const twitterText = buildTwitterChallengeText({
    items: currentReceipt.items,
    creatorHandle: userProfile.handle,
    totalMsrp: currentReceipt.subtotalMsrp,
    currency,
  });

  const hasNativeShare = isNativeShareSupported();
  const isMobile = isMobileDevice();

  // 1. Native Mobile Share Handler (Requirement 1)
  const handleNativeShare = async () => {
    setIsSharingNative(true);
    try {
      const storyFile = await getStoryReceiptFile({
        receipt: currentReceipt,
        creatorHandle: userProfile.handle,
        currency,
        remixUrl,
      });

      const shared = await triggerNativeShare(
        {
          title: 'Can you beat my cart? — Fake Shopping',
          text: `Can you beat my cart? I just spent ${formatPrice(
            currentReceipt.subtotalMsrp,
            currency
          )} for $0.00 REAL! Remix my cart & try to out-spend me:`,
          url: remixUrl,
          files: [storyFile],
        },
        () => handleCopyLink()
      );

      if (shared) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#ba0900', '#006c49', '#ffd700'],
        });
      }
    } catch {
      await triggerNativeShare(
        {
          title: 'Can you beat my cart? — Fake Shopping',
          text: `Can you beat my cart? I just spent ${formatPrice(
            currentReceipt.subtotalMsrp,
            currency
          )} for $0.00 REAL! Remix my cart & try to out-spend me:`,
          url: remixUrl,
        },
        () => handleCopyLink()
      );
    } finally {
      setIsSharingNative(false);
    }
  };

  // 2. Dedicated One-Click Share to X & FB (Requirement 2)
  const handleShareToTwitter = () => {
    openTwitterShare(twitterText, remixUrl);
    showToast('Opening X (Twitter) share...', 'Challenge Ready');
  };

  const handleShareToFacebook = () => {
    openFacebookShare(
      remixUrl,
      `Can you beat my cart? I just spent ${formatPrice(
        currentReceipt.subtotalMsrp,
        currency
      )} for $0.00 REAL on Fake Shopping!`
    );
    showToast('Opening Facebook share...', 'Challenge Ready');
  };

  // 3. Fallback Copy Actions (Requirement 3)
  const handleCopyLink = async () => {
    const success = await copyTextToClipboard(remixUrl);
    if (success) {
      setCopiedLink(true);
      showToast('Remix challenge link copied!', 'Send to group chats or paste on social');
      setTimeout(() => setCopiedLink(false), 2200);
    }
  };

  const handleCopyCaption = async () => {
    const success = await copyTextToClipboard(fullCaption);
    if (success) {
      setCopiedCaption(true);
      showToast('Caption copied! Ready for Instagram / TikTok paste', 'Copied');
      setTimeout(() => setCopiedCaption(false), 2200);
    }
  };

  // 4. Download 9:16 Story PNG (Requirement 4)
  const handleDirectDownloadImage = async () => {
    try {
      setIsDownloadingImage(true);
      showToast('Generating 1080×1920 Story Card...', 'Rendering PNG');

      await downloadStoryReceiptImage({
        receipt: currentReceipt,
        creatorHandle: userProfile.handle,
        currency,
        remixUrl,
      });

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ba0900', '#006c49', '#ffd700'],
      });

      showToast('Story receipt downloaded! Ready for IG / TikTok stories', 'Saved 1080×1920');
    } catch (err) {
      console.error('Download error:', err);
      showToast('Failed to download image', 'Please try again');
    } finally {
      setIsDownloadingImage(false);
    }
  };

  const handleStartAnother = () => {
    clearCart();
    setActiveTab('play');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col gap-6 pt-2 pb-20 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Triumphant Confetti / Order Confirmed Section */}
      <section className="flex flex-col items-center text-center pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#e3e2e0] text-[#1a1c1a] rounded-full border border-[#1a1c1a]/20 shadow-sm mb-2">
          <CheckCircle2 className="w-4 h-4 text-[#006c49]" />
          <span className="text-[10px] font-extrabold tracking-widest uppercase">
            Order Confirmed • Zero Liabilities
          </span>
        </div>

        <div className="flex flex-col items-center my-1">
          <span className="font-bodoni text-xs font-bold uppercase tracking-widest text-[#5d5c5b]">
            You Just Spent
          </span>
          <span className="font-bodoni font-black text-4xl sm:text-5xl text-[#ba0900] tracking-tight leading-none my-1">
            {formatPrice(currentReceipt.subtotalMsrp, currency)}.
          </span>
          <span className="font-bodoni text-xs font-bold uppercase tracking-widest text-[#5d5c5b] mt-1">
            Just Kidding.
          </span>
          <span className="font-bodoni font-black text-3xl text-[#1a1c1a] tracking-tight mt-0.5">
            You Paid {formatRealCost(currency)}.
          </span>
        </div>

        {/* Real Cost Callout Banner */}
        <div className="w-full bg-[#6cf8bb]/60 border border-[#006c49]/30 text-[#005236] px-4 py-2.5 rounded-xl shadow-sm flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#006c49]" />
            <div className="flex flex-col text-left">
              <span className="text-xs font-extrabold uppercase tracking-wide">
                Real Charge: {formatRealCost(currency)}
              </span>
              <span className="text-[11px] opacity-85">
                Cards Charged: Absolutely None
              </span>
            </div>
          </div>
          <span className="text-[10px] font-extrabold bg-white text-[#006c49] px-2 py-0.5 rounded border border-[#006c49]/30 uppercase">
            Solvent
          </span>
        </div>
      </section>

      {/* Unlocked Title Badge */}
      <section className="bg-white p-4 rounded-2xl border-2 border-[#1a1c1a] shadow-tactile flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-[#ba0900] text-white flex items-center justify-center shrink-0 shadow-sm">
          <Award className="w-6 h-6 text-white" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] font-extrabold text-[#ba0900] uppercase tracking-widest">
            Achievement Unlocked
          </span>
          <span className="font-bodoni font-bold text-base text-[#1a1c1a] truncate">
            {currentReceipt.achievement.title}
          </span>
          <span className="text-xs text-[#5d5c5b] line-clamp-1">
            {currentReceipt.achievement.description}
          </span>
        </div>
      </section>

      {/* Luxury Receipt Ticket */}
      <section className="w-full flex flex-col bg-white rounded-2xl border-2 border-[#1a1c1a] shadow-tactile-lg overflow-hidden">
        {/* Ticket Header Bar */}
        <div className="bg-[#e9e8e5] px-4 py-2.5 flex items-center justify-between border-b border-[#1a1c1a]/20">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-[#1a1c1a]" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#1a1c1a]">
              Official Meme Receipt
            </span>
          </div>
          <span className="text-[10px] font-extrabold bg-[#1a1c1a] text-white px-2 py-0.5 rounded">
            Verified Void
          </span>
        </div>

        {/* Ticket Body */}
        <div className="p-4 flex flex-col gap-4">
          <div className="flex justify-between items-center text-xs pb-2 border-b border-[#efeeeb]">
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-bold text-[#5d5c5b] uppercase tracking-wider">
                Order Reference
              </span>
              <span className="font-bold text-[#1a1c1a]">
                {currentReceipt.orderNumber}
              </span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] font-bold text-[#5d5c5b] uppercase tracking-wider">
                Date of Acquisition
              </span>
              <span className="font-bold text-[#1a1c1a]">
                {currentReceipt.date}
              </span>
            </div>
          </div>

          {/* Line items list */}
          <div className="flex flex-col gap-3">
            {currentReceipt.items.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between items-start text-xs">
                <div className="flex flex-col min-w-0 pr-2">
                  <span className="font-bold text-[#1a1c1a] truncate">
                    {quantity}x {product.title}
                  </span>
                  <span className="text-[11px] text-[#5d5c5b]">
                    {product.subtitle}
                  </span>
                </div>
                <div className="flex flex-col items-end shrink-0">
                  <span className="text-[10px] line-through text-[#926f69]">
                    {formatPrice(product.msrp * quantity, currency)}
                  </span>
                  <span className="font-bodoni font-bold text-sm text-[#006c49]">
                    {formatRealCost(currency)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Calculations Section */}
          <div className="bg-[#f4f3f0] p-3 rounded-xl border border-[#1a1c1a]/15 flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs text-[#5d5c5b]">
              <span>Fictional Subtotal</span>
              <span className="font-bold text-[#1a1c1a]">
                {formatPrice(currentReceipt.subtotalMsrp, currency)}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs text-[#006c49] font-bold">
              <span>Reality Check Discount</span>
              <span>-{formatPrice(currentReceipt.subtotalMsrp, currency)}</span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-[#1a1c1a]/15">
              <span className="font-bodoni font-bold text-base text-[#1a1c1a]">
                Total Billed
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-bodoni font-black text-2xl text-[#006c49] leading-none">
                  {formatRealCost(currency)}
                </span>
                <span className="text-[10px] font-extrabold bg-[#6cf8bb] text-[#005236] px-1.5 py-0.2 rounded uppercase">
                  Paid In Full
                </span>
              </div>
            </div>
          </div>

          {/* Satirical Barcode Graphic */}
          <div className="flex flex-col items-center justify-center pt-2">
            <div className="flex gap-1 items-stretch h-8 w-full max-w-[220px] px-2 opacity-80 justify-center">
              <div className="bg-[#1a1c1a] w-1" />
              <div className="bg-[#1a1c1a] w-2" />
              <div className="bg-[#1a1c1a] w-0.5" />
              <div className="bg-[#1a1c1a] w-3" />
              <div className="bg-[#1a1c1a] w-1" />
              <div className="bg-[#1a1c1a] w-0.5" />
              <div className="bg-[#1a1c1a] w-2" />
              <div className="bg-[#1a1c1a] w-1" />
              <div className="bg-[#1a1c1a] w-3" />
              <div className="bg-[#1a1c1a] w-0.5" />
              <div className="bg-[#1a1c1a] w-1.5" />
              <div className="bg-[#1a1c1a] w-2" />
              <div className="bg-[#1a1c1a] w-0.5" />
              <div className="bg-[#1a1c1a] w-1" />
              <div className="bg-[#1a1c1a] w-2.5" />
            </div>
            <span className="text-[10px] font-mono text-[#5d5c5b] tracking-widest mt-1">
              NO-REFUNDS-NO-REGRETS-00000000
            </span>
          </div>
        </div>
      </section>

      {/* Live Fictional Logistics Radar */}
      <section className="bg-white p-4 rounded-2xl border border-[#1a1c1a] shadow-tactile flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#ba0900]" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#1a1c1a]">
              Fictional Logistics Radar
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ba0900] animate-ping" />
            <span className="text-[10px] font-extrabold text-[#ba0900] uppercase">
              Live Satire
            </span>
          </div>
        </div>

        {/* Timeline Steps */}
        <div className="flex flex-col gap-4 relative pl-7 mt-1">
          <div className="absolute left-3 top-2 bottom-4 w-0.5 bg-[#e9e8e5]" />

          {/* Stage 1 */}
          <div className="relative flex flex-col">
            <div className="absolute -left-7 top-0 w-6 h-6 rounded-full bg-[#006c49] text-white flex items-center justify-center shadow-sm">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span className="text-[10px] font-extrabold text-[#006c49] uppercase">
              Completed • 1 Min Ago
            </span>
            <span className="text-xs font-bold text-[#1a1c1a]">
              Order Placed in Alternate Universe
            </span>
            <span className="text-[11px] text-[#5d5c5b]">
              The simulation validated your lavish taste immediately.
            </span>
          </div>

          {/* Stage 2 */}
          <div className="relative flex flex-col">
            <div className="absolute -left-7 top-0 w-6 h-6 rounded-full bg-[#006c49] text-white flex items-center justify-center shadow-sm">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span className="text-[10px] font-extrabold text-[#006c49] uppercase">
              Completed • Just Now
            </span>
            <span className="text-xs font-bold text-[#1a1c1a]">
              Warehouse Staff Confused but Compliant
            </span>
            <span className="text-[11px] text-[#5d5c5b]">
              Forklift team attempting to locate a 40-foot dinosaur skeleton.
            </span>
          </div>

          {/* Stage 3 (Active) */}
          <div className="relative flex flex-col">
            <div className="absolute -left-7 top-0 w-6 h-6 rounded-full bg-[#ba0900] text-white flex items-center justify-center shadow-md animate-pulse">
              <Send className="w-3 h-3" />
            </div>
            <span className="text-[10px] font-extrabold text-[#ba0900] uppercase tracking-wider">
              In Transit • Now Playing
            </span>
            <span className="text-xs font-bold text-[#1a1c1a]">
              Delivery Driver Questioning Life Decisions
            </span>
            <span className="text-[11px] text-[#5d5c5b]">
              Currently cruising interstate 95 wondering why shipping was free.
            </span>
          </div>

          {/* Stage 4 */}
          <div className="relative flex flex-col opacity-60">
            <div className="absolute -left-7 top-0 w-6 h-6 rounded-full bg-[#e9e8e5] text-[#5d5c5b] flex items-center justify-center">
              <Plane className="w-3 h-3" />
            </div>
            <span className="text-[10px] font-bold text-[#5d5c5b] uppercase">
              Pending Stage 4
            </span>
            <span className="text-xs font-semibold text-[#1a1c1a]">
              Gold Dino Loaded onto Cargo Zeppelin
            </span>
            <span className="text-[11px] text-[#5d5c5b]">
              Awaiting clearance from fictional air traffic control.
            </span>
          </div>

          {/* Stage 5 */}
          <div className="relative flex flex-col opacity-50">
            <div className="absolute -left-7 top-0 w-6 h-6 rounded-full bg-[#e9e8e5] text-[#5d5c5b] flex items-center justify-center">
              <Brain className="w-3 h-3" />
            </div>
            <span className="text-[10px] font-bold text-[#5d5c5b] uppercase">
              Destination
            </span>
            <span className="text-xs font-semibold text-[#1a1c1a]">
              Delivered to Your Pure Imagination
            </span>
            <span className="text-[11px] text-[#5d5c5b]">
              Signatures will be signed in mental endorphins.
            </span>
          </div>
        </div>
      </section>

      {/* Viral Sharing Suite (Requirements 1, 2, 3, 4) */}
      <section className="bg-white p-4 rounded-2xl border-2 border-[#1a1c1a] shadow-tactile flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-[#efeeeb] pb-2">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#ba0900]" />
            <span className="text-xs font-black uppercase text-[#1a1c1a]">
              Challenge Friends: "Can You Beat My Cart?"
            </span>
          </div>
          <span className="text-[10px] font-extrabold uppercase text-[#006c49] bg-[#6cf8bb]/40 px-2 py-0.5 rounded">
            $0 REAL
          </span>
        </div>

        {/* 1. Native Mobile Share (Primary on Mobile) */}
        {hasNativeShare || isMobile ? (
          <button
            onClick={handleNativeShare}
            disabled={isSharingNative}
            className="w-full bg-[#ba0900] hover:bg-[#920500] text-white py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 border-2 border-[#1a1c1a] shadow-tactile active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            <Smartphone className="w-4 h-4" />
            <span>{isSharingNative ? 'Opening Native Share...' : 'Share via Phone (IG, TikTok, WhatsApp)'}</span>
          </button>
        ) : (
          <button
            onClick={handleCopyLink}
            className="w-full bg-[#ba0900] hover:bg-[#920500] text-white py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 border-2 border-[#1a1c1a] shadow-tactile active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Challenge Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Remix Challenge Link</span>
              </>
            )}
          </button>
        )}

        {/* 2. Dedicated One-Click Buttons for X and Facebook */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleShareToTwitter}
            className="bg-[#1a1c1a] hover:bg-black text-white py-2.5 px-3 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 border border-[#1a1c1a] shadow-tactile-sm active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span>Share on X</span>
          </button>

          <button
            onClick={handleShareToFacebook}
            className="bg-[#1877F2] hover:bg-[#166fe5] text-white py-2.5 px-3 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 border border-[#1a1c1a] shadow-tactile-sm active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>Share to FB</span>
          </button>
        </div>

        {/* 3. Universal Fallback: Copy Caption & Copy Link */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleCopyLink}
            className="bg-white hover:bg-[#efeeeb] text-[#1a1c1a] py-2.5 px-3 rounded-xl text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border border-[#1a1c1a] shadow-tactile-sm active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#006c49] stroke-[3]" />
                <span className="text-[#006c49]">Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#5d5c5b]" />
                <span>Copy Link</span>
              </>
            )}
          </button>

          <button
            onClick={handleCopyCaption}
            className="bg-white hover:bg-[#efeeeb] text-[#1a1c1a] py-2.5 px-3 rounded-xl text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border border-[#1a1c1a] shadow-tactile-sm active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            {copiedCaption ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#006c49] stroke-[3]" />
                <span className="text-[#006c49]">Caption Copied!</span>
              </>
            ) : (
              <>
                <FileText className="w-3.5 h-3.5 text-[#ba0900]" />
                <span>Copy Caption</span>
              </>
            )}
          </button>
        </div>

        {/* 4. Story Receipt Downloads (1080x1920 PNG and Interactive Viewer) */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#efeeeb]">
          <button
            onClick={handleDirectDownloadImage}
            disabled={isDownloadingImage}
            className="bg-[#f4f3f0] hover:bg-[#eae8e4] text-[#1a1c1a] py-2.5 px-2 rounded-xl text-[11px] font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 border border-[#1a1c1a] shadow-tactile-sm active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#ba0900]" />
            <span>{isDownloadingImage ? 'Rendering...' : 'Save 9:16 PNG'}</span>
          </button>

          <button
            onClick={onOpenStoryModal}
            className="bg-[#f4f3f0] hover:bg-[#eae8e4] text-[#1a1c1a] py-2.5 px-2 rounded-xl text-[11px] font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 border border-[#1a1c1a] shadow-tactile-sm active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            <Receipt className="w-3.5 h-3.5 text-[#5d5c5b]" />
            <span>View Receipt Card</span>
          </button>
        </div>
      </section>

      {/* Primary Spree Repeat Button */}
      <section className="flex flex-col gap-2">
        <button
          onClick={handleStartAnother}
          className="w-full bg-[#006c49] hover:bg-[#005236] text-white py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 border-2 border-[#1a1c1a] shadow-tactile-sm active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Start Another Reckless Spree</span>
        </button>
      </section>

      {/* Share Sheet Modal Drawer */}
      <ShareSheetModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        orderReceipt={currentReceipt}
      />

      {/* Micro Footer Quote */}
      <div className="text-center px-4 text-[#5d5c5b]">
        <p className="font-bodoni italic text-sm text-[#1a1c1a]">
          "Money isn't real anyway, but this dopamine certainly is."
        </p>
        <span className="text-[10px] font-bold text-[#5d5c5b] block mt-1 uppercase tracking-widest">
          — The Fake Shopping Decree
        </span>
      </div>
    </div>
  );
};
