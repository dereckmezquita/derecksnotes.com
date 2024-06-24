'use client';
import { useEffect, useState } from 'react';
import { api } from '@components/utils/api/api';

function Page() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                console.log('Attempting to fetch from:', '/api');
                const response = await api.get('/');
                console.log('Response:', response.data);
                setData(response.data);
            } catch (error: any) {
                console.error('Error fetching data:', error);
                setError(error.message);
            }
        }

        fetchData();
    }, []);

    if (error) {
        return (
            <>
                <h1>Error</h1>
                <p>Failed to fetch data: {error}</p>
            </>
        );
    }

    if (!data) {
        return <h1>Loading...</h1>;
    }

    return (
        <>
            <h1>Hello world!</h1>
            <p>{JSON.stringify(data)}</p>
        </>
    );
}

export default Page;
