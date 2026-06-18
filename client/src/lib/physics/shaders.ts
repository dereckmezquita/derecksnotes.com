// Vertex shader for lines and particles
export const LINE_VERTEX = `
    attribute vec2 aPosition;
    attribute vec4 aColor;
    uniform vec2 uResolution;
    varying vec4 vColor;

    void main() {
        // Convert pixel coords to clip space (-1 to 1)
        vec2 clipSpace = (aPosition / uResolution) * 2.0 - 1.0;
        clipSpace.y = -clipSpace.y; // flip Y
        gl_Position = vec4(clipSpace, 0.0, 1.0);
        vColor = aColor;
    }
`;

export const LINE_FRAGMENT = `
    precision mediump float;
    varying vec4 vColor;

    void main() {
        gl_FragColor = vColor;
    }
`;

// Vertex shader for circles (point sprites)
export const CIRCLE_VERTEX = `
    attribute vec2 aPosition;
    attribute float aRadius;
    attribute vec4 aColor;
    uniform vec2 uResolution;
    varying vec4 vColor;
    varying float vRadius;

    void main() {
        vec2 clipSpace = (aPosition / uResolution) * 2.0 - 1.0;
        clipSpace.y = -clipSpace.y;
        gl_Position = vec4(clipSpace, 0.0, 1.0);
        gl_PointSize = aRadius * 2.0;
        vColor = aColor;
        vRadius = aRadius;
    }
`;

export const CIRCLE_FRAGMENT = `
    precision mediump float;
    varying vec4 vColor;
    varying float vRadius;

    void main() {
        vec2 center = gl_PointCoord - vec2(0.5);
        float dist = length(center) * 2.0;

        // Ring only — no fill, matching Canvas 2D strokeStyle circle
        float ring = smoothstep(0.78, 0.85, dist) * (1.0 - smoothstep(0.92, 1.0, dist));
        float finalAlpha = ring * vColor.a;

        if (finalAlpha < 0.01) discard;
        gl_FragColor = vec4(vColor.rgb, finalAlpha);
    }
`;

// Filled circle with soft anti-aliased edge — for graph nodes
export const FILLED_CIRCLE_FRAGMENT = `
    precision mediump float;
    varying vec4 vColor;
    varying float vRadius;

    void main() {
        vec2 center = gl_PointCoord - vec2(0.5);
        float dist = length(center) * 2.0;

        // Filled disc with smooth edge
        float alpha = (1.0 - smoothstep(0.9, 1.0, dist)) * vColor.a;

        if (alpha < 0.01) discard;
        gl_FragColor = vec4(vColor.rgb, alpha);
    }
`;
