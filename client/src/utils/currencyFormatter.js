const currencySymbols = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
};

export const formatCurrency = (amount, currency = 'USD') => {
  const symbol = currencySymbols[currency] || '$';
  
  // Format number with commas and 2 decimal places
  const formattedNumber = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${symbol}${formattedNumber}`;
};

export const getCurrencySymbol = (currency = 'USD') => {
  return currencySymbols[currency] || '$';
};
