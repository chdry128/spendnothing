export type CategoryId =
  | 'all'
  | 'tech'
  | 'cars'
  | 'home'
  | 'fashion'
  | 'gaming'
  | 'travel'
  | 'luxury'
  | 'food'
  | 'nostalgia'
  | 'collectibles'
  | 'weird'
  | 'why-exist'
  | 'rich'
  | 'dream'
  | 'absurd';

export type ChaosBudgetTier = '10k' | '100k' | '1m' | 'inf';

export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'FANTASY';

export interface ProductReview {
  author: string;
  role: string;
  text: string;
  stars: number;
  time: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string; // Fictional product name
  title: string; // Alias for name
  category: CategoryId;
  categoryLabel: string;
  sectorLabel: string;
  sectorIndex: string;
  msrp: number; // Imaginary price in USD base (spanning $12 to $100M+)
  price: 0; // Strictly $0.00
  hook: string; // A punchy one-line hook for the card
  subtitle: string;
  description: string;
  image: string;
  imagePrompt: string; // Detailed prompt to regenerate or source independently
  tag: string;
  tagType?: 'danger' | 'warning' | 'dark' | 'mint' | 'primary';
  subBadge?: string;
  weight?: string;
  deliveryEta?: string;
  deliveryType?: string;
  itemCode?: string;
  stockCount?: number;
  whyWant: string;
  whyWantBadges: string[];
  whyDontNeed: string;
  whyDontNeedBadges: string[];
  specs: ProductSpec[]; // 2-3 absurd spec sheet entries
  included: string[];
  reviews: ProductReview[];
  complementaryIds?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: number;
}

export interface Challenge {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Expert' | 'Mega Whale';
  winRate?: string;
  targetBudget: number;
  toleranceDelta: number;
  timeLimitSeconds: number;
  badgeReward: string;
  category: string;
  currentRecord?: string;
  icon: string;
  rules: string[];
}

export interface OrderReceipt {
  orderNumber: string;
  date: string;
  items: CartItem[];
  subtotalMsrp: number;
  realTotal: 0;
  discount: number;
  chaosLevel: string;
  chaosPercent: number;
  achievement: {
    title: string;
    description: string;
  };
  logistics: {
    status: string;
    description: string;
    completed: boolean;
    active?: boolean;
    time?: string;
  }[];
}

export type TabType = 'play' | 'worlds' | 'game' | 'cart' | 'receipt' | 'remix';
