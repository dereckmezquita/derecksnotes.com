'use client';
import React, { useState, useEffect } from 'react';
import { IndicateLoading } from '@/components/atomic/IndicateLoading';
import { BoxContainer } from '../modules/BoxContainer';

interface ApiInfo {
  name: string;
  version: string;
  status: string;
  environment: string;
}

export function ApiStatus() {
  const [loading, setLoading] = useState(true);
  const [apiData, setApiData] = useState<ApiInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api')
      .then((res) => res.json())
      .then((data: ApiInfo) => setApiData(data))
      .catch(() => setError('Failed to connect to API'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <BoxContainer>
      {loading ? (
        <IndicateLoading />
      ) : error ? (
        <p style={{ color: '#c62828' }}>{error}</p>
      ) : (
        <pre>{JSON.stringify(apiData, null, 2)}</pre>
      )}
    </BoxContainer>
  );
}
