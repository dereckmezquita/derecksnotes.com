'use client';

import dynamic from 'next/dynamic';

/**
 * SECURITY: This wrapper ensures CanvasWithJs NEVER executes on the server.
 * Even with 'use client', Next.js can pre-render components during SSR.
 * Using dynamic() with ssr: false completely prevents server-side execution.
 */
const CanvasWithJs = dynamic(
    () => import('./CanvasWithJsClient'),
    {
        ssr: false,
        loading: () => (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%'
                }}
            >
                <div
                    style={{
                        width: '400px',
                        height: '300px',
                        border: '1px solid #ddd',
                        background: '#f5f5f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <span style={{ color: '#999' }}>Loading canvas...</span>
                </div>
            </div>
        )
    }
);

export default CanvasWithJs;
