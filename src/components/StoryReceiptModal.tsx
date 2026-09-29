import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { formatPrice, formatRealCost } from '../utils/formatters';
import { buildShareableRemixUrl } from '../utils/remixCodec';
import {
  buildChallengeCaption,
  buildTwitterChallengeText,
  copyTextToClipboard,
  isMobileDevice,
  isNativeShareSupported,
  openFacebookShare,
  openTwitterShare,
  triggerNativeShare,
} from '../utils/shareUtils';
import {
  downloadStoryReceiptImage,
  getStoryReceiptFile,
} from '../utils/receiptImageGenerator';
import confetti from 'canvas-confetti';
import {
  X,
  Check,
  Copy,
  Download,
  Share2,
  Smartphone,
  FileText,
  ShieldCheck,
} from 'lucide-react';

interface StoryReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StoryReceiptModal: React.FC<StoryReceiptModalProps> = ({ isOpen, onClose }) => {
  const { currentReceipt, showToast, currency, userProfile } = useStore();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharingNative, setIsSharingNative] = useState(false);

  if (!isOpen || !currentReceipt) return null;

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

  const isMobile = isMobileDevice();
  const hasNativeShare = isNativeShareSupported();

  // 1. Native Mobile Sharing
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
          title: 'Can you beat my cart? — Unlimited Shopping',
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
          title: 'Can you beat my cart? — Unlimited Shopping',
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

  // 2. One-Click Social Intents
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
      )} for $0.00 REAL on Unlimited Shopping!`
    );
    showToast('Opening Facebook share...', 'Challenge Ready');
  };

  // 3. Fallback Copy Actions
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

  // 4. Download Real 1080x1920 Story Receipt
  const handleDownloadStoryImage = async () => {
    try {
      setIsDownloading(true);
      showToast('Generating 1080×1920 Story Receipt...', 'Rendering PNG');

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

      showToast('Story receipt saved! Post to your Instagram / TikTok stories', 'Saved 1080×1920');
    } catch (err) {
      console.error('Failed to download story image:', err);
      showToast('Download error', 'Please try again');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="relative w-full max-w-sm flex flex-col items-center gap-3 my-auto max-h-[96vh] overflow-y-auto pb-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="self-end w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors shrink-0"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 9:16 Vertical Story Card */}
        <div
          id="story-receipt-canvas"
          className="w-full bg-[#faf9f6] rounded-3xl p-5 sm:p-6 border-4 border-[#1a1c1a] shadow-2xl flex flex-col justify-between relative overflow-hidden shrink-0"
          style={{ aspectRatio: '9 / 16' }}
        >
          {/* Subtle watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
            <span className="font-bodoni font-black text-8xl -rotate-45 select-none">
              VOID
            </span>
          </div>

          {/* Top Brand Header */}
          <div className="flex flex-col items-center text-center pb-2.5 border-b-2 border-dashed border-[#1a1c1a]">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded bg-[#1a1c1a] flex items-center justify-center text-white font-bold text-sm">
                F
              </div>
              <span className="font-bodoni font-bold text-lg uppercase tracking-tight text-[#1a1c1a]">
                Unlimited Shopping
              </span>
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#ba0900]">
              Official Meme Receipt • Zero Liabilities
            </span>
            <span className="text-[10px] font-mono text-[#5d5c5b] mt-0.5">
              Ref: {currentReceipt.orderNumber}
            </span>
          </div>

          {/* Big Headline */}
          <div className="flex flex-col items-center text-center my-auto py-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#5d5c5b]">
              Total Fictional Damage
            </span>
            <span className="font-bodoni font-black text-3xl sm:text-4xl text-[#ba0900] tracking-tight leading-none my-1">
              {formatPrice(currentReceipt.subtotalMsrp, currency)}
            </span>
            <div className="bg-[#6cf8bb] text-[#005236] px-3 py-1 rounded-full text-xs font-black uppercase mt-1">
              Real Charged: {formatRealCost(currency)}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#ba0900] mt-1.5 bg-[#ffe8e4] px-2.5 py-0.5 rounded-full border border-[#ba0900]/20">
              Can You Beat My Cart?
            </span>
          </div>

          {/* Itemized Snapshot */}
          <div className="bg-[#efeeeb] p-3 rounded-xl border border-[#1a1c1a]/15 text-xs flex flex-col gap-1.5 my-2">
            <span className="text-[10px] font-bold text-[#5d5c5b] uppercase tracking-wider border-b border-[#1a1c1a]/10 pb-1">
              Acquisitions ({currentReceipt.items.length})
            </span>
            {currentReceipt.items.slice(0, 4).map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between items-center gap-2 text-[11px]">
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={product.image}
                    alt={product.title}
                    width={28}
                    height={28}
                    loading="lazy"
                    className="w-7 h-7 rounded-md object-cover border border-[#1a1c1a]/15 shrink-0"
                  />
                  <span className="font-semibold text-[#1a1c1a] truncate">
                    {quantity}x {product.title}
                  </span>
                </div>
                <span className="font-bodoni font-bold text-[#ba0900]">{formatRealCost(currency)}</span>
              </div>
            ))}
            {currentReceipt.items.length > 4 && (
              <span className="text-[10px] text-[#5d5c5b] italic">
                + {currentReceipt.items.length - 4} more lavish delusions
              </span>
            )}
          </div>

          {/* Bottom Barcode & Verification */}
          <div className="flex flex-col items-center pt-2 border-t-2 border-dashed border-[#1a1c1a] text-center">
            <div className="flex gap-1 items-stretch h-7 w-48 opacity-80 justify-center">
              <div className="bg-[#1a1c1a] w-1" />
              <div className="bg-[#1a1c1a] w-2" />
              <div className="bg-[#1a1c1a] w-0.5" />
              <div className="bg-[#1a1c1a] w-3" />
              <div className="bg-[#1a1c1a] w-1" />
              <div className="bg-[#1a1c1a] w-0.5" />
              <div className="bg-[#1a1c1a] w-2" />
              <div className="bg-[#1a1c1a] w-1" />
              <div className="bg-[#1a1c1a] w-3" />
            </div>
            <span className="text-[9px] font-mono text-[#5d5c5b] tracking-widest mt-1 uppercase">
              100% Guaranteed Non-Existent Debt
            </span>
          </div>
        </div>

        {/* Tactical Viral Share Controls */}
        <div className="w-full flex flex-col gap-2 pt-1 bg-[#faf9f6] p-3.5 rounded-2xl border-2 border-[#1a1c1a] shadow-tactile">
          {/* Primary Action 1: Native Mobile Share or Download */}
          <div className="grid grid-cols-2 gap-2">
            {hasNativeShare || isMobile ? (
              <button
                onClick={handleNativeShare}
                disabled={isSharingNative}
                className="bg-[#ba0900] hover:bg-[#920500] text-white py-3 px-2 rounded-xl text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-tactile active:scale-95 transition-all cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>{isSharingNative ? 'Opening...' : 'Share to Phone'}</span>
              </button>
            ) : (
              <button
                onClick={handleCopyLink}
                className="bg-[#ba0900] hover:bg-[#920500] text-white py-3 px-2 rounded-xl text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-tactile active:scale-95 transition-all cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            )}

            {/* Download 1080x1920 Story Image */}
            <button
              onClick={handleDownloadStoryImage}
              disabled={isDownloading}
              className="bg-white hover:bg-[#efeeeb] text-[#1a1c1a] py-3 px-2 rounded-xl text-[11px] font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 border border-[#1a1c1a] shadow-tactile-sm active:scale-95 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#ba0900]" />
              <span>{isDownloading ? 'Saving...' : 'Save 9:16 PNG'}</span>
            </button>
          </div>

          {/* Social 1-Click Intents: X and Facebook */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleShareToTwitter}
              className="bg-[#1a1c1a] hover:bg-black text-white py-2.5 px-2 rounded-xl text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-tactile-sm active:scale-95 transition-all cursor-pointer"
            >
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>Share on X</span>
            </button>

            <button
              onClick={handleShareToFacebook}
              className="bg-[#1877F2] hover:bg-[#166fe5] text-white py-2.5 px-2 rounded-xl text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-tactile-sm active:scale-95 transition-all cursor-pointer"
            >
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Share to FB</span>
            </button>
          </div>

          {/* Universal Fallbacks: Copy Link & Copy Caption */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCopyLink}
              className="bg-[#efeeeb] hover:bg-[#e4e2de] text-[#1a1c1a] py-2 px-2 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 border border-[#1a1c1a]/20 cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3 h-3 text-[#006c49]" />
                  <span className="text-[#006c49]">Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-[#5d5c5b]" />
                  <span>Copy Link</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopyCaption}
              className="bg-[#efeeeb] hover:bg-[#e4e2de] text-[#1a1c1a] py-2 px-2 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 border border-[#1a1c1a]/20 cursor-pointer"
            >
              {copiedCaption ? (
                <>
                  <Check className="w-3 h-3 text-[#006c49]" />
                  <span className="text-[#006c49]">Caption Copied!</span>
                </>
              ) : (
                <>
                  <FileText className="w-3 h-3 text-[#ba0900]" />
                  <span>Copy Caption</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

