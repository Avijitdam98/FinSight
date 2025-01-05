import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
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

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
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
              borderColor: '#4CAF50',
              backgroundColor: 'rgba(76, 175, 80, 0.1)',
              tension: 0.4
            },
            {
              label: 'Expenses',
              data: monthlyExpenses,
              borderColor: '#f44336',
              backgroundColor: 'rgba(244, 67, 54, 0.1)',
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
    <div className="p-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 dark:text-white">Total Income</h3>
          <p className="text-2xl text-green-600">${stats.totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 dark:text-white">Total Expenses</h3>
          <p className="text-2xl text-red-600">${stats.totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 dark:text-white">Balance</h3>
          <p className={`text-2xl ${stats.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${Math.abs(stats.balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">Monthly Overview</h3>
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

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">Income vs Expenses</h3>
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
                      color: 'rgb(156, 163, 175)'
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <AIInsights />
    </div>
  );
};

export default Dashboard;
