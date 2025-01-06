// Exchange rates (we'll fetch these from an API later)
const exchangeRates = {
  USD: 1,
  EUR: 0.91,
  GBP: 0.79,
  INR: 83.12,
};

export const convertCurrency = (amount, fromCurrency = 'USD', toCurrency = 'USD') => {
  // If same currency, return original amount
  if (fromCurrency === toCurrency) return amount;

  // Convert to USD first (base currency)
  const amountInUSD = amount / exchangeRates[fromCurrency];
  
  // Then convert to target currency
  return amountInUSD * exchangeRates[toCurrency];
};

export const formatCurrency = (amount, currency = 'USD', baseCurrency = 'USD') => {
  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
  };

  // Convert the amount to the target currency
  const convertedAmount = convertCurrency(amount, baseCurrency, currency);

  // Format the number based on the currency's locale
  const locales = {
    USD: 'en-US',
    EUR: 'de-DE',
    GBP: 'en-GB',
    INR: 'en-IN',
  };

  return `${currencySymbols[currency]}${new Intl.NumberFormat(locales[currency], {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(convertedAmount)}`;
};
