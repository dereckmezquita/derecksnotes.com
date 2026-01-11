'use client';
import React from 'react';
import styled from 'styled-components';

type AlertType = 'note' | 'important' | 'warning';

interface AlertProps {
    type: AlertType;
    children?: React.ReactNode;
}

const ALERT_STYLES = {
    note: {
        color: 'rgb(47, 129, 247)',
        iconData:
            'M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z',
        title: 'Note'
    },
    important: {
        color: 'rgb(163, 113, 247)',
        iconData:
            'M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v9.5A1.75 1.75 0 0 1 14.25 13H8.06l-2.573 2.573A1.458 1.458 0 0 1 3 14.543V13H1.75A1.75 1.75 0 0 1 0 11.25Zm1.75-.25a.25.25 0 0 0-.25.25v9.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h6.5a.25.25 0 0 0 .25-.25v-9.5a.25.25 0 0 0-.25-.25Zm7 2.25v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z',
        title: 'Important'
    },
    warning: {
        color: 'rgb(210, 153, 34)',
        iconData:
            'M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z',
        title: 'Warning'
    }
};

const AlertContainer = styled.div<{ $borderColor: string }>`
    padding: 2px 15px;
    margin-top: 10px;
    margin-bottom: 10px;
    color: inherit;
    border-left: 0.25em solid ${(props) => props.$borderColor};
    font-family:
        -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica,
        Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';
`;

const AlertTitle = styled.p<{ $titleColor: string }>`
    display: flex;
    align-items: center;
    font-weight: bold;
    color: ${(props) => props.$titleColor};
    svg {
        margin-right: 8px;
    }
`;

const Alert: React.FC<AlertProps> = ({ type, children }) => {
    type = type.toLowerCase() as AlertType;
    const { color, iconData, title } = ALERT_STYLES[type];
    return (
        <AlertContainer $borderColor={color}>
            <AlertTitle $titleColor={color}>
                <svg
                    className="octicon octicon-info"
                    viewBox="0 0 16 16"
                    version="1.1"
                    width="16"
                    height="16"
                    aria-hidden="true"
                >
                    <path d={iconData} fill={color} />
                </svg>
                {title}
            </AlertTitle>
            {children}
        </AlertContainer>
    );
};

export default Alert;

// Usage:
// <Alert type="note">This is a note</Alert>
// <Alert type="important">This is important</Alert>
// <Alert type="warning">This is a warning</Alert>
