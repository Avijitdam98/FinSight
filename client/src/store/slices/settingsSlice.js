import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Load saved preferences from localStorage
const loadSavedPreferences = () => {
  try {
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      return JSON.parse(savedPreferences);
    }
  } catch (error) {
    console.error('Error loading preferences:', error);
  }
  return null;
};

const savedPreferences = loadSavedPreferences();

// Set up axios interceptor for auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const initialState = {
  data: {
    preferences: {
      currency: savedPreferences?.preferences?.currency || 'USD',
      dateFormat: savedPreferences?.preferences?.dateFormat || 'MM/DD/YYYY',
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
      const response = await axios.get(`${API_URL}/settings`);
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
      const response = await axios.put(`${API_URL}/settings`, settings);
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
      const { path, value } = action.payload;
      let current = state.data;
      const pathArray = path.split('.');
      
      // Navigate to the nested location
      for (let i = 0; i < pathArray.length - 1; i++) {
        current = current[pathArray[i]];
      }
      
      // Update the value
      current[pathArray[pathArray.length - 1]] = value;
      
      // Save to localStorage
      try {
        localStorage.setItem('userPreferences', JSON.stringify(state.data));
      } catch (error) {
        console.error('Error saving preferences:', error);
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
        // Save fetched settings to localStorage
        try {
          localStorage.setItem('userPreferences', JSON.stringify(action.payload));
        } catch (error) {
          console.error('Error saving fetched preferences:', error);
        }
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
