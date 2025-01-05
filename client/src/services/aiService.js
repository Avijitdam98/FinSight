import * as tf from '@tensorflow/tfjs';

// Normalize the data for ML model
const normalizeData = (data) => {
  // Reshape the data into a 2D tensor with shape [n, 1]
  const tensor = tf.tensor2d(data, [data.length, 1]);
  const min = tensor.min();
  const max = tensor.max();
  const normalized = tensor.sub(min).div(max.sub(min));
  return { tensor: normalized, min, max };
};

// Denormalize predictions
const denormalizeData = (normalized, min, max) => {
  return normalized.mul(max.sub(min)).add(min);
};

// Prepare sequences for time series prediction
const prepareSequences = (data, sequenceLength = 7) => {
  const sequences = [];
  const labels = [];

  for (let i = 0; i <= data.length - sequenceLength - 1; i++) {
    sequences.push(data.slice(i, i + sequenceLength));
    labels.push(data[i + sequenceLength]);
  }

  return { sequences, labels };
};

// Predict future spending based on historical data
export const predictFutureSpending = async (transactions) => {
  try {
    if (!transactions || transactions.length < 14) {
      return null; // Need at least 14 days of data
    }

    // Extract and sort transactions by date
    const sortedTransactions = [...transactions]
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Get daily spending totals
    const dailySpending = sortedTransactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date).toISOString().split('T')[0];
      if (transaction.type === 'expense') {
        acc[date] = (acc[date] || 0) + transaction.amount;
      }
      return acc;
    }, {});

    // Convert to array and fill missing days with average
    const dates = Object.keys(dailySpending).sort();
    const values = dates.map(date => dailySpending[date]);
    const average = values.reduce((sum, val) => sum + val, 0) / values.length;

    // Prepare data for prediction
    const data = values.map(val => val || average);
    const { sequences, labels } = prepareSequences(data, 7);

    // Create and normalize training data
    const { tensor: normalizedSequences, min: seqMin, max: seqMax } = 
      normalizeData(sequences.flat());
    const { tensor: normalizedLabels } = normalizeData(labels);

    // Reshape sequences for LSTM input [samples, timesteps, features]
    const reshapedSequences = normalizedSequences.reshape([sequences.length, 7, 1]);

    // Create model
    const model = tf.sequential();
    
    // Add layers
    model.add(tf.layers.lstm({
      units: 50,
      inputShape: [7, 1],
      returnSequences: false
    }));
    
    model.add(tf.layers.dense({
      units: 1,
      activation: 'linear'
    }));

    // Compile model
    model.compile({
      optimizer: tf.train.adam(0.01),
      loss: 'meanSquaredError'
    });

    // Train model
    await model.fit(reshapedSequences, normalizedLabels, {
      epochs: 50,
      batchSize: 32,
      shuffle: true,
      verbose: 0
    });

    // Prepare last sequence for prediction
    const lastSequence = data.slice(-7);
    const { tensor: normalizedLastSequence } = normalizeData(lastSequence);
    const reshapedLastSequence = normalizedLastSequence.reshape([1, 7, 1]);

    // Make prediction
    const normalizedPrediction = model.predict(reshapedLastSequence);
    const prediction = denormalizeData(normalizedPrediction, seqMin, seqMax);
    
    // Cleanup
    model.dispose();
    normalizedSequences.dispose();
    normalizedLabels.dispose();
    reshapedSequences.dispose();
    normalizedLastSequence.dispose();
    reshapedLastSequence.dispose();
    
    return prediction.dataSync()[0];
  } catch (error) {
    console.error('Error in AI prediction:', error);
    return null;
  }
};

