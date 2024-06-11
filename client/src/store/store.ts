import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import tagsFilterVisibilitySlice from './tagsFilterVisibilitySlice';
import userSlice from './userSlice';
import { logger } from 'redux-logger';

import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const middleware = (getDefaultMiddleware: any) => {
    if (process.env.REDUX_LOGGER === 'true') {
        return getDefaultMiddleware().concat(thunk, logger);
    } else {
        return getDefaultMiddleware().concat(thunk);
    }
};

export const store = configureStore({
    reducer: {
        visibility: tagsFilterVisibilitySlice, // toggle post tags filter visibility
        user: userSlice // user data
    },
    middleware: middleware
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
