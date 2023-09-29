import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    isAuthenticated: boolean;
    data: any | null; // Update this 'any' to the actual type of your user data if available
    loading: boolean;
    error: string | null;
    lastFetched: number | null;
}

const initialState: UserState = {
    isAuthenticated: false,
    data: null,
    loading: false,
    error: null,
    lastFetched: null
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        fetchUserDataStart: (state) => {
            state.loading = true;
        },
        fetchUserDataSuccess: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.data = action.payload;
            state.lastFetched = Date.now();
        },
        fetchUserDataFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            return initialState;
        }
    }
});

export const { fetchUserDataStart, fetchUserDataSuccess, fetchUserDataFailure, logout } = userSlice.actions;
export default userSlice.reducer;
