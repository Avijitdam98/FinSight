import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Line, Pie, Bar, Radar, PolarArea } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  RadialLinearScale,
  Filler,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { insightsAPI } from '../services/api';
import { 
  setTransactions,
  setLoading as setTransactionLoading,
  setError as setTransactionError,
  selectFilteredTransactions
} from '../store/slices/transactionSlice';
import AIInsights from '../components/AIInsights';
import ShareOptions from '../components/ShareOptions';
import CurrencyDisplay from '../components/CurrencyDisplay';
import { formatCurrency } from '../utils/currencyConverter';
import { NeuralNetwork } from 'brain.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  RadialLinearScale,
  Filler,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const transactions = useSelector(selectFilteredTransactions);
  const { data: settings } = useSelector((state) => state.settings);
  const [monthlyData, setMonthlyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Custom color palette
  const colors = {
    primary: {
      main: 'rgb(79, 70, 229)',
      light: 'rgba(79, 70, 229, 0.1)',
      dark: 'rgb(67, 56, 202)'
    },
    success: {
      main: 'rgb(34, 197, 94)',
      light: 'rgba(34, 197, 94, 0.1)',
      dark: 'rgb(22, 163, 74)'
    },
    warning: {
      main: 'rgb(245, 158, 11)',
      light: 'rgba(245, 158, 11, 0.1)',
      dark: 'rgb(217, 119, 6)'
    },
    error: {
      main: 'rgb(239, 68, 68)',
      light: 'rgba(239, 68, 68, 0.1)',
      dark: 'rgb(220, 38, 38)'
    },
    neutral: {
      main: 'rgb(107, 114, 128)',
      light: 'rgba(107, 114, 128, 0.1)',
      dark: 'rgb(75, 85, 99)'
    },
    chart: [
      'rgb(99, 102, 241)',
      'rgb(34, 197, 94)',
      'rgb(245, 158, 11)',
      'rgb(239, 68, 68)',
      'rgb(168, 85, 247)',
      'rgb(14, 165, 233)'
    ]
  };

  // Calculate stats from transactions
  const stats = {
    totalIncome: transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0),

    totalExpenses: transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0),

    get balance() {
      return this.totalIncome - this.totalExpenses;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get transactions for the last 12 months
        const now = new Date();
        const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);
        
        // Process transactions into monthly data
        const monthlyIncomes = new Array(12).fill(0);
        const monthlyExpenses = new Array(12).fill(0);
        const labels = [];

        // Generate labels for last 12 months
        for (let i = 0; i < 12; i++) {
          const date = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
          labels.push(date.toLocaleString('default', { month: 'short' }));
        }

        // Process transactions
        transactions.forEach(transaction => {
          const transactionDate = new Date(transaction.date);
          if (transactionDate >= twelveMonthsAgo) {
            const monthIndex = labels.indexOf(
              transactionDate.toLocaleString('default', { month: 'short' })
            );
            if (monthIndex !== -1) {
              if (transaction.type === 'income') {
                monthlyIncomes[monthIndex] += Number(transaction.amount);
              } else {
                monthlyExpenses[monthIndex] += Number(transaction.amount);
              }
            }
          }
        });

        setMonthlyData({
          labels,
          datasets: [
            {
              label: 'Income',
              data: monthlyIncomes,
              borderColor: colors.chart[0],
              backgroundColor: colors.chart[0].replace('rgb', 'rgba').replace(')', ', 0.1)'),
              tension: 0.4
            },
            {
              label: 'Expenses',
              data: monthlyExpenses,
              borderColor: colors.chart[1],
              backgroundColor: colors.chart[1].replace('rgb', 'rgba').replace(')', ', 0.1)'),
              tension: 0.4
            }
          ]
        });
      } catch (err) {
        setError(err.message);
        dispatch(setTransactionError(err.message));
      } finally {
        setLoading(false);
        dispatch(setTransactionLoading(false));
      }
    };

    if (transactions.length > 0) {
      fetchData();
    }
  }, [dispatch, transactions]);

  // Calculate Financial Wellness Metrics
  const calculateFinancialMetrics = () => {
    // Get current month's transactions
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const currentMonthTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    // Calculate total income and expenses for current month
    const monthlyIncome = currentMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const monthlyExpenses = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    // 1. Savings Rate (% of income saved)
    const savingsTransactions = currentMonthTransactions
      .filter(t => t.category === 'savings' || t.category === 'investment')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const savingsRate = monthlyIncome > 0 ? (savingsTransactions / monthlyIncome) * 100 : 0;

    // 2. Debt Management (% of income going to debt payments)
    const debtPayments = currentMonthTransactions
      .filter(t => t.category === 'debt' || t.category === 'loan')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const debtRatio = monthlyIncome > 0 ? 100 - ((debtPayments / monthlyIncome) * 100) : 0;

    // 3. Investment Growth (% change in investments)
    const investmentTransactions = transactions
      .filter(t => t.category === 'investment')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const lastMonthInvestments = transactions
      .filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === (currentMonth - 1) && 
               date.getFullYear() === currentYear &&
               t.category === 'investment';
      })
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const investmentGrowth = lastMonthInvestments > 0 
      ? ((investmentTransactions - lastMonthInvestments) / lastMonthInvestments) * 100
      : 0;

    // 4. Budget Adherence (how close to budget targets)
    const budgetVariance = monthlyExpenses > 0 
      ? 100 - (Math.abs(monthlyExpenses - (monthlyIncome * 0.7)) / (monthlyIncome * 0.7)) * 100
      : 0;

    // 5. Emergency Fund (months of expenses covered)
    const emergencyFunds = transactions
      .filter(t => t.category === 'savings' || t.category === 'emergency')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const monthlyAvgExpenses = monthlyExpenses || 1;
    const emergencyFundRatio = (emergencyFunds / monthlyAvgExpenses) * 20; // Scale to 100

    // 6. Income Stability (consistency of income)
    const last3MonthsIncome = Array.from({ length: 3 }, (_, i) => {
      const monthTransactions = transactions.filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === (currentMonth - i) && 
               date.getFullYear() === currentYear &&
               t.type === 'income';
      });
      return monthTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
    });
    const incomeVariance = last3MonthsIncome.reduce((acc, curr) => acc + curr, 0) / 3;
    const incomeStability = incomeVariance > 0 
      ? 100 - (Math.abs(monthlyIncome - incomeVariance) / incomeVariance) * 100
      : 0;

    // 7. Expense Control (% of income not spent)
    const expenseControl = monthlyIncome > 0 
      ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100
      : 0;

    // 8. Financial Goals (based on savings targets and debt reduction)
    const goalProgress = (savingsRate + debtRatio) / 2;

    return [
      Math.min(100, Math.max(0, savingsRate)),        // Savings Rate
      Math.min(100, Math.max(0, debtRatio)),          // Debt Management
      Math.min(100, Math.max(0, investmentGrowth)),   // Investment Growth
      Math.min(100, Math.max(0, budgetVariance)),     // Budget Adherence
      Math.min(100, Math.max(0, emergencyFundRatio)), // Emergency Fund
      Math.min(100, Math.max(0, incomeStability)),    // Income Stability
      Math.min(100, Math.max(0, expenseControl)),     // Expense Control
      Math.min(100, Math.max(0, goalProgress))        // Financial Goals
    ];
  };

  // Enhanced financial health metrics with dynamic data
  const radarData = {
    labels: [
      'Savings Rate',
      'Debt Management',
      'Investment Growth',
      'Budget Adherence',
      'Emergency Fund',
      'Income Stability',
      'Expense Control',
      'Financial Goals'
    ],
    datasets: [{
      label: 'Current Status',
      data: calculateFinancialMetrics(),
      backgroundColor: colors.primary.main.replace('rgb', 'rgba').replace(')', ', 0.2)'),
      borderColor: colors.primary.main,
      borderWidth: 2,
      pointBackgroundColor: colors.primary.main,
      pointHoverBackgroundColor: colors.primary.dark
    }]
  };

  // Enhanced category data with more detailed breakdown
  const categoryData = {
    labels: [
      'Housing & Utilities',
      'Transportation',
      'Food & Dining',
      'Healthcare',
      'Entertainment',
      'Shopping',
      'Education',
      'Investments'
    ],
    datasets: [{
      label: 'Monthly Spending',
      data: transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
          return acc;
        }, {}),
      backgroundColor: colors.chart.map(color => color.replace('rgb', 'rgba').replace(')', ', 0.7)')),
      borderColor: colors.chart,
      borderWidth: 1
    }]
  };

  // Calculate weekly data properly
  const calculateWeeklyData = () => {
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const daysToMonday = currentDay === 0 ? 6 : currentDay - 1;
    const monday = new Date(now);
    monday.setDate(now.getDate() - daysToMonday);
    monday.setHours(0, 0, 0, 0);

    // Initialize arrays for each day of the week
    const weeklyIncome = Array(7).fill(0);
    const weeklyExpenses = Array(7).fill(0);

    // Process transactions
    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      if (transactionDate >= monday) {
        const dayIndex = transactionDate.getDay();
        // Convert Sunday (0) to index 6, and other days to 0-5
        const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
        
        const amount = Number(transaction.amount);
        if (transaction.type === 'income') {
          weeklyIncome[adjustedIndex] += amount;
        } else {
          weeklyExpenses[adjustedIndex] += amount;
        }
      }
    });

    return {
      income: weeklyIncome,
      expenses: weeklyExpenses
    };
  };

  // Weekly metrics with income/expense comparison
  const weeklyData = (() => {
    const { income, expenses } = calculateWeeklyData();
    return {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Income',
          data: income,
          backgroundColor: colors.success.main.replace('rgb', 'rgba').replace(')', ', 0.7)'),
          borderColor: colors.success.main,
          borderWidth: 1,
          stack: 'stack'
        },
        {
          label: 'Expenses',
          data: expenses,
          backgroundColor: colors.error.main.replace('rgb', 'rgba').replace(')', ', 0.7)'),
          borderColor: colors.error.main,
          borderWidth: 1,
          stack: 'stack'
        }
      ]
    };
  })();

  // Calculate monthly spending totals from transactions
  const calculateMonthlySpending = (transactions) => {
    const monthlyTotals = {};
    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      const month = date.toLocaleString('default', { month: 'long' });
      if (!monthlyTotals[month]) {
        monthlyTotals[month] = 0;
      }
      monthlyTotals[month] += transaction.amount;
    });
    return monthlyTotals;
  };

  const monthlySpending = calculateMonthlySpending(transactions);
  const spendingTrendsData = {
    labels: Object.keys(monthlySpending),
    datasets: [
      {
        label: 'Spending Trends',
        data: Object.values(monthlySpending),
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

  const calculateIncomeVsExpenses = (transactions) => {
    let income = 0;
    let expenses = 0;
    transactions.forEach((transaction) => {
      if (transaction.type === 'income') {
        income += transaction.amount;
      } else if (transaction.type === 'expense') {
        expenses += transaction.amount;
      }
    });
    return { income, expenses };
  };

  const { income, expenses } = calculateIncomeVsExpenses(transactions);
  const incomeVsExpensesData = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        data: [income, expenses],
        backgroundColor: ['rgba(54, 162, 235, 0.2)', 'rgba(255, 99, 132, 0.2)'],
        borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const calculateCategoryBreakdown = (transactions) => {
    const categoryTotals = {};
    transactions.forEach((transaction) => {
      if (transaction.type === 'expense') {
        const category = transaction.category;
        if (!categoryTotals[category]) {
          categoryTotals[category] = 0;
        }
        categoryTotals[category] += transaction.amount;
      }
    });
    return categoryTotals;
  };

  const categoryBreakdown = calculateCategoryBreakdown(transactions);
  const categoryBreakdownData = {
    labels: Object.keys(categoryBreakdown),
    datasets: [
      {
        data: Object.values(categoryBreakdown),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart options with consistent styling
  const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: colors.neutral.main,
          usePointStyle: true,
          padding: 20,
          font: {
            family: "'Inter', sans-serif",
            size: 12
          }
        }
      }
    },
    scales: {
      r: {
        grid: {
          color: colors.neutral.light
        },
        angleLines: {
          color: colors.neutral.light
        },
        pointLabels: {
          color: colors.neutral.main,
          font: {
            family: "'Inter', sans-serif",
            size: 11
          }
        }
      }
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          color: 'rgb(156, 163, 175)'
        }
      },
      title: {
        display: true,
        text: 'Monthly Spending Trends',
        color: 'rgb(156, 163, 175)',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.1)'
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
          callback: (value) => formatCurrency(value, settings?.preferences?.currency, 'USD')
        }
      },
      x: {
        grid: {
          color: 'rgba(156, 163, 175, 0.1)'
        },
        ticks: {
          color: 'rgb(156, 163, 175)'
        }
      }
    }
  };

  const pieChartData = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        data: [stats.totalIncome, stats.totalExpenses],
        backgroundColor: ['#4CAF50', '#f44336'],
        hoverBackgroundColor: ['#45a049', '#e53935'],
      },
    ],
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateGoalProgress = (transactions, goalAmount, currency) => {
    const totalIncome = transactions
      .filter((transaction) => transaction.type === 'income' && transaction.currency === currency)
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    console.log('Total Income:', totalIncome, 'Goal Amount:', goalAmount, 'Currency:', currency);
    return (totalIncome / goalAmount) * 100;
  };

  const [goalAmount, setGoalAmount] = useState(10000); // Default goal amount
  const [currency, setCurrency] = useState('USD');

  const handleGoalChange = (e) => {
    setGoalAmount(Number(e.target.value));
  };

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  const goalProgress = calculateGoalProgress(transactions, goalAmount, currency);

  const net = new NeuralNetwork();

  const trainingData = [
    { input: { income: 0.5, expenses: 0.5 }, output: { save: 0.5 } },
    { input: { income: 0.8, expenses: 0.2 }, output: { save: 0.8 } },
    // Add more data here
  ];

  net.train(trainingData);

  const predictSavings = (income, expenses) => {
    const output = net.run({ income, expenses });
    return output.save;
  };

  const [savingsRate, setSavingsRate] = useState(0);
  const [expensesRate, setExpensesRate] = useState(0);

  useEffect(() => {
    const income = transactions.reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum, 0);
    const expenses = transactions.reduce((sum, t) => t.type === 'expense' ? sum + t.amount : sum, 0);

    const savings = predictSavings(income, expenses);
    const expensesPred = predictSavings(expenses, income);

    setSavingsRate(savings);
    setExpensesRate(expensesPred);
  }, [transactions]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-gray-900 dark:text-gray-400">Total Income</h2>
              <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">Income</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              <CurrencyDisplay amount={stats.totalIncome} type="income" />
            </div>
            <div className="text-green-400 text-sm mt-1">↑ Updated in real-time</div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-gray-900 dark:text-gray-400">Total Expenses</h2>
              <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">Expenses</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              <CurrencyDisplay amount={stats.totalExpenses} type="expense" />
            </div>
            <div className="text-red-400 text-sm mt-1">↓ Track your spending</div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-gray-900 dark:text-gray-400">Current Balance</h2>
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">Balance</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              <CurrencyDisplay 
                amount={stats.balance} 
                className={stats.balance >= 0 ? 'text-green-500' : 'text-red-500'}
                showPositiveSign={true}
              />
            </div>
            <div className="text-blue-400 text-sm mt-1">↓ Net Position</div>
          </div>
        </div>

        {/* Real-Time Cash Flow */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow mb-6">
          <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white flex items-center justify-between">
            <span>Real-Time Cash Flow</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">Current</span>
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.balance, settings?.preferences?.currency, 'USD')}</p>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white flex items-center justify-between">
              <span>Monthly Overview</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">Last 12 months</span>
            </h3>
            <div className="h-80">
              {monthlyData ? (
                <Line 
                  data={monthlyData}
                  options={chartOptions}
                />
              ) : (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white flex items-center justify-between">
              <span>Spending Trends</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">Last 6 Months</span>
            </h3>
            <div className="h-80">
              <Line 
                data={spendingTrendsData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: {
                        usePointStyle: true,
                        color: 'rgb(156, 163, 175)'
                      }
                    },
                    title: {
                      display: true,
                      text: 'Spending Trends',
                      color: 'rgb(156, 163, 175)',
                      font: {
                        size: 16,
                        weight: 'bold'
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(156, 163, 175, 0.1)'
                      },
                      ticks: {
                        color: 'rgb(156, 163, 175)',
                        callback: (value) => formatCurrency(value, settings?.preferences?.currency, 'USD')
                      }
                    },
                    x: {
                      grid: {
                        color: 'rgba(156, 163, 175, 0.1)'
                      },
                      ticks: {
                        color: 'rgb(156, 163, 175)'
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Additional Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white flex items-center justify-between">
              <span>Category Breakdown</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">Spending by Category</span>
            </h3>
            <Bar data={categoryBreakdownData} />
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white flex items-center justify-between">
              <span>Income vs Expenses</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">Distribution</span>
            </h3>
            <Pie data={incomeVsExpensesData} />
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white flex items-center justify-between">
              <span>Expense Categories</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">Monthly</span>
            </h3>
            <div className="h-64">
              <PolarArea 
                data={categoryData}
                options={{
                  ...commonChartOptions,
                  plugins: {
                    ...commonChartOptions.plugins,
                    tooltip: {
                      callbacks: {
                        label: (context) => formatCurrency(context.raw, settings?.preferences?.currency, 'USD')
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Additional Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white flex items-center justify-between">
              <span>Weekly Cash Flow</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">Income vs Expenses</span>
            </h3>
            <div className="h-64">
              <Bar 
                data={weeklyData}
                options={{
                  ...commonChartOptions,
                  scales: {
                    y: {
                      stacked: true,
                      grid: {
                        color: colors.neutral.light
                      },
                      ticks: {
                        color: colors.neutral.main,
                        callback: (value) => formatCurrency(value, settings?.preferences?.currency, 'USD')
                      }
                    },
                    x: {
                      stacked: true,
                      grid: {
                        display: false
                      },
                      ticks: {
                        color: colors.neutral.main
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white flex items-center justify-between">
              <span>Financial Wellness</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">Metrics</span>
            </h3>
            <div className="h-64">
              <Radar 
                data={radarData}
                options={{
                  ...commonChartOptions,
                  plugins: {
                    ...commonChartOptions.plugins,
                    tooltip: {
                      callbacks: {
                        label: (context) => `${context.dataset.label}: ${context.formattedValue}%`
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white flex items-center justify-between">
              <span>Recent Transactions</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">Latest Activity</span>
            </h3>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.slice(0, 5).map((transaction, index) => (
                <li key={transaction.id || index} className="py-4 flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{transaction.category}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(transaction.date)}</p>
                  </div>
                  <div className="text-sm text-gray-900 dark:text-white">{transaction.amount}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white flex items-center">
            <span>AI-Powered Insights</span>
            <span className="ml-2 px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full">
              Smart Analysis
            </span>
          </h3>
          <div className="ai-insights bg-blue-100 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-blue-800">AI-Powered Insights</h3>
            <p className="text-blue-600">Predicted Savings Rate: {(savingsRate * 100).toFixed(2)}%</p>
          </div>
          <div className="smart-analysis bg-green-100 p-4 rounded-lg shadow-md mt-4">
            <h3 className="text-lg font-bold text-green-800">Smart Analysis</h3>
            <p className="text-green-600">Predicted Expenses: {(expensesRate * 100).toFixed(2)}%</p>
          </div>
          <AIInsights />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
