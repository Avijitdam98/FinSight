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
  fetchTransactionsSuccess,
  setFilters 
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
  const { insights, stats } = useSelector((state) => state.transactions);
  const [monthlyData, setMonthlyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [insightsRes, monthlyRes] = await Promise.all([
          insightsAPI.getSpendingInsights(),
          insightsAPI.getMonthlyData(),
        ]);

        dispatch(fetchTransactionsSuccess({
          insights: insightsRes.data,
          transactions: insightsRes.data.transactions || []
        }));
        setMonthlyData(monthlyRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-red-600 dark:text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8 text-gray-800 dark:text-white">
        Financial Dashboard
      </h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Total Income
          </h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            ${stats?.totalIncome?.toFixed(2) || '0.00'}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Total Expenses
          </h3>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            ${stats?.totalExpenses?.toFixed(2) || '0.00'}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Balance
          </h3>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            ${stats?.balance?.toFixed(2) || '0.00'}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {monthlyData && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
              Monthly Overview
            </h3>
            <Line
              data={{
                labels: Object.keys(monthlyData),
                datasets: [
                  {
                    label: 'Income',
                    data: Object.values(monthlyData).map(m => m.income),
                    borderColor: 'rgb(34, 197, 94)',
                    tension: 0.1
                  },
                  {
                    label: 'Expenses',
                    data: Object.values(monthlyData).map(m => m.expenses),
                    borderColor: 'rgb(239, 68, 68)',
                    tension: 0.1
                  }
                ]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: false
                  }
                }
              }}
            />
          </div>
        )}

        {insights?.topSpendingCategories && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
              Spending by Category
            </h3>
            <Pie
              data={{
                labels: insights.topSpendingCategories.map(c => c.category),
                datasets: [{
                  data: insights.topSpendingCategories.map(c => c.amount),
                  backgroundColor: [
                    'rgba(99, 102, 241, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                  ]
                }]
              }}
              options={{
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }}
            />
          </div>
        )}
      </div>

      {/* AI Insights Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          AI-Powered Insights
        </h2>
        <AIInsights />
      </div>

      {/* Recommendations Section */}
      {insights?.recommendations && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
            Financial Recommendations
          </h3>
          <div className="space-y-4">
            {insights.recommendations.map((rec, index) => (
              <div 
                key={index}
                className="flex items-start space-x-3 text-gray-600 dark:text-gray-400"
              >
                {rec.type === 'warning' && <span className="text-yellow-500">⚠️</span>}
                {rec.type === 'tip' && <span className="text-blue-500">💡</span>}
                {rec.type === 'improvement' && <span className="text-green-500">📈</span>}
                <div>
                  <p className="font-medium">{rec.message}</p>
                  {rec.action && (
                    <p className="text-sm mt-1 text-gray-500 dark:text-gray-500">
                      {rec.action}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
