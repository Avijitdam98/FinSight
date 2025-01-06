import axios from 'axios';

const API_KEY = 'd614f605522c466a9f7d7ede';
const BASE_URL = 'https://v6.exchangerate-api.com/v6';

// Cache exchange rates for 1 hour
let ratesCache = {
  timestamp: 0,
  rates: {}
};

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export const getExchangeRates = async (baseCurrency = 'USD') => {
  try {
    // Check if we have cached rates that aren't expired
    const now = Date.now();
    if (
      ratesCache.rates[baseCurrency] &&
      now - ratesCache.timestamp < CACHE_DURATION
    ) {
      return ratesCache.rates[baseCurrency];
    }

    // Fetch new rates
    const response = await axios.get(
      `${BASE_URL}/${API_KEY}/latest/${baseCurrency}`
    );

    // Update cache
    ratesCache = {
      timestamp: now,
      rates: {
        ...ratesCache.rates,
        [baseCurrency]: response.data.conversion_rates
      }
    };

    return response.data.conversion_rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    // Return some default rates if API fails
    return {
      USD: 1,
      EUR: 0.91,
      GBP: 0.79,
      INR: 83.12
    };
  }
};

export const convertCurrency = async (
  amount,
  fromCurrency = 'USD',
  toCurrency = 'USD'
) => {
  try {
    // If same currency, return original amount
    if (fromCurrency === toCurrency) return amount;

    const rates = await getExchangeRates(fromCurrency);
    return amount * rates[toCurrency];
  } catch (error) {
    console.error('Error converting currency:', error);
    return amount; // Return original amount if conversion fails
  }
};

export const formatCurrency = async (
  amount,
  currency = 'USD',
  baseCurrency = 'USD'
) => {
  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹'
  };

  try {
    // Convert the amount
    const convertedAmount = await convertCurrency(
      amount,
      baseCurrency,
      currency
    );

    // Format based on locale
    const locales = {
      USD: 'en-US',
      EUR: 'de-DE',
      GBP: 'en-GB',
      INR: 'en-IN'
    };

    return `${currencySymbols[currency]}${new Intl.NumberFormat(locales[currency], {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(convertedAmount)}`;
  } catch (error) {
    console.error('Error formatting currency:', error);
    // Fallback formatting
    return `${currencySymbols[currency]}${amount.toFixed(2)}`;
  }
};
