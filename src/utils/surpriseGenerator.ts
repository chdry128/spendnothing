import { CartItem, ChaosBudgetTier, Product } from '../types';
import { PRODUCTS } from '../data/products';

export interface SurpriseScenario {
  title: string;
  subtitle: string;
  targetBudget: number;
  tier: ChaosBudgetTier;
}

const ABSURD_SCENARIOS: SurpriseScenario[] = [
  {
    title: 'Late Night Impulse Spiral',
    subtitle: 'Zero sleep, maximum dopamine checkout frenzy.',
    targetBudget: 8500,
    tier: '10k',
  },
  {
    title: 'Midlife Crisis Tech Deluxe',
    subtitle: 'Replacing genuine emotional stability with excessive compute and vintage audio.',
    targetBudget: 85000,
    tier: '100k',
  },
  {
    title: 'Silicon Valley Angel Regret',
    subtitle: 'Liquidated seed shares into underground bunkers and hyper-niche supercars.',
    targetBudget: 850000,
    tier: '1m',
  },
  {
    title: 'Neo-Feudalist Supervillain',
    subtitle: 'Purchasing entire coastal cliffs and orbital suites to avoid eye contact with neighbors.',
    targetBudget: 75000000,
    tier: 'inf',
  },
  {
    title: 'Monaco Casino Runaway',
    subtitle: 'One lucky roulette spin turned into immediate, irreversible material delusion.',
    targetBudget: 42000000,
    tier: 'inf',
  },
];

export interface GeneratedSurpriseResult {
  items: CartItem[];
  scenario: SurpriseScenario;
  totalMSRP: number;
}

/**
 * Generates a random cart honoring the specified chaos budget tier or an unhinged persona.
 */
export function generateSurpriseCart(tier?: ChaosBudgetTier): GeneratedSurpriseResult {
  let selectedScenario: SurpriseScenario;

  if (tier) {
    if (tier === '10k') {
      selectedScenario = {
        title: 'The $10K Modest Decadence',
        subtitle: 'Catering to irrational high-end daily indulgences.',
        targetBudget: 10000,
        tier: '10k',
      };
    } else if (tier === '100k') {
      selectedScenario = {
        title: 'The $100K High Roller Spree',
        subtitle: 'Serious imaginary capital deployed on deeply unnecessary artifacts.',
        targetBudget: 100000,
        tier: '100k',
      };
    } else if (tier === '1m') {
      selectedScenario = {
        title: 'The $1M Whale Portfolio',
        subtitle: 'Entering seven-figure financial delusion territory with absolute pride.',
        targetBudget: 1000000,
        tier: '1m',
      };
    } else {
      selectedScenario = {
        title: 'The Infinite Delusion Spree',
        subtitle: 'Blowing hundreds of millions because numbers are merely suggestions.',
        targetBudget: 150000000,
        tier: 'inf',
      };
    }
  } else {
    // Pick an absurd random scenario
    selectedScenario = ABSURD_SCENARIOS[Math.floor(Math.random() * ABSURD_SCENARIOS.length)];
  }

  // Pick 3 to 5 products tailored to the target budget
  const shuffled = [...PRODUCTS].sort(() => 0.5 - Math.random());
  const selectedProducts: { product: Product; quantity: number }[] = [];

  if (selectedScenario.tier === '10k') {
    // Select items under $8,000
    const affordable = shuffled.filter((p) => p.msrp <= 7000);
    const picks = affordable.slice(0, Math.floor(Math.random() * 2) + 3);
    for (const p of picks) {
      selectedProducts.push({ product: p, quantity: 1 });
    }
  } else if (selectedScenario.tier === '100k') {
    // Select a mix of mid and high-tier items
    const midTier = shuffled.filter((p) => p.msrp >= 5000 && p.msrp <= 95000);
    const lowTier = shuffled.filter((p) => p.msrp < 5000);
    const picks = [
      ...midTier.slice(0, 2),
      ...lowTier.slice(0, 2),
    ];
    for (const p of picks) {
      selectedProducts.push({ product: p, quantity: 1 });
    }
  } else if (selectedScenario.tier === '1m') {
    // Select items around $100K to $800K
    const highTier = shuffled.filter((p) => p.msrp >= 50000 && p.msrp <= 900000);
    const luxury = shuffled.filter((p) => p.msrp > 1000 && p.msrp < 50000);
    const picks = [
      ...highTier.slice(0, 2),
      ...luxury.slice(0, 2),
    ];
    for (const p of picks) {
      selectedProducts.push({ product: p, quantity: 1 });
    }
  } else {
    // Infinite / unhinged: include at least 1-2 mega items ($10M+) plus crazy items
    const megaTier = shuffled.filter((p) => p.msrp >= 5000000);
    const others = shuffled.filter((p) => p.msrp < 5000000);
    const picks = [
      ...megaTier.slice(0, 2),
      ...others.slice(0, 2),
    ];
    for (const p of picks) {
      selectedProducts.push({ product: p, quantity: 1 });
    }
  }

  // Ensure at least 3 items
  if (selectedProducts.length < 3) {
    const fallbackPicks = shuffled.slice(0, 3);
    selectedProducts.length = 0;
    for (const p of fallbackPicks) {
      selectedProducts.push({ product: p, quantity: 1 });
    }
  }

  const items: CartItem[] = selectedProducts.map(({ product, quantity }) => ({
    product,
    quantity,
    addedAt: Date.now(),
  }));

  const totalMSRP = items.reduce((acc, curr) => acc + curr.product.msrp * curr.quantity, 0);

  return {
    items,
    scenario: selectedScenario,
    totalMSRP,
  };
}

