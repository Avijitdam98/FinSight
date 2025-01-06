import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  setLoading,
  setError,
  setSuccess,
  selectFilteredTransactions
} from '../store/slices/transactionSlice';
import { fetchChallenges } from '../store/slices/rewardsSlice';
import { transactionsAPI } from '../services/api';
import TransactionFilter from '../components/TransactionFilter';
import { exportToCSV, exportToPDF } from '../utils/exportUtils';
import { formatCurrency } from '../utils/currencyConverter';
import CurrencyDisplay from '../components/CurrencyDisplay';

const CATEGORIES = [
  'Food',
  'Transportation',
  'Housing',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Education',
  'Income',
  'Salary',
  'Investment',
  'Other'
];

const Transactions = () => {
  const dispatch = useDispatch();
  const transactions = useSelector(selectFilteredTransactions);
  const { data: settings } = useSelector((state) => state.settings);
  const loading = useSelector(state => state.transactions.loading);
  const error = useSelector(state => state.transactions.error);
  const success = useSelector(state => state.transactions.success);
  
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    tags: []
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [showEditForm, setShowEditForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    type: '',
    amount: '',
    category: '',
    description: '',
    date: '',
    tags: []
  });

  useEffect(() => {
    fetchTransactions();
  }, [dispatch]);

  const fetchTransactions = async () => {
    try {
      dispatch(setLoading(true));
      const response = await transactionsAPI.getAll();
      dispatch(setTransactions(response.data));
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      if (editingTransaction) {
        const response = await transactionsAPI.update(
          editingTransaction._id,
          formData
        );
        dispatch(updateTransaction(response.data));
      } else {
        const response = await transactionsAPI.add(formData);
        dispatch(addTransaction(response.data));
      }
      dispatch(fetchChallenges());
      resetForm();
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      dispatch(setLoading(true));
      await transactionsAPI.delete(deleteId);
      dispatch(deleteTransaction(deleteId));
      setShowDeleteConfirm(false);
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setDeleteId(null);
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      type: transaction.type,
      amount: transaction.amount,
      category: transaction.category,
      description: transaction.description || '',
      date: new Date(transaction.date).toISOString().split('T')[0],
      tags: transaction.tags || []
    });
    setShowForm(true);
  };

  const handleEditClick = (transaction) => {
    setEditingId(transaction._id);
    setEditForm({
      type: transaction.type,
      amount: transaction.amount,
      category: transaction.category,
      description: transaction.description || '',
      date: new Date(transaction.date).toISOString().split('T')[0],
      tags: transaction.tags || []
    });
    setShowEditForm(true);
  };

  const handleEditSubmit = async (e) => {
    e?.preventDefault();
    
    try {
      if (!editingId) return;

      dispatch(setLoading(true));
      dispatch(setError(null));
      
      // Validate form data
      if (!editForm.amount || !editForm.category || !editForm.date) {
        dispatch(setError('Please fill in all required fields'));
        return;
      }

      const updatedTransaction = {
        ...editForm,
        amount: Number(editForm.amount)
      };

      const { data } = await transactionsAPI.update(editingId, updatedTransaction);
      
      dispatch(updateTransaction(data));
      dispatch(setSuccess(true));
      setShowEditForm(false);
      setEditingId(null);
      
      // Close the dialog after a short delay
      setTimeout(() => {
        dispatch(setSuccess(false));
      }, 1500);
      
    } catch (err) {
      console.error('Update error:', err);
      dispatch(setError(err.response?.data?.message || 'Failed to update transaction'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleEditCancel = () => {
    setShowEditForm(false);
    setEditingId(null);
    setEditForm({
      type: '',
      amount: '',
      category: '',
      description: '',
      date: '',
      tags: []
    });
  };

  const resetForm = () => {
    setFormData({
      type: 'expense',
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      tags: []
    });
    setEditingTransaction(null);
    setShowForm(false);
  };

  if (loading && !transactions.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <>
          <div className="delete-dialog-overlay" onClick={handleDeleteCancel}>
            <div className="delete-dialog-ripple"></div>
          </div>
          <div className="delete-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="delete-dialog-content">
              <div className="delete-dialog-header">
                <div className="delete-warning-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="delete-dialog-title">Warning: Delete Transaction</h3>
              </div>
              <div className="delete-dialog-body">
                <div className="delete-dialog-message">
                  <p className="delete-warning-text">This action cannot be undone!</p>
                  <p className="delete-details-text">
                    You are about to delete a transaction with the following details:
                  </p>
                  <div className="delete-transaction-details">
                    <div className="detail-item">
                      <span className="detail-label">Category:</span>
                      <span className="detail-value">{transactions.find(t => t._id === deleteId)?.category}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Amount:</span>
                      <span className="detail-value">
                        <CurrencyDisplay 
                          amount={transactions.find(t => t._id === deleteId)?.amount || 0}
                          type={transactions.find(t => t._id === deleteId)?.type}
                        />
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Type:</span>
                      <span className={`detail-value ${transactions.find(t => t._id === deleteId)?.type}`}>
                        {transactions.find(t => t._id === deleteId)?.type}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Description:</span>
                      <span className="detail-value">{transactions.find(t => t._id === deleteId)?.description}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="delete-dialog-buttons">
                <button
                  onClick={handleDeleteCancel}
                  className="delete-dialog-button delete-dialog-cancel"
                >
                  <span className="button-icon">✕</span>
                  Keep Transaction
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="delete-dialog-button delete-dialog-confirm"
                >
                  <span className="button-icon">🗑</span>
                  Delete Permanently
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Edit Transaction Dialog */}
      {showEditForm && (
        <>
          <div className="edit-dialog-overlay" onClick={handleEditCancel}>
            <div className="edit-dialog-ripple"></div>
          </div>
          <div className="edit-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="edit-dialog-content">
              <form onSubmit={handleEditSubmit} className={loading ? 'form-loading' : ''}>
                <div className="edit-dialog-header">
                  <div className="edit-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <h3 className="edit-dialog-title">Edit Transaction</h3>
                  <p className="edit-dialog-subtitle">Update the transaction details below</p>
                </div>
                <div className="edit-dialog-body">
                  <div className="edit-form-grid">
                    <div className="form-group">
                      <label className="form-label" htmlFor="type">Type</label>
                      <select
                        id="type"
                        className="form-select"
                        value={editForm.type}
                        onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                        required
                      >
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="category">Category</label>
                      <select
                        id="category"
                        className="form-select"
                        value={editForm.category}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                        required
                      >
                        {CATEGORIES.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="amount">Amount</label>
                      <div className="amount-input-wrapper">
                        <span className="currency-symbol">₹</span>
                        <input
                          id="amount"
                          type="number"
                          className="form-input"
                          value={editForm.amount}
                          onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                          placeholder="Enter amount"
                          required
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="date">Date</label>
                      <input
                        id="date"
                        type="date"
                        className="form-input"
                        value={editForm.date}
                        onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group full-width">
                      <label className="form-label" htmlFor="description">Description</label>
                      <textarea
                        id="description"
                        className="form-textarea"
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        placeholder="Enter description"
                        rows="3"
                      />
                    </div>

                    <div className="form-group full-width">
                      <label className="form-label">Tags</label>
                      <div className="tags-input-wrapper">
                        {editForm.tags.map((tag, index) => (
                          <span key={index} className="tag-item">
                            {tag}
                            <button
                              type="button"
                              className="tag-remove"
                              onClick={() => {
                                const newTags = [...editForm.tags];
                                newTags.splice(index, 1);
                                setEditForm({ ...editForm, tags: newTags });
                              }}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                        <input
                          type="text"
                          className="tags-input"
                          placeholder="Add tags..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.target.value) {
                              e.preventDefault();
                              const newTag = e.target.value.trim();
                              if (newTag && !editForm.tags.includes(newTag)) {
                                setEditForm({
                                  ...editForm,
                                  tags: [...editForm.tags, newTag],
                                });
                                e.target.value = '';
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="edit-dialog-buttons">
                  <button
                    type="button"
                    onClick={handleEditCancel}
                    className="edit-dialog-button edit-dialog-cancel"
                  >
                    <span className="button-icon">✕</span>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="edit-dialog-button edit-dialog-save"
                    disabled={loading}
                  >
                    <span className="button-icon">💾</span>
                    Save Changes
                  </button>
                </div>

                {loading && (
                  <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Transactions</h1>
        <div className="space-x-4">
          <button
            onClick={() => exportToCSV(transactions)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Export CSV
          </button>
          <button
            onClick={() => exportToPDF(transactions)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Export PDF
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : 'Add Transaction'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Transaction updated successfully
        </div>
      )}

      <TransactionFilter />

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Amount
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              >
                <option value="">Select Category</option>
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter description"
              />
            </div>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {editingTransaction ? 'Update' : 'Add'} Transaction
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 transaction-table">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="table-cell font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="table-cell font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="table-cell font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="table-cell font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="table-cell font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="table-cell text-right font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {transactions.map((transaction) => (
              <tr key={transaction._id} className="transaction-row">
                <td className="table-cell text-gray-900 dark:text-gray-300">
                  {new Date(transaction.date).toLocaleDateString()}
                </td>
                <td className="table-cell">
                  <span className={`transaction-type ${transaction.type}`}>
                    {transaction.type}
                  </span>
                </td>
                <td className="table-cell text-gray-900 dark:text-gray-300">
                  {transaction.category}
                </td>
                <td className="table-cell text-gray-900 dark:text-gray-300">
                  <CurrencyDisplay 
                    amount={transaction.amount} 
                    type={transaction.type}
                  />
                </td>
                <td className="table-cell text-gray-900 dark:text-gray-300">
                  {transaction.description}
                </td>
                <td className="table-cell">
                  <div className="action-buttons">
                    <button
                      onClick={() => handleEditClick(transaction)}
                      className="action-button edit-button"
                    >
                      <span className="relative z-10">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteClick(transaction._id)}
                      className="action-button delete-button"
                    >
                      <span className="relative z-10">Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {loading && (
              <tr className="loading-row">
                <td colSpan="6" className="table-cell">
                  <div className="flex justify-center">
                    <div className="loading-spinner"></div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;
