import express from 'express';
import auth from '../middleware/auth.js';
import Transaction from '../models/Transaction.js';

const router = express.Router();

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

    // Calculate monthly trends
    const monthlyTrends = transactions.reduce((acc, transaction) => {
      const month = new Date(transaction.date).toLocaleString('default', { month: 'short' });
      if (!acc[month]) {
        acc[month] = { income: 0, expenses: 0 };
      }
      if (transaction.type === 'income') {
        acc[month].income += transaction.amount;
      } else {
        acc[month].expenses += transaction.amount;
      }
      return acc;
    }, {});

    // Find top spending categories
    const topCategories = Object.entries(categorySpending)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: ((amount / totalSpending) * 100).toFixed(1)
      }));

    // Calculate year-over-year comparison
    const thisYear = new Date().getFullYear();
    const lastYear = thisYear - 1;

    const yearComparison = {
      [thisYear]: { income: 0, expenses: 0 },
      [lastYear]: { income: 0, expenses: 0 }
    };

    transactions.forEach(transaction => {
      const year = new Date(transaction.date).getFullYear();
      if (year === thisYear || year === lastYear) {
        if (transaction.type === 'income') {
          yearComparison[year].income += transaction.amount;
        } else {
          yearComparison[year].expenses += transaction.amount;
        }
      }
    });

    // Calculate savings rate
    const monthlySavings = Object.values(monthlyTrends).map(month => ({
      savings: month.income - month.expenses,
      savingsRate: month.income > 0 ? ((month.income - month.expenses) / month.income * 100).toFixed(1) : 0
    }));

    // Generate insights and recommendations
    const insights = {
      topSpendingCategories: topCategories,
      totalSpending,
      monthlyTrends,
      yearComparison,
      monthlySavings,
      recommendations: generateRecommendations(topCategories, totalSpending, monthlySavings),
      transactions: recentTransactions // Include transactions for client-side AI analysis
    };

    res.json(insights);
  } catch (error) {
    console.error('Error in insights route:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get monthly comparison
router.get('/monthly', auth, async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const transactions = await Transaction.find({
      user: req.user.id,
      date: { $gte: sixMonthsAgo }
    });

    const monthlyData = transactions.reduce((acc, transaction) => {
      const month = new Date(transaction.date).toLocaleString('default', { month: 'short' });
      if (!acc[month]) {
        acc[month] = {
          income: 0,
          expenses: 0,
          categories: {}
        };
      }

      if (transaction.type === 'income') {
        acc[month].income += transaction.amount;
      } else {
        acc[month].expenses += transaction.amount;
        acc[month].categories[transaction.category] = 
          (acc[month].categories[transaction.category] || 0) + transaction.amount;
      }

      return acc;
    }, {});

    res.json(monthlyData);
  } catch (error) {
    console.error('Error in monthly comparison:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to generate spending recommendations
const generateRecommendations = (topCategories, totalSpending, monthlySavings) => {
  const recommendations = [];

  // Analyze top spending categories
  topCategories.forEach(({ category, amount, percentage }) => {
    if (percentage > 30) {
      recommendations.push({
        type: 'warning',
        message: `Your ${category} spending is ${percentage}% of total expenses. Consider setting a budget.`,
        action: `Try to keep ${category} spending under 25% of your total budget.`
      });
    }
  });

  // Analyze savings rate
  const recentSavings = monthlySavings.slice(-3);
  const avgSavingsRate = recentSavings.reduce((sum, month) => 
    sum + parseFloat(month.savingsRate), 0) / recentSavings.length;

  if (avgSavingsRate < 20) {
    recommendations.push({
      type: 'improvement',
      message: 'Your average savings rate is below the recommended 20%.',
      action: 'Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings.'
    });
  }

  // Add general recommendations
  if (totalSpending > 0) {
    recommendations.push({
      type: 'tip',
      message: 'Track your daily expenses to identify unnecessary spending.',
      action: 'Use the FinSight app regularly to monitor your financial health.'
    });
  }

  return recommendations;
};

export default router;
