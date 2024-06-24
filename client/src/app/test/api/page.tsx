'use client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api } from '@components/utils/api/api';
import {
    Article,
    PostContainer
} from '@components/components/pages/posts-dictionaries';

function Page() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const toastId = toast.loading('Fetching data...');
            try {
                const response = await api.get('/');
                setData(response.data);
                toast.success('Data fetched successfully!', { id: toastId });
            } catch (error: any) {
                console.error('Error fetching data:', error);
                setError(error.message);
                toast.error(`Failed to fetch data: ${error.message}`, {
                    id: toastId
                });
            }
        }

        fetchData();
    }, []);

    if (error) {
        return (
            <PostContainer>
                <Article>
                    <h1>Error</h1>
                    <pre>Failed to fetch data: {error}</pre>
                </Article>
            </PostContainer>
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
