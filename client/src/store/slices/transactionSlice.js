import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  transactions: [],
  isLoading: false,
  error: null,
  filters: {
    startDate: null,
    endDate: null,
    category: null,
    minAmount: null,
    maxAmount: null,
    searchTerm: ''
  },
  stats: {
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0
  },
  insights: null
};

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    fetchTransactionsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchTransactionsSuccess: (state, action) => {
      state.isLoading = false;
      if (Array.isArray(action.payload)) {
        state.transactions = action.payload;
        state.stats = calculateStats(action.payload);
      } else if (action.payload.transactions) {
        state.transactions = action.payload.transactions;
        state.stats = calculateStats(action.payload.transactions);
      }
      if (action.payload.insights) {
        state.insights = action.payload.insights;
      }
      state.error = null;
    },
    fetchTransactionsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    addTransactionSuccess: (state, action) => {
      state.transactions.unshift(action.payload);
      state.stats = calculateStats(state.transactions);
    },
    updateTransactionSuccess: (state, action) => {
      const index = state.transactions.findIndex(t => t._id === action.payload._id);
      if (index !== -1) {
        state.transactions[index] = action.payload;
        state.stats = calculateStats(state.transactions);
      }
    },
    deleteTransactionSuccess: (state, action) => {
      state.transactions = state.transactions.filter(t => t._id !== action.payload);
      state.stats = calculateStats(state.transactions);
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    }
  }
});

// Helper function to calculate transaction stats
const calculateStats = (transactions) => {
  if (!Array.isArray(transactions)) {
    return initialState.stats;
  }
  
  return transactions.reduce((acc, transaction) => {
    const amount = Number(transaction.amount);
    if (transaction.type === 'income') {
      acc.totalIncome += amount;
      acc.balance += amount;
    } else {
      acc.totalExpenses += amount;
      acc.balance -= amount;
    }
    return acc;
  }, {
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0
  });
};

export const {
  fetchTransactionsStart,
  fetchTransactionsSuccess,
  fetchTransactionsFailure,
  addTransactionSuccess,
  updateTransactionSuccess,
  deleteTransactionSuccess,
  setFilters,
  clearFilters
} = transactionSlice.actions;

export default transactionSlice.reducer;
