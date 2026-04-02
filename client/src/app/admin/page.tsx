'use client';
import { useAuth } from '@/context/AuthContext';

export default function AdminPage() {
    const { user, isAdmin } = useAuth();

    if (!isAdmin()) {
        return <p>Access denied.</p>;
    }

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Admin Dashboard</h1>
            <p>Welcome, {user?.username}. Admin pages are being rebuilt.</p>
        </div>
    );
}
