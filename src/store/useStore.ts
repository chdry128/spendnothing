import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, ChaosBudgetTier, Currency, OrderReceipt, Product, TabType } from '../types';
import { PRODUCTS, FUNNY_QUIPS } from '../data/products';
import { DecodedRemixCart } from '../utils/remixCodec';

interface ToastState {
  id: number;
  message: string;
  subMessage?: string;
  type?: 'success' | 'warning' | 'info';
}

interface ActiveChallengeState {
  challengeId: string;
  startedAt: number;
  timeRemaining: number;
  targetBudget: number;
  tolerance: number;
  isRunning: boolean;
}

interface StoreState {
  // Navigation & UI
  activeTab: TabType;
  selectedProductId: string | null;
  currency: Currency;
  chaosBudgetTier: ChaosBudgetTier;
  toast: ToastState | null;

  // Surprise Me & Viral Flow
  isSurpriseMeOpen: boolean;
  remixCartData: DecodedRemixCart | null;

  // Cart & Ledger
  cart: CartItem[];
  likedIds: string[];
  currentReceipt: OrderReceipt | null;
  orderHistory: OrderReceipt[];

  // Profile & Gamification
  userProfile: {
    handle: string;
    avatar: string;
    prestige: string;
    statusTier: string;
    wins: number;
    totalFakeSpent: number;
    trophyClaimed: boolean;
  };

  // Active Challenge / Speed run
  activeChallenge: ActiveChallengeState | null;

  // Actions
  setActiveTab: (tab: TabType) => void;
  openProduct: (id: string) => void;
  closeProduct: () => void;
  setCurrency: (curr: Currency) => void;
  setChaosBudgetTier: (tier: ChaosBudgetTier) => void;
  toggleLike: (id: string) => void;

  // Surprise Me actions
  openSurpriseMe: () => void;
  closeSurpriseMe: () => void;

  // Remix actions
  setRemixCartData: (data: DecodedRemixCart | null) => void;
  applyRemixToLedger: () => void;
  dismissRemix: () => void;

  // Cart actions
  setCart: (newCart: CartItem[]) => void;
  addMultipleToCart: (items: CartItem[]) => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  surpriseImpulseBuy: () => Product | null;
  checkout: () => OrderReceipt;

  // Game actions
  startChallenge: (challengeId: string, targetBudget: number, timeLimit: number, tolerance?: number) => void;
  tickChallenge: () => void;
  stopChallenge: () => void;
  claimTrophy: () => void;

  // Toast actions
  showToast: (message: string, subMessage?: string) => void;
  dismissToast: () => void;

  // Helpers
  getTotalMSRP: () => number;
  getCartItemCount: () => number;
}