const MAKE_IT_WORSE_MESSAGES = [
  '🔥 Substituted a sensible purchase with a multi-million-dollar architectural monstrosity!',
  '⚡ Escalated into unhinged billionaire territory. Fictional credit score disintegrated.',
  '🚨 Swapped budget-tier nonsense for museum-grade solid gold centerpiece!',
  '👑 Doubled the allocation of pure absurdity. Pretentiousness up by 850%.',
  '💥 Added space-age orbital parking permits. Your pretend accountant has quit.',
  '💸 Massive escalation! Destabilizing 3 fictional central banks simultaneously.',
];

/**
 * "Make It Worse" mechanic: Swaps in more expensive/more absurd items from the catalog, escalating the total!
 */
export function makeCartWorse(currentItems: CartItem[]): {
  newItems: CartItem[];
  escalationDelta: number;
  message: string;
} {
  if (currentItems.length === 0) {
    const fresh = generateSurpriseCart('inf');
    return {
      newItems: fresh.items,
      escalationDelta: fresh.totalMSRP,
      message: 'Empty cart escalated to infinite delusion status!',
    };
  }

  // Find ultra-expensive / unhinged items from the catalog
  const ultraExpensiveCatalog = [...PRODUCTS]
    .filter((p) => p.msrp >= 2000000)
    .sort((a, b) => b.msrp - a.msrp);

  // Check which ultra items are NOT yet in the cart
  const currentIds = currentItems.map((i) => i.product.id);
  const availableUltra = ultraExpensiveCatalog.filter((p) => !currentIds.includes(p.id));

  const initialTotal = currentItems.reduce(
    (sum, item) => sum + item.product.msrp * item.quantity,
    0
  );

  let newItems = [...currentItems];

  if (availableUltra.length > 0) {
    // Pick the most absurd ultra product
    const ultraItem = availableUltra[Math.floor(Math.random() * Math.min(availableUltra.length, 4))];

    // Find the cheapest item in the current cart to replace, or add it if cart is small
    if (newItems.length >= 4) {
      // Find index of lowest priced item
      let minIdx = 0;
      let minPrice = Infinity;
      for (let i = 0; i < newItems.length; i++) {
        if (newItems[i].product.msrp < minPrice) {
          minPrice = newItems[i].product.msrp;
          minIdx = i;
        }
      }
      // Replace it!
      newItems[minIdx] = {
        product: ultraItem,
        quantity: 1,
        addedAt: Date.now(),
      };
    } else {
      // Add directly
      newItems = [
        { product: ultraItem, quantity: 1, addedAt: Date.now() },
        ...newItems,
      ];
    }
  } else {
    // If all ultra items are already in cart, double the quantity of the highest item
    let maxIdx = 0;
    let maxPrice = 0;
    for (let i = 0; i < newItems.length; i++) {
      if (newItems[i].product.msrp > maxPrice) {
        maxPrice = newItems[i].product.msrp;
        maxIdx = i;
      }
    }
    newItems[maxIdx] = {
      ...newItems[maxIdx],
      quantity: newItems[maxIdx].quantity + 1,
    };
  }

  const newTotal = newItems.reduce(
    (sum, item) => sum + item.product.msrp * item.quantity,
    0
  );

  const escalationDelta = Math.max(0, newTotal - initialTotal);
  const message =
    MAKE_IT_WORSE_MESSAGES[Math.floor(Math.random() * MAKE_IT_WORSE_MESSAGES.length)];

  return {
    newItems,
    escalationDelta,
    message,
  };
}
