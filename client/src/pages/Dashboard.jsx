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

  // Weekly metrics with income/expense comparison
  const weeklyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Income',
        data: transactions
          .filter(t => t.type === 'income')
          .slice(-7)
          .map(t => Number(t.amount)),
        backgroundColor: colors.success.main.replace('rgb', 'rgba').replace(')', ', 0.7)'),
        borderColor: colors.success.main,
        borderWidth: 1,
        stack: 'stack'
      },
      {
        label: 'Expenses',
        data: transactions
          .filter(t => t.type === 'expense')
          .slice(-7)
          .map(t => Number(t.amount)),
        backgroundColor: colors.error.main.replace('rgb', 'rgba').replace(')', ', 0.7)'),
        borderColor: colors.error.main,
        borderWidth: 1,
        stack: 'stack'
      }
    ]
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
          callback: (value) => `$${value.toLocaleString()}`
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Financial Overview</h1>
          <ShareOptions onShare={(shareData) => console.log('Shared:', shareData)} />
        </div>
        <p className="text-gray-600 dark:text-gray-400">Track your income, expenses, and financial insights</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Income</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Income
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            ${stats.totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
            <span className="mr-1">↑</span> Updated in real-time
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Expenses</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
              Expenses
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            ${stats.totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
            <span className="mr-1">↓</span> Track your spending
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Current Balance</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Balance
            </span>
          </div>
          <p className={`text-3xl font-bold mb-2 ${stats.balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            ${Math.abs(stats.balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
            <span className="mr-1">{stats.balance >= 0 ? '↑' : '↓'}</span> Net Position
          </p>
        </div>
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
            <span>Income vs Expenses</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">Distribution</span>
          </h3>
          <div className="h-80">
            <Pie 
              data={pieChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      color: 'rgb(156, 163, 175)',
                      padding: 20,
                      usePointStyle: true
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
                      label: (context) => `$${context.raw.toLocaleString()}`
                    }
                  }
                }
              }}
            />
          </div>
        </div>

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
                      callback: (value) => `$${value.toLocaleString()}`
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
            <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">8 Key Metrics</span>
          </h3>
          <div className="h-64">
            <Radar 
              data={radarData}
              options={{
                ...commonChartOptions,
                scales: {
                  r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                      stepSize: 20,
                      display: false
                    },
                    grid: {
                      color: colors.neutral.light
                    },
                    angleLines: {
                      color: colors.neutral.light
                    },
                    pointLabels: {
                      color: colors.neutral.main,
                      font: {
                        size: 10
                      }
                    }
                  }
                }
              }}
            />
          </div>
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
        <AIInsights />
      </div>
    </div>
  );
};

export default Dashboard;
