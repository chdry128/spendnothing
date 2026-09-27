/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { lazy, Suspense, useState, useEffect } from 'react';
import { useStore } from './store/useStore';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ToastNotification } from './components/ToastNotification';
const ProductDetailModal = lazy(() => import('./components/ProductDetailModal').then((module) => ({ default: module.ProductDetailModal })));
const StoryReceiptModal = lazy(() => import('./components/StoryReceiptModal').then((module) => ({ default: module.StoryReceiptModal })));
const SurpriseMeModal = lazy(() => import('./components/SurpriseMeModal').then((module) => ({ default: module.SurpriseMeModal })));
const PlayView = lazy(() => import('./components/views/PlayView').then((module) => ({ default: module.PlayView })));
const WorldsView = lazy(() => import('./components/views/WorldsView').then((module) => ({ default: module.WorldsView })));
const CartView = lazy(() => import('./components/views/CartView').then((module) => ({ default: module.CartView })));
const CheckoutConfirmationView = lazy(() => import('./components/views/CheckoutConfirmationView').then((module) => ({ default: module.CheckoutConfirmationView })));
const GameView = lazy(() => import('./components/views/GameView').then((module) => ({ default: module.GameView })));
const RemixLandingView = lazy(() => import('./components/views/RemixLandingView').then((module) => ({ default: module.RemixLandingView })));
import { formatPrice } from './utils/formatters';
import { decodeCartFromRemix } from './utils/remixCodec';
import { updateDocumentMetaTags } from './utils/metaTags';
import { Timer, X } from 'lucide-react';

export default function App() {
  const {
    activeTab,
    activeChallenge,
    stopChallenge,
    getTotalMSRP,
    currency,
    remixCartData,
    setRemixCartData,
  } = useStore();
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);

  // Check URL query parameters for ?remix= on mount and on popstate
  useEffect(() => {
    const handleCheckUrlRemix = () => {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      const remixParam = params.get('remix');
      if (remixParam) {
        const decoded = decodeCartFromRemix(remixParam);
        if (decoded) {
          setRemixCartData(decoded);
        }
      }
    };

    handleCheckUrlRemix();
    window.addEventListener('popstate', handleCheckUrlRemix);
    return () => window.removeEventListener('popstate', handleCheckUrlRemix);
  }, [setRemixCartData]);

  // Dynamically update document title and social OpenGraph tags
  useEffect(() => {
    updateDocumentMetaTags(remixCartData);
  }, [remixCartData]);

  const currentCartTotal = getTotalMSRP();

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#1a1c1a] flex flex-col font-sans selection:bg-[#ffdad4] selection:text-[#ba0900]">
      {/* Toast Notification Container */}
      <ToastNotification />

      {/* Main Persistent Header */}
      <Header />

      {/* Floating Active Challenge HUD (if a speedrun or gauntlet is running) */}
      {activeChallenge && activeChallenge.isRunning && (
        <div className="fixed top-28 left-4 right-4 z-30 max-w-md mx-auto pointer-events-auto">
          <div className="bg-[#1a1c1a] text-white px-3.5 py-2 rounded-xl shadow-tactile border border-white/20 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-[#ba0900] animate-spin" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6cf8bb]">
                  Challenge Active • {activeChallenge.timeRemaining}s left
                </span>
                <span className="text-xs font-bold">
                  Target: {formatPrice(activeChallenge.targetBudget, currency)} (Current: {formatPrice(currentCartTotal, currency)})
                </span>
              </div>
            </div>
            <button
              onClick={stopChallenge}
              className="p-1 hover:bg-white/20 rounded text-white/80 hover:text-white"
              title="Stop Challenge"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <Suspense fallback={<main className="flex-1 w-full pt-28 pb-8" aria-busy="true" />}> 
        <main className="flex-1 w-full pt-28 pb-8">
          {(activeTab === 'remix' || remixCartData !== null) && <RemixLandingView />}
          {activeTab === 'play' && !remixCartData && <PlayView />}
          {activeTab === 'worlds' && !remixCartData && <WorldsView />}
          {activeTab === 'cart' && !remixCartData && <CartView />}
          {activeTab === 'receipt' && !remixCartData && (
            <CheckoutConfirmationView onOpenStoryModal={() => setIsStoryModalOpen(true)} />
          )}
          {activeTab === 'game' && !remixCartData && <GameView />}
        </main>
      </Suspense>

      {/* Persistent Bottom Tab Navigation */}
      <BottomNav />

      <Suspense fallback={null}>
        <SurpriseMeModal />
        <ProductDetailModal />
        <StoryReceiptModal
          isOpen={isStoryModalOpen}
          onClose={() => setIsStoryModalOpen(false)}
        />
      </Suspense>
    </div>
  );
}
