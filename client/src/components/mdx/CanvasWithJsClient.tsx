'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

type CanvasWithJsProps = {
    code: string;
    width?: number;
    height?: number;
};

/**
 * SECURITY-HARDENED Canvas Component
 * 
 * This component uses a safe DSL (Domain Specific Language) interpreter instead of
 * JavaScript eval/Function() to prevent Remote Code Execution (RCE) attacks.
 * 
 * ALLOWED OPERATIONS:
 * - All CanvasRenderingContext2D drawing methods
 * - Setting canvas properties (fillStyle, strokeStyle, lineWidth, etc.)
 * - Math operations for coordinates
 * - Loops (for statements) for repetitive drawing
 * 
 * BLOCKED:
 * - require(), import, eval, Function
 * - process, child_process, fs, etc.
 * - Any Node.js or browser APIs beyond canvas
 * - Network requests
 * - DOM manipulation
 */

// Whitelist of allowed canvas context properties (settable)
const ALLOWED_PROPERTIES = new Set([
    'fillStyle',
    'strokeStyle',
    'lineWidth',
    'lineCap',
    'lineJoin',
    'miterLimit',
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
    'lineDashOffset',
    'imageSmoothingEnabled',
    'imageSmoothingQuality'
]);

// Whitelist of allowed canvas context methods
const ALLOWED_METHODS = new Set([
    // Rectangle methods
    'fillRect',
    'strokeRect',
    'clearRect',
    // Path methods
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
    'roundRect',
    // Drawing paths
    'fill',
    'stroke',
    'clip',
    // Text methods
    'fillText',
    'strokeText',
    'measureText',
    // Transformations
    'rotate',
    'scale',
    'translate',
    'transform',
    'setTransform',
    'resetTransform',
    'getTransform',
    // State
    'save',
    'restore',
    // Line dash
    'setLineDash',
    'getLineDash',
    // Gradients & patterns
    'createLinearGradient',
    'createRadialGradient',
    'createConicGradient',
    'createPattern',
    // Image data (read-only, safe)
    'getImageData',
    'putImageData',
    'createImageData'
]);

// Safe math functions that can be used in expressions
const SAFE_MATH: Record<string, (...args: number[]) => number> = {
    'Math.PI': () => Math.PI,
    'Math.E': () => Math.E,
    'Math.sin': Math.sin,
    'Math.cos': Math.cos,
    'Math.tan': Math.tan,
    'Math.asin': Math.asin,
    'Math.acos': Math.acos,
    'Math.atan': Math.atan,
    'Math.atan2': Math.atan2,
    'Math.sqrt': Math.sqrt,
    'Math.pow': Math.pow,
    'Math.abs': Math.abs,
    'Math.floor': Math.floor,
    'Math.ceil': Math.ceil,
    'Math.round': Math.round,
    'Math.min': Math.min,
    'Math.max': Math.max,
    'Math.random': Math.random
};

