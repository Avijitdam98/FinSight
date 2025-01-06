import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { formatCurrency } from '../services/currencyService';

const CurrencyDisplay = ({ 
  amount, 
  type = null,
  className = '',
  showPositiveSign = false 
}) => {
  const { data: settings } = useSelector((state) => state.settings);
  const [formattedAmount, setFormattedAmount] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const formatAmount = async () => {
      try {
        setIsLoading(true);
        const formatted = await formatCurrency(
          amount,
          settings?.preferences?.currency,
          'USD'
        );
        setFormattedAmount(formatted);
      } catch (error) {
        console.error('Error formatting currency:', error);
      } finally {
        setIsLoading(false);
      }
    };

    formatAmount();
  }, [amount, settings?.preferences?.currency]);

  if (isLoading) {
    return <span className="animate-pulse">...</span>;
  }

  let displayClass = className;
  if (type) {
    displayClass += ` ${type === 'income' ? 'text-green-600' : 'text-red-600'}`;
  }

  return (
    <span className={displayClass}>
      {showPositiveSign && amount > 0 ? '+' : ''}
      {formattedAmount}
    </span>
  );
};

export default CurrencyDisplay;
