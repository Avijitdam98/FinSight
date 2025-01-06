import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  data: {
    preferences: {
      currency: 'USD',
      dateFormat: 'MM/DD/YYYY',
      notifications: {
        emailAlerts: true,
        pushNotifications: true,
        monthlyReport: true
      }
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30
    }
  },
  isLoading: false,
  error: null
};

export const fetchSettings = createAsyncThunk(
  'settings/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/settings');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch settings');
    }
  }
);

export const updateSettings = createAsyncThunk(
  'settings/updateSettings',
  async (settings, { rejectWithValue }) => {
    try {
      const response = await axios.put('/api/settings', settings);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update settings');
    }
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateSettingLocally: (state, action) => {
      const { category, field, value } = action.payload;
      if (!state.data[category]) {
        state.data[category] = {};
      }
      if (field.includes('.')) {
        const [parentField, childField] = field.split('.');
        if (!state.data[category][parentField]) {
          state.data[category][parentField] = {};
        }
        state.data[category][parentField][childField] = value;
      } else {
        state.data[category][field] = value;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateSettings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { updateSettingLocally } = settingsSlice.actions;
export default settingsSlice.reducer;
