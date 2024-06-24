'use client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api } from '@components/utils/api/api';
import {
    Article,
    PostContainer
} from '@components/components/pages/posts-dictionaries';

function PostArticle({ children }: { children: React.ReactNode }) {
    return (
        <PostContainer>
            <Article sideBar={false} style={{ width: '90%' }}>
                {children}
            </Article>
        </PostContainer>
    );
}

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
            <PostArticle>
                <h1>Error</h1>
                <pre>Failed to fetch data: {error}</pre>
            </PostArticle>
        );
    }

    if (!data) {
        return (
            <PostArticle>
                <h1>Loading...</h1>
            </PostArticle>
        );
    }

    return (
        <PostArticle>
            <h1>Hello world!</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </PostArticle>
    );
}

export default Page;
