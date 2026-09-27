import { Currency } from '../types';

/**
 * Currency configuration with exchange rate approximations for fantasy scaling
 * and proper Intl.NumberFormat parameters.
 */
interface CurrencyConfig {
  locale: string;
  currencyCode?: string;
  symbol: string;
  rate: number; // Multiplier from base USD
  fractionDigits: number;
}

const CURRENCY_CONFIGS: Record<Currency, CurrencyConfig> = {
  USD: {
    locale: 'en-US',
    currencyCode: 'USD',
    symbol: '$',
    rate: 1,
    fractionDigits: 0,
  },
  EUR: {
    locale: 'de-DE',
    currencyCode: 'EUR',
    symbol: '€',
    rate: 0.92,
    fractionDigits: 0,
  },
  GBP: {
    locale: 'en-GB',
    currencyCode: 'GBP',
    symbol: '£',
    rate: 0.78,
    fractionDigits: 0,
  },
  JPY: {
    locale: 'ja-JP',
    currencyCode: 'JPY',
    symbol: '¥',
    rate: 155,
    fractionDigits: 0,
  },
  FANTASY: {
    locale: 'en-US',
    symbol: '₣',
    rate: 1,
    fractionDigits: 0,
  },
};

/**
 * Formats a monetary value according to the active fictional currency
 * using locale-aware Intl.NumberFormat.
 */
export function formatPrice(
  amountInUSD: number,
  currency: Currency = 'USD',
  options: {
    showDecimals?: boolean;
    compact?: boolean;
    userLocale?: string;
  } = {}
): string {
  const config = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.USD;
  const locale = options.userLocale || (typeof navigator !== 'undefined' ? navigator.language : config.locale) || 'en-US';
  const converted = Math.round(amountInUSD * config.rate);

  if (currency === 'FANTASY') {
    if (options.compact && converted >= 1000000) {
      return `₣${(converted / 1000000).toFixed(1)}M`;
    }
    if (options.compact && converted >= 1000) {
      return `₣${(converted / 1000).toFixed(0)}K`;
    }
    return `₣${new Intl.NumberFormat(locale).format(converted)}`;
  }

  if (options.compact) {
    if (converted >= 1000000000) {
      return `${config.symbol}${(converted / 1000000000).toFixed(1)}B`;
    }
    if (converted >= 1000000) {
      return `${config.symbol}${(converted / 1000000).toFixed(1)}M`;
    }
    if (converted >= 10000) {
      return `${config.symbol}${(converted / 1000).toFixed(0)}K`;
    }
  }

  try {
    if (config.currencyCode) {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: config.currencyCode,
        maximumFractionDigits: options.showDecimals ? 2 : config.fractionDigits,
        minimumFractionDigits: options.showDecimals ? 2 : 0,
      }).format(converted);
    }
  } catch {
    // Fallback if browser locale/currency is unavailable
  }

  return `${config.symbol}${new Intl.NumberFormat(locale).format(converted)}`;
}

/**
 * Formats the real-world cost which is strictly guaranteed $0.00
 */
export function formatRealCost(currency: Currency = 'USD'): string {
  const config = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.USD;
  if (currency === 'FANTASY') return '₣0.00';
  return `${config.symbol}0.00`;
}
