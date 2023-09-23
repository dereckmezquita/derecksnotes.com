import { configureStore } from '@reduxjs/toolkit';
import tagsFilterVisibilitySlice from './tagsFilterVisibilitySlice';
import userSlice from './userSlice';


export const store = configureStore({
    reducer: {
        visibility: tagsFilterVisibilitySlice, // toggle post tags filter visibility
        user: userSlice // user data
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
