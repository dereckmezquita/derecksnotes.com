import { configureStore } from '@reduxjs/toolkit';
import tagsFilterVisibilitySlice from './tagsFilterVisibilitySlice';

export const store = configureStore({
    reducer: {
        visibility: tagsFilterVisibilitySlice // toggle post tags filter visibility
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