// Initial starter cart matching the design mockup for immediate tactile delight!
const DEFAULT_INITIAL_CART: CartItem[] = [
  {
    product: PRODUCTS.find(p => p.id === 'gold-trex') || PRODUCTS[0],
    quantity: 1,
    addedAt: Date.now() - 3600000,
  },
  {
    product: PRODUCTS.find(p => p.id === 'rtx-9090') || PRODUCTS[3],
    quantity: 2,
    addedAt: Date.now() - 2400000,
  },
  {
    product: PRODUCTS.find(p => p.id === 'sub-tender') || PRODUCTS[5],
    quantity: 1,
    addedAt: Date.now() - 1200000,
  },
  {
    product: PRODUCTS.find(p => p.id === 'subzero-espresso') || PRODUCTS[4],
    quantity: 1,
    addedAt: Date.now() - 600000,
  },
];

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      activeTab: 'play',
      selectedProductId: null,
      currency: 'USD',
      chaosBudgetTier: 'inf',
      toast: null,

      isSurpriseMeOpen: false,
      remixCartData: null,

      cart: DEFAULT_INITIAL_CART,
      likedIds: ['gold-trex'],
      currentReceipt: null,
      orderHistory: [],

      userProfile: {
        handle: '@OverkillKing',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
        prestige: 'Prestige IV',
        statusTier: 'Tier 4: Aspirational Menace',
        wins: 7,
        totalFakeSpent: 42800000,
        trophyClaimed: false,
      },

      activeChallenge: null,

      setActiveTab: (tab) => set({ activeTab: tab }),

      openProduct: (id) => set({ selectedProductId: id }),
      closeProduct: () => set({ selectedProductId: null }),

      setCurrency: (currency) => set({ currency }),
      setChaosBudgetTier: (chaosBudgetTier) => set({ chaosBudgetTier }),

      toggleLike: (id) => {
        const { likedIds } = get();
        const exists = likedIds.includes(id);
        const updated = exists ? likedIds.filter((item) => item !== id) : [...likedIds, id];
        set({ likedIds: updated });
      },

      openSurpriseMe: () => set({ isSurpriseMeOpen: true }),
      closeSurpriseMe: () => set({ isSurpriseMeOpen: false }),

      setRemixCartData: (data) =>
        set({
          remixCartData: data,
          activeTab: data ? 'remix' : get().activeTab === 'remix' ? 'play' : get().activeTab,
        }),

      applyRemixToLedger: () => {
        const { remixCartData } = get();
        if (!remixCartData) return;
        set({
          cart: [...remixCartData.items],
          remixCartData: null,
          activeTab: 'cart',
        });
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href);
          url.searchParams.delete('remix');
          window.history.replaceState({}, '', url.pathname);
        }
        get().showToast('Cart remixed into your Fantasy Ledger!', 'Modify, add, or flush to beat it!');
      },

      dismissRemix: () => {
        set({
          remixCartData: null,
          activeTab: 'play',
        });
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href);
          url.searchParams.delete('remix');
          window.history.replaceState({}, '', url.pathname);
        }
      },

      setCart: (newCart) => set({ cart: newCart }),

      addMultipleToCart: (items) => {
        const { cart } = get();
        let updatedCart = [...cart];
        for (const newItem of items) {
          const idx = updatedCart.findIndex((c) => c.product.id === newItem.product.id);
          if (idx > -1) {
            updatedCart[idx] = {
              ...updatedCart[idx],
              quantity: updatedCart[idx].quantity + newItem.quantity,
            };
          } else {
            updatedCart = [newItem, ...updatedCart];
          }
        }
        set({ cart: updatedCart });
        get().showToast(`Added ${items.length} items to Fantasy Ledger!`, '+$0.00 REAL');
      },

      addToCart: (product, quantity = 1) => {
        const { cart } = get();
        const existingIndex = cart.findIndex((item) => item.product.id === product.id);

        let newCart: CartItem[];
        if (existingIndex > -1) {
          newCart = cart.map((item, idx) =>
            idx === existingIndex ? { ...item, quantity: item.quantity + quantity } : item
          );
        } else {
          newCart = [{ product, quantity, addedAt: Date.now() }, ...cart];
        }

        const randomQuip = FUNNY_QUIPS[Math.floor(Math.random() * FUNNY_QUIPS.length)];
        get().showToast(randomQuip, '+$0.00 REAL');

        set({ cart: newCart });
      },

      removeFromCart: (productId) => {
        const { cart } = get();
        const newCart = cart.filter((item) => item.product.id !== productId);
        set({ cart: newCart });
        get().showToast('Removed from fantasy. Back to modest decadence.', 'Saved $0.00');
      },

      updateQuantity: (productId, delta) => {
        const { cart } = get();
        const newCart = cart
          .map((item) => {
            if (item.product.id === productId) {
              const newQty = item.quantity + delta;
              return newQty > 0 ? { ...item, quantity: newQty } : null;
            }
            return item;
          })
          .filter(Boolean) as CartItem[];

        set({ cart: newCart });
      },

      clearCart: () => {
        set({ cart: [] });
        get().showToast('Fantasy ledger completely flushed.', 'Zero liabilities remaining');
      },

      surpriseImpulseBuy: () => {
        const { cart } = get();
        const cartProductIds = cart.map((c) => c.product.id);
        const candidates = PRODUCTS.filter((p) => !cartProductIds.includes(p.id));

        const itemToPick = candidates.length > 0
          ? candidates[Math.floor(Math.random() * candidates.length)]
          : PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];

        if (itemToPick) {
          get().addToCart(itemToPick, 1);
          return itemToPick;
        }
        return null;
      },

      checkout: () => {
        const { cart, userProfile } = get();
        const subtotal = cart.reduce((acc, curr) => acc + curr.product.msrp * curr.quantity, 0);

        const receipt: OrderReceipt = {
          orderNumber: `#FS-DELUSION-${Math.floor(10000 + Math.random() * 90000)}`,
          date: 'TODAY • FANTASY STD TIME',
          items: [...cart],
          subtotalMsrp: subtotal,
          realTotal: 0,
          discount: subtotal,
          chaosLevel: 'Unhinged Billionaire',
          chaosPercent: 88,
          achievement: {
            title: 'THE CHAOS MAXIMALIST',
            description: "You don't just shop; you destabilize fictional economies.",
          },
          logistics: [
            {
              status: 'Order Placed in Alternate Universe',
              description: 'The simulation validated your lavish taste immediately.',
              completed: true,
              time: '1 MIN AGO',
            },
            {
              status: 'Warehouse Staff Confused but Compliant',
              description: 'Forklift team attempting to locate a 40-foot dinosaur skeleton.',
              completed: true,
              time: 'JUST NOW',
            },
            {
              status: 'Delivery Driver Questioning Life Decisions',
              description: 'Currently cruising interstate 95 wondering why shipping was free.',
              completed: false,
              active: true,
              time: 'NOW PLAYING',
            },
            {
              status: 'Gold Dino Loaded onto Cargo Zeppelin',
              description: 'Awaiting clearance from fictional air traffic control.',
              completed: false,
              time: 'PENDING STAGE 4',
            },
            {
              status: 'Delivered to Your Pure Imagination',
              description: 'Signatures will be signed in mental endorphins.',
              completed: false,
              time: 'DESTINATION',
            },
          ],
        };

        const updatedHistory = [receipt, ...get().orderHistory];
        const newFakeSpent = userProfile.totalFakeSpent + subtotal;

        set({
          currentReceipt: receipt,
          orderHistory: updatedHistory,
          activeTab: 'receipt',
          userProfile: {
            ...userProfile,
            totalFakeSpent: newFakeSpent,
            wins: userProfile.wins + 1,
          },
        });

        get().showToast('Receipt issued! Absolute zero real dollars billed.', 'CONFIRMED');
        return receipt;
      },

      startChallenge: (challengeId, targetBudget, timeLimit, tolerance = 500) => {
        set({
          activeChallenge: {
            challengeId,
            startedAt: Date.now(),
            timeRemaining: timeLimit,
            targetBudget,
            tolerance,
            isRunning: true,
          },
        });
        get().showToast(`Gauntlet Started! Target: $${targetBudget.toLocaleString()}`, 'Timer is running!');
      },

      tickChallenge: () => {
        const { activeChallenge } = get();
        if (!activeChallenge || !activeChallenge.isRunning) return;

        const nextTime = Math.max(0, activeChallenge.timeRemaining - 1);
        if (nextTime === 0) {
          set({
            activeChallenge: {
              ...activeChallenge,
              timeRemaining: 0,
              isRunning: false,
            },
          });
          get().showToast('Time Expired on Speed Run Challenge!', 'Check your delta score');
        } else {
          set({
            activeChallenge: {
              ...activeChallenge,
              timeRemaining: nextTime,
            },
          });
        }
      },

      stopChallenge: () => {
        set({ activeChallenge: null });
      },

      claimTrophy: () => {
        const { userProfile } = get();
        set({
          userProfile: {
            ...userProfile,
            trophyClaimed: true,
          },
        });
        get().showToast('🏆 Trophy Claimed! ($0 Value Added)', 'Prestige incremented!');
      },

      showToast: (message, subMessage) => {
        set({
          toast: {
            id: Date.now(),
            message,
            subMessage,
          },
        });
      },

      dismissToast: () => set({ toast: null }),

      getTotalMSRP: () => {
        const { cart } = get();
        return cart.reduce((acc, curr) => acc + curr.product.msrp * curr.quantity, 0);
      },

      getCartItemCount: () => {
        const { cart } = get();
        return cart.reduce((acc, curr) => acc + curr.quantity, 0);
      },
    }),
    {
      name: 'fake-shopping-storage',
      partialize: (state) => ({
        cart: state.cart,
        likedIds: state.likedIds,
        userProfile: state.userProfile,
        orderHistory: state.orderHistory,
        currency: state.currency,
        chaosBudgetTier: state.chaosBudgetTier,
      }),
    }
  )
);
