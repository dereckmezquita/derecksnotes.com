'use client';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated()) {
        return <p>Please log in to view your profile.</p>;
    }

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Profile</h1>
            <p>Username: {user?.username}</p>
            <p>Profile page is being rebuilt.</p>
        </div>
    );
}
