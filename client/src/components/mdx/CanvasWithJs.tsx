'use client';

import React, { useEffect, useRef } from 'react';

type CanvasWithJsProps = {
    code: string;
    width?: number; // Optional width prop
    height?: number; // Optional height prop
};

const CanvasWithJs: React.FC<CanvasWithJsProps> = ({
    code,
    width = 400, // Default width if none provided
    height = 300 // Default height if none provided
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Set explicit width and height attributes for the drawing buffer
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const fn = new Function('ctx', 'canvas', code);
        fn(ctx, canvas);
    }, [code, width, height]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                width: `${width}px`,
                height: `${height}px`,
                border: '1px solid #ccc'
            }}
        />
    );
};

export default CanvasWithJs;