// Dangerous patterns that should NEVER appear in code
const DANGEROUS_PATTERNS = [
    /require\s*\(/i,
    /import\s*\(/i,
    /import\s+/i,
    /eval\s*\(/i,
    /Function\s*\(/i,
    /new\s+Function/i,
    /\bprocess\b/i,
    /\bglobal\b/i,
    /\bglobalThis\b/i,
    /child_process/i,
    /\bfs\b\./i,
    /\bexec\b/i,
    /\bspawn\b/i,
    /\bfetch\b/i,
    /XMLHttpRequest/i,
    /WebSocket/i,
    /\bwindow\b(?!\.requestAnimationFrame)/i,
    /\bdocument\b/i,
    /\blocation\b/i,
    /\bnavigator\b/i,
    /localStorage/i,
    /sessionStorage/i,
    /indexedDB/i,
    /\bcookie\b/i,
    /innerHTML/i,
    /outerHTML/i,
    /insertAdjacentHTML/i,
    /\bprototype\b/i,
    /__proto__/i,
    /\bconstructor\b/i,
    /\.call\s*\(/i,
    /\.apply\s*\(/i,
    /\.bind\s*\(/i,
    /Reflect\./i,
    /Proxy/i,
    /Object\.defineProperty/i,
    /Object\.setPrototypeOf/i,
    /\bwith\s*\(/i,
    /debugger/i,
    /\basync\b/i,
    /\bawait\b/i,
    /\byield\b/i,
    /setTimeout/i,
    /setInterval/i,
    /setImmediate/i,
    /queueMicrotask/i,
    /requestIdleCallback/i
];

/**
 * Validates that the code doesn't contain dangerous patterns
 */
function validateCode(code: string): { valid: boolean; error?: string } {
    for (const pattern of DANGEROUS_PATTERNS) {
        if (pattern.test(code)) {
            return {
                valid: false,
                error: `Dangerous pattern detected: ${pattern.source}`
            };
        }
    }
    return { valid: true };
}

/**
 * Safe expression evaluator for numeric values
 * Only allows numbers, basic math operations, and whitelisted Math functions
 */
function safeEvaluateExpression(
    expr: string,
    variables: Record<string, number>
): number {
    // Remove whitespace
    expr = expr.trim();

    // Check for simple number
    if (/^-?\d+(\.\d+)?$/.test(expr)) {
        return parseFloat(expr);
    }

    // Check for variable reference
    if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(expr)) {
        if (expr in variables) {
            return variables[expr];
        }
        throw new Error(`Unknown variable: ${expr}`);
    }

    // Check for Math constants
    if (expr === 'Math.PI') return Math.PI;
    if (expr === 'Math.E') return Math.E;

    // Handle Math function calls like Math.sin(x)
    const mathFuncMatch = expr.match(/^(Math\.\w+)\((.+)\)$/);
    if (mathFuncMatch) {
        const funcName = mathFuncMatch[1];
        const argsStr = mathFuncMatch[2];
        
        if (!(funcName in SAFE_MATH)) {
            throw new Error(`Unknown Math function: ${funcName}`);
        }
        
        // Parse arguments (split by comma, but handle nested parentheses)
        const args: number[] = [];
        let depth = 0;
        let currentArg = '';
        
        for (const char of argsStr) {
            if (char === '(') depth++;
            else if (char === ')') depth--;
            else if (char === ',' && depth === 0) {
                args.push(safeEvaluateExpression(currentArg, variables));
                currentArg = '';
                continue;
            }
            currentArg += char;
        }
        if (currentArg.trim()) {
            args.push(safeEvaluateExpression(currentArg, variables));
        }

        const func = SAFE_MATH[funcName];
        return func(...args);
    }

    // Handle basic arithmetic with proper precedence
    // This is a simple recursive descent parser
    return parseAddSubtract(expr, variables);
}

function parseAddSubtract(expr: string, vars: Record<string, number>): number {
    expr = expr.trim();
    
    // Find the last + or - at depth 0 (respecting parentheses)
    let depth = 0;
    for (let i = expr.length - 1; i >= 0; i--) {
        const char = expr[i];
        if (char === ')') depth++;
        else if (char === '(') depth--;
        else if (depth === 0 && (char === '+' || char === '-') && i > 0) {
            // Make sure it's not a unary minus
            const prevChar = expr[i - 1]?.trim();
            if (prevChar && !/[+\-*/(<,]/.test(prevChar)) {
                const left = parseAddSubtract(expr.slice(0, i), vars);
                const right = parseMultiplyDivide(expr.slice(i + 1), vars);
                return char === '+' ? left + right : left - right;
            }
        }
    }
    
    return parseMultiplyDivide(expr, vars);
}

function parseMultiplyDivide(expr: string, vars: Record<string, number>): number {
    expr = expr.trim();
    
    let depth = 0;
    for (let i = expr.length - 1; i >= 0; i--) {
        const char = expr[i];
        if (char === ')') depth++;
        else if (char === '(') depth--;
        else if (depth === 0 && (char === '*' || char === '/' || char === '%')) {
            const left = parseMultiplyDivide(expr.slice(0, i), vars);
            const right = parsePrimary(expr.slice(i + 1), vars);
            if (char === '*') return left * right;
            if (char === '/') return left / right;
            if (char === '%') return left % right;
        }
    }
    
    return parsePrimary(expr, vars);
}

function parsePrimary(expr: string, vars: Record<string, number>): number {
    expr = expr.trim();
    
    // Handle parentheses
    if (expr.startsWith('(') && expr.endsWith(')')) {
        return safeEvaluateExpression(expr.slice(1, -1), vars);
    }
    
    // Handle unary minus
    if (expr.startsWith('-')) {
        return -parsePrimary(expr.slice(1), vars);
    }
    
    // Handle unary plus
    if (expr.startsWith('+')) {
        return parsePrimary(expr.slice(1), vars);
    }
    
    // Simple number
    if (/^-?\d+(\.\d+)?$/.test(expr)) {
        return parseFloat(expr);
    }
    
    // Variable
    if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(expr)) {
        if (expr in vars) {
            return vars[expr];
        }
        throw new Error(`Unknown variable: ${expr}`);
    }
    
    // Math constant or function
    if (expr === 'Math.PI') return Math.PI;
    if (expr === 'Math.E') return Math.E;
    
    // Math function call
    const mathFuncMatch = expr.match(/^(Math\.\w+)\((.+)\)$/);
    if (mathFuncMatch) {
        return safeEvaluateExpression(expr, vars);
    }
    
    throw new Error(`Cannot parse expression: ${expr}`);
}

/**
 * Parse and execute canvas code safely
 * This is a simple interpreter that only allows canvas operations
 */
function executeCanvasCode(
    code: string,
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
): void {
    const variables: Record<string, number> = {
        width: canvas.width,
        height: canvas.height,
        centerX: canvas.width / 2,
        centerY: canvas.height / 2
    };

    // Split code into statements (semicolon or newline separated)
    const statements = code
        .split(/[;\n]/)
        .map(s => s.trim())
        .filter(s => s && !s.startsWith('//'));

    for (let i = 0; i < statements.length; i++) {
        const stmt = statements[i];
        
        try {
            executeStatement(stmt, ctx, canvas, variables, statements, i);
        } catch (error) {
            console.warn(`Canvas code error at statement ${i + 1}:`, error);
            // Continue with other statements
        }
    }
}

function executeStatement(
    stmt: string,
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    variables: Record<string, number>,
    allStatements: string[],
    currentIndex: number
): void {
    stmt = stmt.trim();
    if (!stmt || stmt.startsWith('//')) return;

    // Handle variable declaration: let x = 5 or const x = 10
    const varDeclMatch = stmt.match(/^(?:let|const|var)\s+([a-zA-Z_]\w*)\s*=\s*(.+)$/);
    if (varDeclMatch) {
        const [, varName, valueExpr] = varDeclMatch;
        variables[varName] = safeEvaluateExpression(valueExpr, variables);
        return;
    }

    // Handle variable assignment: x = 5
    const varAssignMatch = stmt.match(/^([a-zA-Z_]\w*)\s*=\s*(.+)$/);
    if (varAssignMatch && !stmt.includes('ctx.')) {
        const [, varName, valueExpr] = varAssignMatch;
        variables[varName] = safeEvaluateExpression(valueExpr, variables);
        return;
    }

    // Handle increment/decrement: i++ or i--
    const incrDecrMatch = stmt.match(/^([a-zA-Z_]\w*)\s*(\+\+|--)$/);
    if (incrDecrMatch) {
        const [, varName, op] = incrDecrMatch;
        if (varName in variables) {
            variables[varName] += op === '++' ? 1 : -1;
        }
        return;
    }

    // Handle compound assignment: i += 1
    const compoundMatch = stmt.match(/^([a-zA-Z_]\w*)\s*(\+=|-=|\*=|\/=)\s*(.+)$/);
    if (compoundMatch) {
        const [, varName, op, valueExpr] = compoundMatch;
        if (varName in variables) {
            const value = safeEvaluateExpression(valueExpr, variables);
            switch (op) {
                case '+=': variables[varName] += value; break;
                case '-=': variables[varName] -= value; break;
                case '*=': variables[varName] *= value; break;
                case '/=': variables[varName] /= value; break;
            }
        }
        return;
    }

    // Handle for loop: for (let i = 0; i < 10; i++)
    const forMatch = stmt.match(/^for\s*\(\s*(?:let|const|var)?\s*([a-zA-Z_]\w*)\s*=\s*([^;]+);\s*([^;]+);\s*([^)]+)\s*\)\s*\{?\s*$/);
    if (forMatch) {
        const [, loopVar, initExpr, condExpr, updateExpr] = forMatch;
        
        // Find the matching closing brace and collect loop body
        let braceCount = 1;
        let loopBody: string[] = [];
        let j = currentIndex + 1;
        
        while (j < allStatements.length && braceCount > 0) {
            const s = allStatements[j].trim();
            if (s.includes('{')) braceCount += (s.match(/\{/g) || []).length;
            if (s.includes('}')) braceCount -= (s.match(/\}/g) || []).length;
            
            if (braceCount > 0) {
                loopBody.push(s.replace(/^\{|\}$/g, '').trim());
            }
            j++;
        }

        // Initialize loop variable
        variables[loopVar] = safeEvaluateExpression(initExpr, variables);
        
        // Execute loop (with safety limit)
        const maxIterations = 10000;
        let iterations = 0;
        
        while (iterations < maxIterations) {
            // Check condition
            if (!evaluateCondition(condExpr, variables)) break;
            
            // Execute body
            for (const bodyStmt of loopBody) {
                if (bodyStmt && bodyStmt !== '{' && bodyStmt !== '}') {
                    executeStatement(bodyStmt, ctx, canvas, variables, [], 0);
                }
            }
            
            // Execute update
            if (updateExpr.includes('++')) {
                variables[loopVar]++;
            } else if (updateExpr.includes('--')) {
                variables[loopVar]--;
            } else if (updateExpr.includes('+=')) {
                const match = updateExpr.match(/([a-zA-Z_]\w*)\s*\+=\s*(.+)/);
                if (match) {
                    variables[match[1]] += safeEvaluateExpression(match[2], variables);
                }
            }
            
            iterations++;
        }
        return;
    }

    // Handle closing brace (no-op)
    if (stmt === '}' || stmt === '{') return;

    // Handle ctx.property = value
    const propAssignMatch = stmt.match(/^ctx\.([a-zA-Z]+)\s*=\s*(.+)$/);
    if (propAssignMatch) {
        const [, propName, valueExpr] = propAssignMatch;
        
        if (!ALLOWED_PROPERTIES.has(propName)) {
            throw new Error(`Property not allowed: ${propName}`);
        }

        // Handle string values (colors, fonts, etc.)
        if (valueExpr.startsWith("'") || valueExpr.startsWith('"')) {
            (ctx as any)[propName] = valueExpr.slice(1, -1);
        } else {
            // Numeric value
            (ctx as any)[propName] = safeEvaluateExpression(valueExpr, variables);
        }
        return;
    }

    // Handle ctx.method(args)
    const methodCallMatch = stmt.match(/^ctx\.([a-zA-Z]+)\(([^)]*)\)$/);
    if (methodCallMatch) {
        const [, methodName, argsStr] = methodCallMatch;
        
        if (!ALLOWED_METHODS.has(methodName)) {
            throw new Error(`Method not allowed: ${methodName}`);
        }

        // Parse arguments
        const args = argsStr
            .split(',')
            .map(arg => arg.trim())
            .filter(arg => arg)
            .map(arg => {
                // String argument
                if (arg.startsWith("'") || arg.startsWith('"')) {
                    return arg.slice(1, -1);
                }
                // Numeric expression
                return safeEvaluateExpression(arg, variables);
            });

        // Call the method
        const method = (ctx as any)[methodName];
        if (typeof method === 'function') {
            method.apply(ctx, args);
        }
        return;
    }

    // Unknown statement - log warning but don't throw
    console.warn(`Skipping unknown statement: ${stmt}`);
}

function evaluateCondition(cond: string, vars: Record<string, number>): boolean {
    cond = cond.trim();
    
    // Handle comparisons: i < 10, x >= 5, etc.
    const compMatch = cond.match(/^(.+?)\s*(<=|>=|<|>|===|==|!==|!=)\s*(.+)$/);
    if (compMatch) {
        const [, leftExpr, op, rightExpr] = compMatch;
        const left = safeEvaluateExpression(leftExpr, vars);
        const right = safeEvaluateExpression(rightExpr, vars);
        
        switch (op) {
            case '<': return left < right;
            case '>': return left > right;
            case '<=': return left <= right;
            case '>=': return left >= right;
            case '==':
            case '===': return left === right;
            case '!=':
            case '!==': return left !== right;
        }
    }
    
    return false;
}

const CanvasWithJs: React.FC<CanvasWithJsProps> = ({
    code,
    width = 400,
    height = 300
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);

    // Only run on client
    useEffect(() => {
        setIsClient(true);
    }, []);

    const executeCode = useCallback(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear any previous errors
        setError(null);

        // Validate code first
        const validation = validateCode(code);
        if (!validation.valid) {
            setError(validation.error || 'Invalid code');
            return;
        }

        try {
            // Clear canvas first
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Execute the code safely
            executeCanvasCode(code, ctx, canvas);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Execution error');
            console.error('Canvas execution error:', err);
        }
    }, [code]);

    // Execute code when component mounts or code changes (client-side only)
    useEffect(() => {
        if (isClient) {
            executeCode();
        }
    }, [isClient, executeCode]);

    // Don't render anything on server
    if (!isClient) {
        return (
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
                        width: `${width}px`,
                        height: `${height}px`,
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
        );
    }

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                flexDirection: 'column',
                gap: '10px'
            }}
        >
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                style={{
                    border: error ? '2px solid #ff6b6b' : '1px solid #ddd',
                    background: '#ffffff'
                }}
            />
            {error && (
                <div
                    style={{
                        color: '#c92a2a',
                        fontSize: '14px',
                        padding: '10px',
                        background: '#fff5f5',
                        border: '1px solid #ff6b6b',
                        borderRadius: '4px',
                        maxWidth: `${width}px`
                    }}
                >
                    <strong>Canvas Error:</strong> {error}
                </div>
            )}
        </div>
    );
};

export default CanvasWithJs;
