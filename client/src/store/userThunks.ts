import { fetchUserDataStart, fetchUserDataSuccess, fetchUserDataFailure } from './userSlice';
import api_me from '@utils/api/auth/me';
import { AppDispatch } from './store';

export const fetchUserData = () => async (dispatch: AppDispatch) => {
    dispatch(fetchUserDataStart());

    try {
        const userData = await api_me();
        dispatch(fetchUserDataSuccess(userData));
    } catch (error: any) {
        dispatch(fetchUserDataFailure(error.message));
    }
};
