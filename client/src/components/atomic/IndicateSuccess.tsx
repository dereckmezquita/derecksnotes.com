import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

const popIn = keyframes`
    0% {
        transform: scale(0);
        opacity: 0;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
`;

const SuccessText = styled.div`
    color: green;
    border: 1px solid green;
    padding: 10px;
    margin-top: 10px;
    border-radius: 5px;
    animation: ${popIn} 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
`;

interface IndicateSuccessProps {
    message: string
    shouldRender: boolean
}

const IndicateSuccess = ({ message, shouldRender }: IndicateSuccessProps) => {
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
        <SuccessText
            onAnimationEnd={onAnimationEnd}
            style={{ animation: shouldRender ? "slideIn 0.3s ease-out" : "slideOut 0.3s ease-out" }}
        >
            {message}
        </SuccessText>
    ) : null;
};

export default IndicateSuccess;
