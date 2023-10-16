import { fetchUserDataStart, fetchUserDataSuccess, fetchUserDataFailure } from './userSlice';
import api_me from '@utils/api/auth/me';
import { AppDispatch } from './store';

import { REFRESH_STORE_DATA_INTERVAL } from '@constants/config';
import { AnyAction } from '@reduxjs/toolkit';

export const fetchUserData = (): any => async (dispatch: AppDispatch) => {
    const cachedData = localStorage.getItem('userData');
    const cachedTimestamp = localStorage.getItem('lastFetched');
    
    const currentTime = Date.now();
    
    // Example: Refresh data if it's older than 1 hour
    const REFRESH_INTERVAL = REFRESH_STORE_DATA_INTERVAL; // 3600000;

    if (cachedData && cachedTimestamp && (currentTime - Number(cachedTimestamp) < REFRESH_INTERVAL)) {
        dispatch(fetchUserDataSuccess(JSON.parse(cachedData)));
        return;
    }

    dispatch(fetchUserDataStart());

    try {
        const userData = await api_me();
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('lastFetched', String(currentTime));
        dispatch(fetchUserDataSuccess(userData));
    } catch (error: any) {
        dispatch(fetchUserDataFailure(error.message));
    }
};
