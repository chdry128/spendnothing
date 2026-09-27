import { Product, Challenge } from '../types';
import productsData from './products.json';

export const PRODUCTS: Product[] = productsData as unknown as Product[];

export const CHALLENGES: Challenge[] = [
  {
    id: 'speedrun-1m',
    title: 'Blow Exactly $1,000,000 in 60 Seconds',
    subtitle: 'Daily Speed Run • Target: $1,000,000 ±$500',
    description: 'Hit within ±$500 of $1,000,000 without tipping over. Max 1 luxury jet/island item (≤ $600k cap). No cart recalculations.',
    difficulty: 'Expert',
    winRate: '4.8%',
    targetBudget: 1000000,
    toleranceDelta: 500,
    timeLimitSeconds: 60,
    badgeReward: 'Certified Deranged Hedonist',
    category: 'Daily Speed Run',
    currentRecord: '00:18.4s by @SpeedSpender',
    icon: 'timer',
    rules: [
      'Final imaginary cart must land within ±$500 of $1,000,000',
      'Time limit strictly 60 seconds',
      'Maximum 1 mega-whale item',
      'Zero real dollars spent'
    ]
  },
  {
    id: 'exact-10k',
    title: 'Spend Exactly $10,000',
    subtitle: 'The Impossible Precision Match • Zero Cents Left',
    description: 'The Impossible Precision Match. Zero cents left over. Every single penny must balance out to exactly $10,000.',
    difficulty: 'Expert',
    winRate: '3.2%',
    targetBudget: 10000,
    toleranceDelta: 0,
    timeLimitSeconds: 90,
    badgeReward: 'The Surgeon of Waste',
    category: 'Precision Arena',
    currentRecord: '00:41.2s by @MathGenius',
    icon: 'pin_drop',
    rules: [
      'Exactly $10,000.00 — not a dollar more or less',
      'Requires mixing odd-price items',
      'Flawless accounting satisfaction'
    ]
  },
  {
    id: 'most-useless',
    title: 'The Most Useless Cart',
    subtitle: 'Community Voting Open • Leader: Banana Peeler ($4.2M)',
    description: 'Highest ratio of astronomical price to zero practical utility (e.g. Gold T-Rex skull, diamond toothpick, lunar parking).',
    difficulty: 'Medium',
    winRate: '12.4%',
    targetBudget: 5000000,
    toleranceDelta: 1000000,
    timeLimitSeconds: 120,
    badgeReward: 'Arch-Duke of Futility',
    category: 'Community Voting',
    currentRecord: 'Titanium Banana Peeler ($4.2M)',
    icon: 'psychology_alt',
    rules: [
      'Items must possess zero daily functional utility',
      'Judged by algorithmic uselessness index',
      'Peer votes crown the weekly champion'
    ]
  },
  {
    id: 'first-paycheck',
    title: 'First Paycheck Revenge',
    subtitle: 'Nostalgia Tier • Cap: $3,500',
    description: 'Buy every single item your teenage self broke down crying for at the mall kiosk in 1999.',
    difficulty: 'Easy',
    winRate: '48.9%',
    targetBudget: 3500,
    toleranceDelta: 200,
    timeLimitSeconds: 60,
    badgeReward: '1999 Mall Kiosk Pass',
    category: 'Nostalgia Tier',
    currentRecord: '00:14.1s by @RetroKid',
    icon: 'videogame_asset',
    rules: [
      'Budget cap $3,500 maximum',
      'Nostalgic items and retro gaming only',
      'Instant psychological healing'
    ]
  },
  {
    id: 'five-minute-billionaire',
    title: 'The 5-Minute Billionaire',
    subtitle: 'Mega Whale Challenge • Target: $50,000,000',
    description: 'Dump $50,000,000 into offshore yachts, hypercars, and space shuttles before your espresso cools down.',
    difficulty: 'Mega Whale',
    winRate: '8.1%',
    targetBudget: 50000000,
    toleranceDelta: 500000,
    timeLimitSeconds: 300,
    badgeReward: 'Global Oligarch of Nothing',
    category: 'Mega Whale',
    currentRecord: '02m:14s by @ElonFake',
    icon: 'flight_takeoff',
    rules: [
      'Spend at least $50,000,000 in under 5 minutes',
      'Must include minimum 3 distinct sectors',
      'High-speed cart saturation required'
    ]
  }
];

export const FUNNY_QUIPS = [
  'Added! Your imaginary accountant just resigned.',
  'Cha-ching! $0 charged. High status unlocked.',
  'Purchased! Pure unadulterated luxury dopamine.',
  'Order confirmed. Your imaginary credit score skyrocketed.',
  'Acquired. What else shouldn’t you buy today?',
  'Extremely sound financial move. Guaranteed zero liabilities.',
  'Cost to your actual wallet: $0.00.',
  'Pure status, zero consequences.',
  'Your fake banker is pouring a celebratory scotch.',
  'Added directly to fantasy ledger with zero regrets.'
];
