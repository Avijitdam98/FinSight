import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const ShareOptions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const transactions = useSelector(state => state.transactions.transactions);

  const generateReportText = () => {
    // Calculate totals
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const balance = totalIncome - totalExpenses;

    // Format currency
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount);
    };

    // Generate report text
    return `📊 Financial Report Summary

💰 Total Income: ${formatCurrency(totalIncome)}
💸 Total Expenses: ${formatCurrency(totalExpenses)}
🏦 Current Balance: ${formatCurrency(balance)}

Top Categories:
${generateTopCategories()}

Generated via FinSight Dashboard
`;
  };

  const generateTopCategories = () => {
    // Group transactions by category and calculate totals
    const categories = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
        return acc;
      }, {});

    // Sort categories by amount and get top 3
    return Object.entries(categories)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category, amount]) => `📍 ${category}: ${new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount)}`)
      .join('\n');
  };

  const handleShare = (platform) => {
    const reportText = generateReportText();
    
    switch (platform) {
      case 'whatsapp':
        // WhatsApp sharing
        window.open(`https://wa.me/?text=${encodeURIComponent(reportText)}`, '_blank');
        break;
      
      case 'email':
        // Email sharing
        const subject = 'Financial Report from FinSight';
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(reportText)}`;
        break;
      
      default:
        break;
    }
    
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Share Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
        </svg>
        Share
      </button>

      {/* Share Options Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {/* WhatsApp Option */}
            <button
              onClick={() => handleShare('whatsapp')}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
            >
              <svg className="h-5 w-5 mr-3 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Share via WhatsApp
            </button>
            
            {/* Email Option */}
            <button
              onClick={() => handleShare('email')}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
            >
              <svg className="h-5 w-5 mr-3 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Share via Email
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareOptions;
