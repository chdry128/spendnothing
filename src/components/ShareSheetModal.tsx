import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { CartItem, OrderReceipt } from '../types';
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
  Share2,
  Copy,
  Check,
  Download,
  Sparkles,
  ExternalLink,
  MessageCircle,
  Smartphone,
  ShieldCheck,
  Flame,
  FileText,
} from 'lucide-react';

interface ShareSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  items?: CartItem[];
  orderReceipt?: OrderReceipt | null;
  customTitle?: string;
}

export const ShareSheetModal: React.FC<ShareSheetModalProps> = ({
  isOpen,
  onClose,
  items: propItems,
  orderReceipt: propReceipt,
  customTitle = 'Can You Beat My Cart?',
}) => {
  const { cart, currentReceipt, userProfile, currency, showToast } = useStore();

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [isDownloadingImage, setIsDownloadingImage] = useState(false);
  const [isSharingNative, setIsSharingNative] = useState(false);

  if (!isOpen) return null;

  // Resolve items and receipt
  const activeItems = propItems || (propReceipt ? propReceipt.items : cart);
  const activeReceipt =
    propReceipt ||
    currentReceipt || {
      orderNumber: 'FS-MEME-' + Math.floor(100000 + Math.random() * 900000),
      items: activeItems,
      subtotalMsrp: activeItems.reduce(
        (sum, item) => sum + item.product.msrp * item.quantity,
        0
      ),
      realCost: 0,
      timestamp: Date.now(),
      funnyQuip: 'Pure fiction, zero real liabilities.',
      deliveryCategory: 'Direct to Consciousness',
    };

  const totalMsrp = activeItems.reduce(
    (sum, item) => sum + item.product.msrp * item.quantity,
    0
  );

  const remixUrl = buildShareableRemixUrl(activeItems, {
    creatorHandle: userProfile.handle,
    challengeNote: 'Can you beat my cart?',
    orderNumber: activeReceipt.orderNumber,
  });

  const fullCaption = buildChallengeCaption({
    items: activeItems,
    creatorHandle: userProfile.handle,
    totalMsrp,
    remixUrl,
    orderNumber: activeReceipt.orderNumber,
    currency,
  });

  const twitterText = buildTwitterChallengeText({
    items: activeItems,
    creatorHandle: userProfile.handle,
    totalMsrp,
    currency,
  });

  const hasNativeShare = isNativeShareSupported();
  const isMobile = isMobileDevice();

  // 1. Native Mobile Share Handler (Requirement 1)
  const handleNativeShare = async () => {
    setIsSharingNative(true);
    let sharedWithFile = false;

    try {
      // Attempt to generate the real 9:16 story image to share directly into mobile apps
      const storyFile = await getStoryReceiptFile({
        receipt: activeReceipt,
        creatorHandle: userProfile.handle,
        currency,
        remixUrl,
      });

      const shared = await triggerNativeShare(
        {
          title: 'Can you beat my cart? — Unlimited Shopping',
          text: `Can you beat my cart? I just spent ${formatPrice(
            totalMsrp,
            currency
          )} for $0.00 REAL! Remix my cart & try to out-spend me:`,
          url: remixUrl,
          files: [storyFile],
        },
        () => handleCopyLink()
      );

      if (shared) {
        sharedWithFile = true;
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#ba0900', '#006c49', '#ffd700'],
        });
      }
    } catch {
      // Fallback to text & URL native share
      await triggerNativeShare(
        {
          title: 'Can you beat my cart? — Unlimited Shopping',
          text: `Can you beat my cart? I just spent ${formatPrice(
            totalMsrp,
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

  // 2. Dedicated One-Click Share to X (Twitter) (Requirement 2)
  const handleShareToTwitter = () => {
    openTwitterShare(twitterText, remixUrl);
    showToast('Opening X (Twitter) share...', 'Challenge Ready');
  };

  // 2. Dedicated One-Click Share to Facebook (Requirement 2)
  const handleShareToFacebook = () => {
    openFacebookShare(
      remixUrl,
      `Can you beat my cart? I just spent ${formatPrice(
        totalMsrp,
        currency
      )} for $0.00 REAL on Unlimited Shopping!`
    );
    showToast('Opening Facebook share dialog...', 'Challenge Ready');
  };

  // 3. Copy Link Action (Requirement 3)
  const handleCopyLink = async () => {
    const success = await copyTextToClipboard(remixUrl);
    if (success) {
      setCopiedLink(true);
      showToast('Remix challenge link copied!', 'Send to group chats or paste on social');
      setTimeout(() => setCopiedLink(false), 2200);
    }
  };

  // 3. Copy Caption Action (Requirement 3)
  const handleCopyCaption = async () => {
    const success = await copyTextToClipboard(fullCaption);
    if (success) {
      setCopiedCaption(true);
      showToast('Caption copied! Ready for Instagram / TikTok paste', 'Copied');
      setTimeout(() => setCopiedCaption(false), 2200);
    }
  };

  // 4. Download 9:16 Story Receipt (Requirement 4)
  const handleDownloadStoryCard = async () => {
    try {
      setIsDownloadingImage(true);
      showToast('Rendering 1080×1920 Story Card...', 'Generating PNG');

      await downloadStoryReceiptImage({
        receipt: activeReceipt,
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
      showToast('Failed to generate image', 'Please try again');
    } finally {
      setIsDownloadingImage(false);
    }
  };

  const topProduct = activeItems[0]?.product;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="relative w-full max-w-md bg-[#faf9f6] text-[#1a1c1a] rounded-3xl border-4 border-[#1a1c1a] shadow-tactile-lg flex flex-col max-h-[92vh] overflow-hidden my-auto">
        {/* Top Header Bar */}
        <div className="bg-[#e9e8e5] px-4 py-3 border-b-2 border-[#1a1c1a] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#ba0900] text-white flex items-center justify-center font-bold text-xs">
              <Share2 className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#ba0900]">
                Viral Dispatch Engine
              </span>
              <span className="text-xs font-black uppercase text-[#1a1c1a]">
                Share Challenge & Receipt
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-[#deddd9] border border-[#1a1c1a] flex items-center justify-center text-[#1a1c1a] transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Container */}
        <div className="p-4 overflow-y-auto flex flex-col gap-4 flex-1">
          {/* Live Unfurl Preview Simulation Card */}
          <div className="bg-white p-3.5 rounded-2xl border-2 border-[#1a1c1a] shadow-tactile flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-[#5d5c5b] border-b border-[#efeeeb] pb-1.5">
              <span>Open Graph Link Preview Card</span>
              <span className="text-[#006c49]">Unfurls on WhatsApp / iMessage / X</span>
            </div>

            <div className="flex items-center gap-3">
              {topProduct?.image ? (
                <img
                  src={topProduct.image}
                  alt={topProduct.title}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-xl object-cover border border-[#1a1c1a]/20 shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-[#e9e8e5] flex items-center justify-center font-bold text-[#ba0900] text-xl shrink-0">
                  F
                </div>
              )}

              <div className="flex flex-col min-w-0">
                <span className="font-bodoni font-bold text-xs uppercase tracking-tight text-[#ba0900]">
                  Can You Beat My Cart?
                </span>
                <span className="font-extrabold text-sm text-[#1a1c1a] truncate">
                  {formatPrice(totalMsrp, currency)} Fantasy Spree
                </span>
                <span className="text-[11px] text-[#5d5c5b] line-clamp-1">
                  {userProfile.handle} challenged you with {topProduct?.title || 'luxury items'}
                </span>
                <span className="text-[10px] font-bold text-[#006c49] mt-0.5">
                  Real Owed: {formatRealCost(currency)} (Paid in Full)
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 1: Native Mobile Sharing (Primary on Mobile) */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5d5c5b]">
                {hasNativeShare || isMobile ? 'Primary Mobile Sharing' : 'Quick Actions'}
              </span>
              <span className="text-[10px] font-semibold text-[#ba0900]">
                Instagram • TikTok • WhatsApp • Messages
              </span>
            </div>

            {hasNativeShare || isMobile ? (
              <button
                onClick={handleNativeShare}
                disabled={isSharingNative}
                className="w-full bg-[#ba0900] hover:bg-[#920500] text-white py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 border-2 border-[#1a1c1a] shadow-tactile active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
                <span>
                  {isSharingNative ? 'Opening Native Share...' : 'Share via Phone (Native Apps)'}
                </span>
              </button>
            ) : (
              <button
                onClick={handleCopyLink}
                className="w-full bg-[#ba0900] hover:bg-[#920500] text-white py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 border-2 border-[#1a1c1a] shadow-tactile active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Remix Challenge Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Remix Challenge Link</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* SECTION 2: Dedicated One-Click Buttons for X and Facebook (Requirement 2) */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5d5c5b]">
              One-Click Social Intents
            </span>

            <div className="grid grid-cols-2 gap-2">
              {/* Share to X (Twitter) */}
              <button
                onClick={handleShareToTwitter}
                className="bg-[#1a1c1a] hover:bg-black text-white py-3 px-3 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 border border-[#1a1c1a] shadow-tactile-sm active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span>Share on X</span>
              </button>

              {/* Share to Facebook */}
              <button
                onClick={handleShareToFacebook}
                className="bg-[#1877F2] hover:bg-[#166fe5] text-white py-3 px-3 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 border border-[#1a1c1a] shadow-tactile-sm active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Share to FB</span>
              </button>
            </div>
          </div>

          {/* SECTION 3: First-Class Universal Fallbacks (Copy Link & Copy Caption) */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5d5c5b]">
              Universal Fallbacks (Instagram / TikTok Manual Flow)
            </span>

            <div className="grid grid-cols-2 gap-2">
              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="bg-white hover:bg-[#efeeeb] text-[#1a1c1a] py-3 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border border-[#1a1c1a] shadow-tactile-sm active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-[#006c49] stroke-[3]" />
                    <span className="text-[#006c49]">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#5d5c5b]" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>

              {/* Copy Caption */}
              <button
                onClick={handleCopyCaption}
                className="bg-white hover:bg-[#efeeeb] text-[#1a1c1a] py-3 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border border-[#1a1c1a] shadow-tactile-sm active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              >
                {copiedCaption ? (
                  <>
                    <Check className="w-4 h-4 text-[#006c49] stroke-[3]" />
                    <span className="text-[#006c49]">Caption Copied!</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 text-[#ba0900]" />
                    <span>Copy Caption</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* SECTION 4: Download 9:16 Story Card (Requirement 4) */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5d5c5b]">
                Story Asset
              </span>
              <span className="text-[10px] font-mono text-[#5d5c5b]">
                1080×1920 PNG • 9:16
              </span>
            </div>

            <button
              onClick={handleDownloadStoryCard}
              disabled={isDownloadingImage}
              className="w-full bg-[#f4f3f0] hover:bg-[#eae8e4] text-[#1a1c1a] py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 border border-[#1a1c1a] shadow-tactile-sm active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#ba0900]" />
              <span>
                {isDownloadingImage
                  ? 'Generating 1080×1920 Story Image...'
                  : 'Download 9:16 Story Card (IG / TikTok)'}
              </span>
            </button>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="bg-[#f4f3f0] px-4 py-3 border-t-2 border-[#1a1c1a] shrink-0 flex items-center justify-center gap-1.5 text-center text-[#5d5c5b]">
          <ShieldCheck className="w-4 h-4 text-[#006c49]" />
          <span className="text-[11px] font-semibold">
            All links contain zero personal data and bill exactly $0.00.
          </span>
        </div>
      </div>
    </div>
  );
};
