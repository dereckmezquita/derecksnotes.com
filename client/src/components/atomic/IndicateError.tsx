import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
    0% {
        transform: translateX(100%);
        opacity: 0;
    }
    100% {
        transform: translateX(0);
        opacity: 1;
    }
`;

const ErrorText = styled.div`
    color: red;
    border: 1px solid red;
    padding: 10px;
    margin-top: 10px;
    border-radius: 5px;
    animation: ${slideIn} 0.3s ease-out;
`;

interface IndicateErrorProps {
    message: string;
    shouldRender: boolean;
}

const IndicateError = ({ message, shouldRender }: IndicateErrorProps) => {
    const [shouldRenderMessage, setRenderMessage] = useState(shouldRender);

    useEffect(() => {
        if (shouldRender) {
            setRenderMessage(true);
        }
    }, [shouldRender]);

    const onAnimationEnd = () => {
        if (!shouldRender) {
            setRenderMessage(false);
        }
    };

    return shouldRenderMessage ? (
        <ErrorText
            onAnimationEnd={onAnimationEnd}
            style={{
                animation: shouldRender
                    ? 'slideIn 0.3s ease-out'
                    : 'slideOut 0.3s ease-out'
            }}
        >
            {message}
        </ErrorText>
    ) : null;
};

export default IndicateError;
