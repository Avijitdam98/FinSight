import express from 'express';
import auth from '../middleware/auth.js';
import Transaction from '../models/Transaction.js';

const router = express.Router();

// Get monthly data for charts
router.get('/monthly', auth, async (req, res) => {
  try {
    // Get last 12 months of transactions
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setDate(1); // Start from beginning of month

    const transactions = await Transaction.find({
      user: req.user.id,
      date: { $gte: twelveMonthsAgo }
    }).sort({ date: 1 });

    // Initialize arrays for all 12 months
    const months = [];
    const incomeData = [];
    const expenseData = [];

    // Get last 12 months in order
    for (let i = 0; i < 12; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - (11 - i));
      months.push(date.toLocaleString('default', { month: 'short' }));
      incomeData[i] = 0;
      expenseData[i] = 0;
    }

    // Aggregate transactions by month
    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      const monthIndex = months.indexOf(
        transactionDate.toLocaleString('default', { month: 'short' })
      );
      
      if (monthIndex !== -1) {
        if (transaction.type === 'income') {
          incomeData[monthIndex] += transaction.amount;
        } else {
          expenseData[monthIndex] += transaction.amount;
        }
      }
    });

    res.json({
      labels: months,
      datasets: [
        {
          label: 'Income',
          data: incomeData,
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          tension: 0.4
        },
        {
          label: 'Expenses',
          data: expenseData,
          borderColor: '#f44336',
          backgroundColor: 'rgba(244, 67, 54, 0.1)',
          tension: 0.4
        }
      ]
    });
  } catch (error) {
    console.error('Error fetching monthly data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get spending insights
router.get('/spending', auth, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get all transactions for the user
    const transactions = await Transaction.find({
      user: req.user.id,
    }).sort({ date: -1 });

    // Get recent transactions
    const recentTransactions = transactions.filter(t => 
      new Date(t.date) >= thirtyDaysAgo
    );

    // Calculate category-wise spending
    const categorySpending = recentTransactions.reduce((acc, transaction) => {
      if (transaction.type === 'expense') {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      }
      return acc;
    }, {});

    // Calculate total spending
    const totalSpending = recentTransactions.reduce((total, transaction) => {
      return transaction.type === 'expense' ? total + transaction.amount : total;
    }, 0);

    // Calculate savings
    const monthlySavings = recentTransactions.reduce((savings, transaction) => {
      return transaction.type === 'income' 
        ? savings + transaction.amount 
        : savings - transaction.amount;
    }, 0);

    // Find top spending categories
    const topCategories = Object.entries(categorySpending)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: ((amount / totalSpending) * 100).toFixed(1)
      }));

    // Generate insights and recommendations
    const insights = {
      topSpendingCategories: topCategories,
      totalSpending,
      monthlySavings,
      recommendations: generateRecommendations(topCategories, totalSpending, monthlySavings),
      transactions: recentTransactions
    };

    res.json(insights);
  } catch (error) {
    console.error('Error generating insights:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to generate spending recommendations
function generateRecommendations(topCategories, totalSpending, monthlySavings) {
  const recommendations = [];

  // Check if spending in any category is too high
  topCategories.forEach(({ category, amount, percentage }) => {
    if (percentage > 30) {
      recommendations.push(
        `Your spending in ${category} (${percentage}% of total) seems high. Consider setting a budget for this category.`
      );
    }
  });

  // Check monthly savings
  if (monthlySavings < 0) {
    recommendations.push(
      'Your expenses exceed your income. Try to identify non-essential expenses you can reduce.'
    );
  } else if (monthlySavings < totalSpending * 0.2) {
    recommendations.push(
      'Your savings rate is less than 20% of your spending. Consider ways to increase your savings.'
    );
  }

  // Add general recommendations if needed
  if (recommendations.length === 0) {
    recommendations.push(
      'Your spending patterns look healthy! Keep monitoring your expenses and maintain your saving habits.'
    );
  }

  return recommendations;
}

export default router;