// Analyze spending patterns and generate insights
export const analyzeSpendingPatterns = (transactions) => {
  if (!transactions || transactions.length === 0) {
    return {
      alerts: [],
      recommendations: [],
      patterns: []
    };
  }

  const insights = {
    alerts: [],
    recommendations: [],
    patterns: []
  };

  try {
    // Group transactions by category
    const categorySpending = transactions.reduce((acc, transaction) => {
      if (transaction.type === 'expense') {
        if (!acc[transaction.category]) {
          acc[transaction.category] = [];
        }
        acc[transaction.category].push({
          amount: transaction.amount,
          date: new Date(transaction.date)
        });
      }
      return acc;
    }, {});

    // Analyze each category
    Object.entries(categorySpending).forEach(([category, expenses]) => {
      if (expenses.length === 0) return;

      // Calculate average spending
      const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const avgAmount = totalAmount / expenses.length;

      // Check for unusual spending
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentExpenses = expenses.filter(exp => exp.date >= thirtyDaysAgo);
      
      if (recentExpenses.length > 0) {
        const recentTotal = recentExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        const recentAvg = recentTotal / recentExpenses.length;

        // Generate insights based on spending patterns
        if (recentAvg > avgAmount * 1.5) {
          insights.alerts.push({
            type: 'overspending',
            category,
            message: `Your spending in ${category} has increased by ${((recentAvg/avgAmount - 1) * 100).toFixed(1)}% compared to your average`
          });
        }

        // Identify potential savings
        if (recentAvg > 500 && category !== 'Rent' && category !== 'Utilities') {
          insights.recommendations.push({
            category,
            message: `Consider setting a budget for ${category} to reduce spending`,
            potentialSavings: (recentAvg * 0.2).toFixed(2)
          });
        }
      }

      // Identify patterns
      const monthlyTotals = expenses.reduce((acc, exp) => {
        const month = exp.date.getMonth();
        acc[month] = (acc[month] || 0) + exp.amount;
        return acc;
      }, {});

      const monthsWithData = Object.keys(monthlyTotals).length;
      if (monthsWithData > 0) {
        const monthlyAvg = Object.values(monthlyTotals)
          .reduce((sum, val) => sum + val, 0) / monthsWithData;
        
        Object.entries(monthlyTotals).forEach(([month, total]) => {
          if (total > monthlyAvg * 1.3) {
            insights.patterns.push({
              category,
              month: new Date(0, parseInt(month)).toLocaleString('default', { month: 'long' }),
              message: `Higher ${category} spending tends to occur in ${new Date(0, parseInt(month)).toLocaleString('default', { month: 'long' })}`
            });
          }
        });
      }
    });
  } catch (error) {
    console.error('Error analyzing spending patterns:', error);
  }

  return insights;
};

// Generate saving tips based on transaction history
export const generateSavingTips = (transactions) => {
  if (!transactions || transactions.length === 0) {
    return [];
  }

  try {
    const tips = [];
    const monthlyExpenses = {};
    const categories = new Set();

    // Organize transactions by month and category
    transactions.forEach(transaction => {
      if (transaction.type === 'expense') {
        const month = new Date(transaction.date).getMonth();
        categories.add(transaction.category);
        
        if (!monthlyExpenses[month]) {
          monthlyExpenses[month] = {};
        }
        if (!monthlyExpenses[month][transaction.category]) {
          monthlyExpenses[month][transaction.category] = 0;
        }
        monthlyExpenses[month][transaction.category] += transaction.amount;
      }
    });

    // Analyze monthly trends
    categories.forEach(category => {
      const monthlyAmounts = Object.values(monthlyExpenses)
        .map(month => month[category] || 0);
      
      if (monthlyAmounts.length > 0) {
        const average = monthlyAmounts.reduce((sum, amount) => sum + amount, 0) / monthlyAmounts.length;
        const max = Math.max(...monthlyAmounts);
        
        if (max > average * 1.5) {
          tips.push({
            category,
            tip: `Your ${category} spending occasionally spikes. Consider setting a monthly budget of $${average.toFixed(2)}.`
          });
        }
      }
    });

    // General saving tips based on spending patterns
    const totalByCategory = {};
    categories.forEach(category => {
      totalByCategory[category] = transactions
        .filter(t => t.type === 'expense' && t.category === category)
        .reduce((sum, t) => sum + t.amount, 0);
    });

    const sortedCategories = Object.entries(totalByCategory)
      .sort(([, a], [, b]) => b - a);

    // Top spending categories
    sortedCategories.slice(0, 3).forEach(([category, total]) => {
      tips.push({
        category,
        tip: `${category} is one of your top expenses. Here are some ways to save:`,
        suggestions: getSavingSuggestions(category)
      });
    });

    return tips;
  } catch (error) {
    console.error('Error generating saving tips:', error);
    return [];
  }
};

// Helper function to get category-specific saving suggestions
const getSavingSuggestions = (category) => {
  const suggestions = {
    Food: [
      'Plan meals in advance and create a shopping list',
      'Cook meals at home instead of eating out',
      'Buy groceries in bulk when on sale'
    ],
    Entertainment: [
      'Look for free local events and activities',
      'Use streaming services instead of multiple subscriptions',
      'Take advantage of happy hours and discounts'
    ],
    Shopping: [
      'Wait for sales and compare prices online',
      'Use cashback apps and reward programs',
      'Consider second-hand or refurbished items'
    ],
    Transportation: [
      'Use public transportation when possible',
      'Carpool or use ride-sharing services',
      'Plan trips efficiently to save fuel'
    ],
    Utilities: [
      'Use energy-efficient appliances',
      'Monitor and adjust thermostat settings',
      'Fix leaks and maintain appliances regularly'
    ]
  };

  return suggestions[category] || [
    'Track your spending in this category',
    'Set a monthly budget',
    'Look for alternatives or bulk deals'
  ];
};
