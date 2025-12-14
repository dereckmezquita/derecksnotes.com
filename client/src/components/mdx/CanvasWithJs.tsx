'use client';

import React, { useEffect, useRef, useState } from 'react';

type CanvasWithJsProps = {
    code: string;
    width?: number;
    height?: number;
};

// SECURITY: Whitelist of allowed canvas operations only
// This prevents arbitrary code execution (RCE vulnerability)
const ALLOWED_METHODS = new Set([
    // Drawing rectangles
    'fillRect',
    'strokeRect',
    'clearRect',
    // Drawing text
    'fillText',
    'strokeText',
    'measureText',
    // Drawing paths
    'beginPath',
    'closePath',
    'moveTo',
    'lineTo',
    'bezierCurveTo',
    'quadraticCurveTo',
    'arc',
    'arcTo',
    'ellipse',
    'rect',
    'fill',
    'stroke',
    'clip',
    // Transformations
    'rotate',
    'scale',
    'translate',
    'transform',
    'setTransform',
    'resetTransform',
    // State
    'save',
    'restore',
    // Images (safe subset)
    'drawImage',
    'createLinearGradient',
    'createRadialGradient',
    'createPattern'
]);

// SECURITY: Whitelist of allowed canvas properties
const ALLOWED_PROPERTIES = new Set([
    'fillStyle',
    'strokeStyle',
    'lineWidth',
    'lineCap',
    'lineJoin',
    'miterLimit',
    'lineDashOffset',
    'font',
    'textAlign',
    'textBaseline',
    'direction',
    'globalAlpha',
    'globalCompositeOperation',
    'shadowBlur',
    'shadowColor',
    'shadowOffsetX',
    'shadowOffsetY',
    'imageSmoothingEnabled',
    'imageSmoothingQuality'
]);

// SECURITY: Pattern to detect dangerous code patterns
const DANGEROUS_PATTERNS = [
    /require\s*\(/i,
    /import\s*\(/i,
    /eval\s*\(/i,
    /Function\s*\(/i,
    /child_process/i,
    /exec\s*\(/i,
    /spawn\s*\(/i,
    /process\./i,
    /global\./i,
    /globalThis/i,
    /__proto__/i,
    /prototype/i,
    /constructor/i,
    /fetch\s*\(/i,
    /XMLHttpRequest/i,
    /WebSocket/i,
    /Worker\s*\(/i,
    /SharedWorker/i,
    /ServiceWorker/i,
    /document\./i,
    /window\./i,
    /localStorage/i,
    /sessionStorage/i,
    /indexedDB/i,
    /crypto\./i,
    /navigator\./i,
    /location\./i,
    /history\./i,
    /alert\s*\(/i,
    /confirm\s*\(/i,
    /prompt\s*\(/i,
    /setTimeout/i,
    /setInterval/i,
    /setImmediate/i,
    /requestAnimationFrame/i,
    /while\s*\(/i,
    /for\s*\(/i,
    /do\s*\{/i
];

function validateCode(code: string): { valid: boolean; error?: string } {
    // Check for dangerous patterns
    for (const pattern of DANGEROUS_PATTERNS) {
        if (pattern.test(code)) {
            return {
                valid: false,
                error: `Blocked: dangerous pattern detected`
            };
        }
    }
    return { valid: true };
}

// Safe execution using only whitelisted canvas operations
function executeCanvasCode(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    code: string
): void {
    const validation = validateCode(code);
    if (!validation.valid) {
        console.error('CanvasWithJs security:', validation.error);
        // Draw error message on canvas
        ctx.fillStyle = '#ff0000';
        ctx.font = '14px monospace';
        ctx.fillText('Security: Code blocked', 10, 30);
        return;
    }

    // Parse and execute only safe canvas operations
    const lines = code
        .split(';')
        .map((l) => l.trim())
        .filter(Boolean);

    for (const line of lines) {
        try {
            // Handle property assignments: ctx.fillStyle = '#fff'
            const propMatch = line.match(
                /^ctx\.(\w+)\s*=\s*['"]([^'"]+)['"]\s*$/
            );
            if (propMatch) {
                const [, prop, value] = propMatch;
                if (ALLOWED_PROPERTIES.has(prop)) {
                    (ctx as unknown as Record<string, unknown>)[prop] = value;
                }
                continue;
            }

            // Handle numeric property assignments: ctx.lineWidth = 5
            const numPropMatch = line.match(/^ctx\.(\w+)\s*=\s*([\d.]+)\s*$/);
            if (numPropMatch) {
                const [, prop, value] = numPropMatch;
                if (ALLOWED_PROPERTIES.has(prop)) {
                    (ctx as unknown as Record<string, unknown>)[prop] =
                        parseFloat(value);
                }
                continue;
            }

            // Handle method calls: ctx.fillRect(0, 0, 100, 100)
            const methodMatch = line.match(
                /^ctx\.(\w+)\s*\(\s*([^)]*)\s*\)\s*$/
            );
            if (methodMatch) {
                const [, method, argsStr] = methodMatch;
                if (ALLOWED_METHODS.has(method)) {
                    // Parse arguments safely (only numbers and strings)
                    const args = argsStr
                        .split(',')
                        .map((a) => a.trim())
                        .filter(Boolean)
                        .map((a) => {
                            // String argument
                            if (
                                (a.startsWith("'") && a.endsWith("'")) ||
                                (a.startsWith('"') && a.endsWith('"'))
                            ) {
                                return a.slice(1, -1);
                            }
                            // Number argument
                            const num = parseFloat(a);
                            if (!isNaN(num)) return num;
                            // canvas.width or canvas.height
                            if (a === 'canvas.width') return canvas.width;
                            if (a === 'canvas.height') return canvas.height;
                            return 0;
                        });
                    const fn = ctx[method as keyof CanvasRenderingContext2D];
                    if (typeof fn === 'function') {
                        (fn as (...args: unknown[]) => void).apply(ctx, args);
                    }
                }
                continue;
            }
        } catch (e) {
            console.error('CanvasWithJs execution error:', e);
        }
    }
}

const CanvasWithJs: React.FC<CanvasWithJsProps> = ({
    code,
    width = 400,
    height = 300
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [mounted, setMounted] = useState(false);

    // SECURITY: Only run on client-side, never during SSR
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        // SECURITY: Double-check we're on client
        if (!mounted || typeof window === 'undefined') return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // SECURITY: Use safe execution instead of new Function()
        executeCanvasCode(ctx, canvas, code);
    }, [code, width, height, mounted]);

    // SECURITY: Don't render anything during SSR
    if (!mounted) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%'
                }}
            >
                <div
                    style={{
                        width: `${width}px`,
                        height: `${height}px`,
                        border: '1px solid #ccc',
                        background: '#f0f0f0'
                    }}
                />
            </div>
        );
    }

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%'
            }}
        >
            <canvas
                ref={canvasRef}
                style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    border: '1px solid #ccc'
                }}
            />
        </div>
    );
};

export default CanvasWithJs;
