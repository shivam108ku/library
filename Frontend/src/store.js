import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./slices/authSlice";
import themeSlice from './slices/themeSlice'; // Import here

const store = configureStore({
    reducer: {
        authSlice: authSliceReducer,
        themeSlice: themeSlice,
    }
});

export default store;