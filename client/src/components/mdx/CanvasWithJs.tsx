'use client';

import React, { useEffect, useRef, useState } from 'react';

type CanvasWithJsProps = {
    code: string;
    width?: number;
    height?: number;
};

/**
 * CanvasWithJs - Secure canvas execution component
 * 
 * Since Next.js 15.1.11 blocks `new Function()` for security (React2Shell fix),
 * we use an iframe sandbox to execute the drawing code safely.
 */
const CanvasWithJs: React.FC<CanvasWithJsProps> = ({
    code,
    width = 400,
    height = 300
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        
        // Clear previous content
        containerRef.current.innerHTML = '';
        setError(null);

        // Create a sandboxed iframe
        const iframe = document.createElement('iframe');
        iframe.style.width = `${width}px`;
        iframe.style.height = `${height}px`;
        iframe.style.border = '1px solid #ccc';
        iframe.style.display = 'block';
        
        // Sandbox attributes - allow scripts but nothing else dangerous
        iframe.setAttribute('sandbox', 'allow-scripts');
        iframe.setAttribute('referrerpolicy', 'no-referrer');
        
        containerRef.current.appendChild(iframe);

        // Wait for iframe to load, then inject the canvas code
        iframe.onload = () => {
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                if (!iframeDoc) {
                    setError('Could not access iframe');
                    return;
                }

                // Write HTML with canvas and script
                iframeDoc.open();
                iframeDoc.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            * { margin: 0; padding: 0; box-sizing: border-box; }
                            body { overflow: hidden; background: white; }
                            canvas { display: block; }
                        </style>
                    </head>
                    <body>
                        <canvas id="canvas" width="${width}" height="${height}"></canvas>
                        <script>
                            try {
                                const canvas = document.getElementById('canvas');
                                const ctx = canvas.getContext('2d');
                                ${code}
                            } catch (e) {
                                document.body.innerHTML = '<div style="color: red; padding: 10px; font-size: 12px;">Error: ' + e.message + '</div>';
                            }
                        </script>
                    </body>
                    </html>
                `);
                iframeDoc.close();
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Execution error');
            }
        };

        // Trigger iframe load
        iframe.src = 'about:blank';

        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        };
    }, [code, width, height]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', flexDirection: 'column', gap: '8px' }}>
            <div ref={containerRef} />
            {error && (
                <div style={{ color: '#c00', fontSize: '12px', maxWidth: `${width}px` }}>
                    Error: {error}
                </div>
            )}
        </div>
    );
};

export default CanvasWithJs;
