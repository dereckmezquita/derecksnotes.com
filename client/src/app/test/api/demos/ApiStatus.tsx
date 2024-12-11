'use client';
import React, { useState, useEffect } from 'react';
import { api } from '@utils/api/api';
import { IndicateLoading } from '@components/atomic/IndiacteLoading';
import { BoxContainer } from '../modules/BoxContainer';

export function ApiStatus() {
    const [loading, setLoading] = useState(true);
    const [apiData, setApiData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/');
                setApiData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <BoxContainer>
            {loading ? (
                <IndicateLoading />
            ) : (
                <pre>{JSON.stringify(apiData, null, 2)}</pre>
            )}
        </BoxContainer>
    );
}
