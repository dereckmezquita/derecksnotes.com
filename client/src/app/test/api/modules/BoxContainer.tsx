import React from 'react';
import styled from 'styled-components';

const Box = styled.div`
    padding: 20px;
    text-decoration: none;
    color: inherit;
    border: 1px solid #ccc;
    border-radius: 5px;
    text-align: center;

    &:hover {
        border-color: #aaa;
    }
`;

const BoxWrapper = styled.div`
    width: 50%;
    margin: 0 auto 20px;
    &:last-child {
        margin-bottom: 0; // NOTE: removes margin from last child
    }
`;

export function BoxContainer({ children }: { children: React.ReactNode }) {
    return (
        <BoxWrapper>
            <Box>
                <div style={{ padding: '20px' }}>{children}</div>
            </Box>
        </BoxWrapper>
    );
}
