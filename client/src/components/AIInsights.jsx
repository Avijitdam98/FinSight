import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  predictFutureSpending, 
  analyzeSpendingPatterns,
  generateSavingTips 
} from '../services/aiService';

const AIInsights = () => {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState(null);
  const transactions = useSelector(state => state.transactions.transactions);

  useEffect(() => {
    const generateInsights = async () => {
      if (!transactions?.length) return;

      try {
        setLoading(true);
        
        // Get AI-powered insights
        const predictedSpending = await predictFutureSpending(transactions);
        const patterns = analyzeSpendingPatterns(transactions);
        const savingTips = generateSavingTips(transactions);

        setInsights({
          predictedSpending,
          ...patterns,
          savingTips
        });
      } catch (error) {
        console.error('Error generating AI insights:', error);
      } finally {
        setLoading(false);
      }
    };

    generateInsights();
  }, [transactions]);

  if (loading) {
    return (
      <div className="animate-pulse p-4">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="text-gray-600 dark:text-gray-400">
        No insights available yet. Add more transactions to get AI-powered recommendations.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Predicted Spending */}
      {insights.predictedSpending && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <h3 className="text-lg font-semibold mb-2 text-indigo-600 dark:text-indigo-400">
            Predicted Monthly Spending
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Based on your spending patterns, your estimated spending next month will be:
            <span className="font-bold ml-2">
              ${insights.predictedSpending.toFixed(2)}
            </span>
          </p>
        </div>
      )}

      {/* Alerts */}
      {insights.alerts?.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <h3 className="text-lg font-semibold mb-2 text-red-600 dark:text-red-400">
            Spending Alerts
          </h3>
          <ul className="space-y-2">
            {insights.alerts.map((alert, index) => (
              <li 
                key={index}
                className="flex items-start space-x-2 text-gray-600 dark:text-gray-300"
              >
                <span className="text-red-500">⚠️</span>
                <span>{alert.message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {insights.recommendations?.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <h3 className="text-lg font-semibold mb-2 text-green-600 dark:text-green-400">
            Saving Recommendations
          </h3>
          <ul className="space-y-2">
            {insights.recommendations.map((rec, index) => (
              <li 
                key={index}
                className="flex items-start space-x-2 text-gray-600 dark:text-gray-300"
              >
                <span className="text-green-500">💡</span>
                <div>
                  <p>{rec.message}</p>
                  {rec.potentialSavings && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      Potential monthly savings: ${rec.potentialSavings}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Patterns */}
      {insights.patterns?.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <h3 className="text-lg font-semibold mb-2 text-blue-600 dark:text-blue-400">
            Spending Patterns
          </h3>
          <ul className="space-y-2">
            {insights.patterns.map((pattern, index) => (
              <li 
                key={index}
                className="flex items-start space-x-2 text-gray-600 dark:text-gray-300"
              >
                <span className="text-blue-500">📊</span>
                <span>{pattern.message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Saving Tips */}
      {insights.savingTips?.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <h3 className="text-lg font-semibold mb-2 text-purple-600 dark:text-purple-400">
            Smart Saving Tips
          </h3>
          <ul className="space-y-4">
            {insights.savingTips.map((tip, index) => (
              <li key={index} className="space-y-2">
                <h4 className="font-medium text-gray-700 dark:text-gray-200">
                  {tip.category}
                </h4>
                <p className="text-gray-600 dark:text-gray-300">{tip.tip}</p>
                {tip.suggestions && (
                  <ul className="ml-4 space-y-1">
                    {tip.suggestions.map((suggestion, idx) => (
                      <li 
                        key={idx}
                        className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-2"
                      >
                        <span>•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
