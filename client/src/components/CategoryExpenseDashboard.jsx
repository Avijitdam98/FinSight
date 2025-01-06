import React from 'react';
import { useSelector } from 'react-redux';
import { Bar } from 'react-chartjs-2';

const CategoryExpenseDashboard = () => {
  const transactions = useSelector((state) => state.transactions.data);

  console.log('Transactions:', transactions);

  if (!transactions || transactions.length === 0) {
    return <div className="text-center text-gray-500">No transaction data available.</div>;
  }

  const categoryTotals = transactions.reduce((acc, transaction) => {
    const { category, amount } = transaction;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += amount;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: 'Expenses by Category',
        data: Object.values(categoryTotals),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Expense Dashboard</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default CategoryExpenseDashboard;
