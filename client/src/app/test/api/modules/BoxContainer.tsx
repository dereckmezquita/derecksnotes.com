import React from 'react';
import styled from 'styled-components';

const Box = styled.div`
    margin: 10px;
    padding: 20px;
    text-decoration: none;
    color: inherit;

    padding: 5px;
    text-decoration: none;

    border: 1px solid #ccc;
    border-radius: 5px;
    text-align: center;

    &:hover {
        border-color: #aaa;
    }
`;

export function BoxContainer({ children }: { children: React.ReactNode }) {
    return (
        <Box style={{ width: '50%', margin: 'auto' }}>
            <div style={{ padding: '20px' }}>{children}</div>
        </Box>
    );
}
