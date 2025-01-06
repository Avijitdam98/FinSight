import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  transactions: [],
  loading: false,
  error: null,
  success: false,
  filters: {
    type: '',
    category: '',
    dateRange: 'all',
    minAmount: '',
    maxAmount: '',
    search: ''
  }
};

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setTransactions: (state, action) => {
      state.transactions = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setSuccess: (state, action) => {
      state.success = action.payload;
    },
    addTransaction: (state, action) => {
      state.transactions.unshift(action.payload);
    },
    updateTransaction: (state, action) => {
      const index = state.transactions.findIndex(t => t._id === action.payload._id);
      if (index !== -1) {
        state.transactions[index] = action.payload;
      }
    },
    deleteTransaction: (state, action) => {
      state.transactions = state.transactions.filter(t => t._id !== action.payload);
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    }
  }
});

export const {
  setTransactions,
  setLoading,
  setError,
  setSuccess,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  setFilters,
  clearFilters
} = transactionSlice.actions;

// Memoized selectors
const selectTransactions = state => state.transactions.transactions;
const selectFilters = state => state.transactions.filters;

export const selectFilteredTransactions = createSelector(
  [selectTransactions, selectFilters],
  (transactions, filters) => {
    return transactions.filter(transaction => {
      // Type filter
      if (filters.type && transaction.type !== filters.type) {
        return false;
      }

      // Category filter
      if (filters.category && transaction.category !== filters.category) {
        return false;
      }

      // Date range filter
      if (filters.dateRange !== 'all') {
        const transactionDate = new Date(transaction.date);
        const today = new Date();
        const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));
        const ninetyDaysAgo = new Date(today.setDate(today.getDate() - 90));
        const thisYear = new Date(today.getFullYear(), 0, 1);

        switch (filters.dateRange) {
          case '30days':
            if (transactionDate < thirtyDaysAgo) return false;
            break;
          case '90days':
            if (transactionDate < ninetyDaysAgo) return false;
            break;
          case 'thisYear':
            if (transactionDate < thisYear) return false;
            break;
          default:
            break;
        }
      }

      // Amount range filter
      const amount = Number(transaction.amount);
      if (filters.minAmount && amount < Number(filters.minAmount)) {
        return false;
      }
      if (filters.maxAmount && amount > Number(filters.maxAmount)) {
        return false;
      }

      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        return (
          transaction.description?.toLowerCase().includes(searchTerm) ||
          transaction.category.toLowerCase().includes(searchTerm) ||
          transaction.type.toLowerCase().includes(searchTerm)
        );
      }

      return true;
    });
  }
);

export default transactionSlice.reducer;
