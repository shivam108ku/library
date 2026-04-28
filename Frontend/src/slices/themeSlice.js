import { createSlice } from '@reduxjs/toolkit';

const getInitialAppearance = () => localStorage.getItem('app-appearance') || 'light';
const getInitialAccent = () => localStorage.getItem('app-accent') || 'blue';

const initialState = {
  appearance: getInitialAppearance(), // 'light', 'dark', 'midnight', 'nord'
  accent: getInitialAccent(),         // 'blue', 'emerald', 'purple', etc.
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setAppearance: (state, action) => {
      state.appearance = action.payload;
      localStorage.setItem('app-appearance', action.payload);
    },
    setAccent: (state, action) => {
      state.accent = action.payload;
      localStorage.setItem('app-accent', action.payload);
    }
  },
});

export const { setAppearance, setAccent } = themeSlice.actions;
export default themeSlice.reducer;