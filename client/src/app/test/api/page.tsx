'use client';
import { useEffect, useState } from 'react';
import { api } from '@components/utils/api/api';
import { Article, PostContainer } from '@components/components/pages/posts-dictionaries';

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
        <PostContainer>
            <Article sideBar={false} style={{ width: '90%' }}>
                <h1>Hello world!</h1>
                <pre>{JSON.stringify(data, null, 2)}</pre>
            </Article>
        </PostContainer>
    );
}

export default Page;
