import React, { useEffect, useState } from 'react';
import api_me from './auth/me';

interface User {
    email: {
        address: string;
        verified: boolean;
    };
    username: string;
    metadata: {
        geoLocations: any[];
        commentsJudged?: any[];
    };
    _id: string;
}

export const ApiMe: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await api_me();
                console.log(data);
                setUser(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>User Details</h1>
            <p><strong>Email:</strong> {user?.email.address}</p>
            <p><strong>Username:</strong> {user?.username}</p>
            <p><strong>ID:</strong> {user?._id}</p>
            {/* You can expand this to display more data as needed */}
        </div>
    );
}

// component using Redux store instead of API; this data is fetched on app load from _app.tsx using thunk
import { useSelector } from 'react-redux';
import { RootState } from '@store/store';

export const ReduxMe: React.FC = () => {
    // Access user state from Redux store
    const userState = useSelector((state: RootState) => state.user);

    if (userState.loading) {
        return <div>Loading...</div>;
    }

    if (userState.error) {
        return <div>Error: {userState.error}</div>;
    }

    if (!userState.isAuthenticated || !userState.data) {
        return <div>No user data available.</div>;
    }

    console.log(userState);

    return (
        <div>
            <h1>User Details</h1>
            <p><strong>Email:</strong> {userState.data.email.address}</p>
            <p><strong>Username:</strong> {userState.data.username}</p>
            <p><strong>ID:</strong> {userState.data._id}</p>
            {/* You can expand this to display more data as needed */}
        </div>
    );
}
