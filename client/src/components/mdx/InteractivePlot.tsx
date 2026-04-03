'use client';

import React, { useMemo } from 'react';

type ControlBase = {
  id: string;
  label: string;
};

type RangeControl = ControlBase & {
  type: 'range';
  min: number;
  max: number;
  step?: number;
  default: number;
};

type CheckboxControl = ControlBase & {
  type: 'checkbox';
  default: boolean;
};

type SelectControl = ControlBase & {
  type: 'select';
  options: string[];
  default: string;
};

type Control = RangeControl | CheckboxControl | SelectControl;

type InteractivePlotProps = {
  controls: Control[];
  draw: string;
  width?: number;
  height?: number;
};

/**
 * InteractivePlot - Canvas with declarative interactive controls
 *
 * Renders sliders, checkboxes, and selects above a canvas element.
 * The draw function receives `canvas`, `ctx`, and a `params` object
 * containing current control values. It is called on mount and
 * whenever any control value changes.
 *
 * Everything runs inside a sandboxed iframe for security.
 */
const InteractivePlot: React.FC<InteractivePlotProps> = ({
  controls,
  draw,
  width = 600,
  height = 400
}) => {
  const controlsHeight = controls.length * 44 + 12;
  const totalHeight = height + controlsHeight;

  const iframeSrc = useMemo(() => {
    const escapedDraw = draw.replace(/<\/script>/gi, '<\\/script>');

    const controlsHtml = controls
      .map((ctrl) => {
        const base = `<div class="ctrl-row">
                <label for="${ctrl.id}">${ctrl.label}</label>`;

        if (ctrl.type === 'range') {
          return `${base}
                    <input type="range" id="${ctrl.id}"
                        min="${ctrl.min}" max="${ctrl.max}"
                        step="${ctrl.step ?? (ctrl.max - ctrl.min) / 100}"
                        value="${ctrl.default}" />
                    <span id="${ctrl.id}_val">${ctrl.default}</span>
                </div>`;
        }

        if (ctrl.type === 'checkbox') {
          return `${base}
                    <input type="checkbox" id="${ctrl.id}"
                        ${ctrl.default ? 'checked' : ''} />
                </div>`;
        }

        if (ctrl.type === 'select') {
          const opts = ctrl.options
            .map(
              (o) =>
                `<option value="${o}" ${o === ctrl.default ? 'selected' : ''}>${o}</option>`
            )
            .join('');
          return `${base}
                    <select id="${ctrl.id}">${opts}</select>
                </div>`;
        }

        return '';
      })
      .join('\n');

    // Build JS that reads control values into a params object
    const paramReaders = controls
      .map((ctrl) => {
        if (ctrl.type === 'range') {
          return `params.${ctrl.id} = parseFloat(document.getElementById('${ctrl.id}').value);`;
        }
        if (ctrl.type === 'checkbox') {
          return `params.${ctrl.id} = document.getElementById('${ctrl.id}').checked;`;
        }
        if (ctrl.type === 'select') {
          return `params.${ctrl.id} = document.getElementById('${ctrl.id}').value;`;
        }
        return '';
      })
      .join('\n            ');

    // Build JS that updates value displays for range inputs
    const valueUpdaters = controls
      .filter((ctrl) => ctrl.type === 'range')
      .map((ctrl) => {
        return `document.getElementById('${ctrl.id}_val').textContent =
                document.getElementById('${ctrl.id}').value;`;
      })
      .join('\n            ');

    return `<!DOCTYPE html>
<html>
<head>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { overflow: hidden; background: white; font-family: system-ui, -apple-system, sans-serif; }
        #controls {
            padding: 6px 12px;
            border-bottom: 1px solid #e0e0e0;
            background: #fafafa;
        }
        .ctrl-row {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 4px 0;
            font-size: 13px;
        }
        .ctrl-row label {
            min-width: 80px;
            font-weight: 500;
            color: #333;
        }
        .ctrl-row input[type="range"] {
            flex: 1;
            max-width: 300px;
        }
        .ctrl-row span {
            min-width: 50px;
            text-align: right;
            font-family: monospace;
            font-size: 12px;
            color: #666;
        }
        .ctrl-row select {
            padding: 2px 4px;
        }
        canvas { display: block; }
        .error { color: red; padding: 10px; font-size: 12px; font-family: monospace; }
    </style>
</head>
<body>
    <div id="controls">
        ${controlsHtml}
    </div>
    <canvas id="canvas" width="${width}" height="${height}"></canvas>
    <script>
        try {
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');
            const params = {};

            function readParams() {
                ${paramReaders}
            }

            function updateDisplays() {
                ${valueUpdaters}
            }

            function redraw() {
                readParams();
                updateDisplays();
                try {
                    ${escapedDraw}
                } catch (e) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = 'red';
                    ctx.font = '14px monospace';
                    ctx.fillText('Draw error: ' + e.message, 10, 30);
                }
            }

            // Wire up all controls to trigger redraw
            document.querySelectorAll('#controls input, #controls select').forEach(function(el) {
                el.addEventListener('input', redraw);
            });

            // Initial draw
            redraw();
        } catch (e) {
            document.body.innerHTML = '<div class="error">Error: ' + e.message + '</div>';
        }
    </script>
</body>
</html>`;
  }, [controls, draw, width, height]);

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
          height: `${totalHeight}px`,
          border: '1px solid #ccc',
          display: 'block'
        }}
        title="Interactive plot"
      />
    </div>
  );
};

export default InteractivePlot;
