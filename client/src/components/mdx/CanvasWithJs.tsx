'use client';

import React, { useMemo } from 'react';

type CanvasWithJsProps = {
    code: string;
    width?: number;
    height?: number;
};

/**
 * CanvasWithJs - Secure canvas execution component
 *
 * Since Next.js 15.1.11 blocks `new Function()` for security (React2Shell fix),
 * we use an iframe sandbox with srcdoc to execute the drawing code safely.
 */
const CanvasWithJs: React.FC<CanvasWithJsProps> = ({
    code,
    width = 400,
    height = 300
}) => {
    // Build the HTML content for the iframe using srcdoc
    // This avoids needing to access contentDocument which is blocked by sandbox
    const iframeSrc = useMemo(() => {
        // Escape any </script> tags in the code to prevent breaking out
        const escapedCode = code.replace(/<\/script>/gi, '<\\/script>');

        return `<!DOCTYPE html>
<html>
<head>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { overflow: hidden; background: white; }
        canvas { display: block; }
        .error { color: red; padding: 10px; font-size: 12px; font-family: monospace; }
    </style>
</head>
<body>
    <canvas id="canvas" width="${width}" height="${height}"></canvas>
    <script>
        try {
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');
            ${escapedCode}
        } catch (e) {
            document.body.innerHTML = '<div class="error">Error: ' + e.message + '</div>';
        }
    </script>
</body>
</html>`;
    }, [code, width, height]);

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%'
            }}
        >
            <iframe
                srcDoc={iframeSrc}
                sandbox="allow-scripts"
                referrerPolicy="no-referrer"
                style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    border: '1px solid #ccc',
                    display: 'block'
                }}
                title="Canvas visualization"
            />
        </div>
    );
};

export default CanvasWithJs;
