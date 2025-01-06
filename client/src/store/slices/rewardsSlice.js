import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/rewards';

// Async thunks
export const fetchBadges = createAsyncThunk(
  'rewards/fetchBadges',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/badges`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchChallenges = createAsyncThunk(
  'rewards/fetchChallenges',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/challenges`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const startChallenge = createAsyncThunk(
  'rewards/startChallenge',
  async (challengeData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/challenges`, challengeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateChallengeProgress = createAsyncThunk(
  'rewards/updateChallengeProgress',
  async ({ id, currentAmount }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${API_URL}/challenges/${id}/progress`,
        { currentAmount }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const rewardsSlice = createSlice({
  name: 'rewards',
  initialState: {
    badges: [],
    challenges: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Badges
      .addCase(fetchBadges.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBadges.fulfilled, (state, action) => {
        state.loading = false;
        state.badges = action.payload;
      })
      .addCase(fetchBadges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Challenges
      .addCase(fetchChallenges.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChallenges.fulfilled, (state, action) => {
        state.loading = false;
        state.challenges = action.payload;
      })
      .addCase(fetchChallenges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Start Challenge
      .addCase(startChallenge.fulfilled, (state, action) => {
        state.challenges.push(action.payload);
      })
      
      // Update Challenge Progress
      .addCase(updateChallengeProgress.fulfilled, (state, action) => {
        const index = state.challenges.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) {
          state.challenges[index] = action.payload;
        }
      });
  }
});

export default rewardsSlice.reducer;
