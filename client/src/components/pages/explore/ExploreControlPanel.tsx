/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
'use client';
import { useState } from 'react';
import styled from 'styled-components';
import type { GraphQueryOptions } from '@derecksnotes/shared';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

// ── styled ───────────────────────────────────────────────────────────
const Panel = styled.div<{ $collapsed: boolean }>`
  position: fixed;
  top: 200px;
  left: 12px;
  z-index: 65;
  width: 240px;
  background: rgba(255, 255, 255, ${(p) => (p.$collapsed ? '0.75' : '0.92')});
  backdrop-filter: blur(8px);
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  color: #333;
  font-size: 13px;
  overflow: hidden;
  transition: max-height 0.3s ease;
  max-height: ${(p) => (p.$collapsed ? '42px' : '900px')};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  cursor: pointer;
  user-select: none;
  font-weight: 600;
  font-size: 14px;
  color: #333;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
`;

const Body = styled.div`
  padding: 10px 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 70vh;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.15);
    border-radius: 2px;
  }
`;

const SectionTitle = styled.div`
  font-weight: 600;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #888;
  margin-bottom: 2px;
`;

const CheckRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 12px;
  color: #444;

  input {
    accent-color: #c87137;
  }
`;

const Dot = styled.span<{ $colour: string }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(p) => p.$colour};
`;

const SliderRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  label {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #555;
  }

  input[type='range'] {
    width: 100%;
    accent-color: #c87137;
  }
`;

// ── section config ───────────────────────────────────────────────────
const SECTIONS = [
  { key: 'blog', label: 'Blog', colour: '#2E8BC0' },
  { key: 'courses', label: 'Courses', colour: '#2D9E5F' },
  { key: 'references', label: 'References', colour: '#7E3B8F' }
];

const DICT_SECTIONS = [
  { key: 'dictionary-biology', label: 'Biology', colour: '#4CAF50' },
  { key: 'dictionary-chemistry', label: 'Chemistry', colour: '#3B87C5' },
  { key: 'dictionary-mathematics', label: 'Mathematics', colour: '#E85D75' }
];

const EDGE_TYPES = [
  { key: 'explicit-link', label: 'Explicit links' },
  { key: 'tag-similarity', label: 'Tag similarity' },
  { key: 'nlp-similarity', label: 'NLP similarity' }
];

// ── physics slider config ────────────────────────────────────────────
const PHYSICS_SLIDERS = [
  {
    key: 'repulsionStrength',
    label: 'Repulsion',
    min: 0,
    max: 5,
    step: 0.1,
    default: 1.0
  },
  {
    key: 'bondStrength',
    label: 'Bond strength',
    min: 0,
    max: 0.5,
    step: 0.01,
    default: 0.08
  },
  {
    key: 'damping',
    label: 'Damping',
    min: 0.5,
    max: 1.0,
    step: 0.01,
    default: 0.92
  },
  {
    key: 'wind',
    label: 'Wind',
    min: 0,
    max: 0.1,
    step: 0.005,
    default: 0.015
  },
  {
    key: 'gravity',
    label: 'Gravity',
    min: 0,
    max: 0.5,
    step: 0.01,
    default: 0
  },
  {
    key: 'gridStrength',
    label: 'Grid distortion',
    min: 0,
    max: 5000,
    step: 100,
    default: 3000
  }
];

// ── component ────────────────────────────────────────────────────────
type SearchMode = 'highlight' | 'filter';

interface ExploreControlPanelProps {
  options: GraphQueryOptions;
  onChange: (next: GraphQueryOptions) => void;
  onPhysicsChange?: (param: string, value: number) => void;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  searchMode?: SearchMode;
  onSearchModeChange?: (mode: SearchMode) => void;
  useSpatialHash?: boolean;
  onSpatialHashToggle?: (useHash: boolean) => void;
  nodeCount?: number;
  edgeCount?: number;
  showGrid?: boolean;
  onShowGridToggle?: (show: boolean) => void;
}

export default function ExploreControlPanel({
  options,
  onChange,
  onPhysicsChange,
  searchTerm = '',
  onSearchChange,
  searchMode = 'highlight',
  onSearchModeChange,
  useSpatialHash = false,
  onSpatialHashToggle,
  showGrid = true,
  onShowGridToggle,
  nodeCount = 0,
  edgeCount = 0
}: ExploreControlPanelProps) {
  const [collapsed, setCollapsed] = useState(true);
  const [physicsValues, setPhysicsValues] = useState<Record<string, number>>(
    () => {
      const init: Record<string, number> = {};
      for (const s of PHYSICS_SLIDERS) init[s.key] = s.default;
      return init;
    }
  );

  const sections = options.sections || [
    'blog',
    'courses',
    'references',
    'dictionaries'
  ];
  const edgeTypes = options.edgeTypes || [
    'explicit-link',
    'tag-similarity',
    'nlp-similarity'
  ];

  function toggleSection(key: string) {
    const next = sections.includes(key)
      ? sections.filter((s) => s !== key)
      : [...sections, key];
    onChange({ ...options, sections: next });
  }

  function toggleEdgeType(key: string) {
    const next = edgeTypes.includes(key)
      ? edgeTypes.filter((e) => e !== key)
      : [...edgeTypes, key];
    onChange({ ...options, edgeTypes: next });
  }

  function handlePhysicsSlider(key: string, value: number) {
    setPhysicsValues((prev) => ({ ...prev, [key]: value }));
    onPhysicsChange?.(key, value);
  }

  return (
    <Panel $collapsed={collapsed}>
      <Header onClick={() => setCollapsed(!collapsed)}>
        <span>Controls</span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 400,
            color: '#888',
            marginLeft: 8
          }}
        >
          {nodeCount} nodes · {edgeCount} edges
        </span>
        {collapsed ? <FaChevronDown size={12} /> : <FaChevronUp size={12} />}
      </Header>

      <Body>
        {/* search */}
        {onSearchChange && (
          <div style={{ marginBottom: 8 }}>
            <input
              type="text"
              placeholder="Search nodes..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 10px',
                border: '1px solid rgba(0,0,0,0.15)',
                borderRadius: 4,
                fontSize: 12,
                background: 'rgba(255,255,255,0.8)',
                color: '#333',
                outline: 'none'
              }}
            />
            <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
              <button
                onClick={() => onSearchModeChange?.('highlight')}
                style={{
                  flex: 1,
                  padding: '4px 8px',
                  fontSize: 11,
                  border: '1px solid rgba(0,0,0,0.15)',
                  borderRadius: 3,
                  background:
                    searchMode === 'highlight'
                      ? '#c87137'
                      : 'rgba(255,255,255,0.6)',
                  color: searchMode === 'highlight' ? '#fff' : '#333',
                  cursor: 'pointer'
                }}
              >
                Highlight
              </button>
              <button
                onClick={() => onSearchModeChange?.('filter')}
                style={{
                  flex: 1,
                  padding: '4px 8px',
                  fontSize: 11,
                  border: '1px solid rgba(0,0,0,0.15)',
                  borderRadius: 3,
                  background:
                    searchMode === 'filter'
                      ? '#c87137'
                      : 'rgba(255,255,255,0.6)',
                  color: searchMode === 'filter' ? '#fff' : '#333',
                  cursor: 'pointer'
                }}
              >
                Filter
              </button>
            </div>
          </div>
        )}

        {/* sections */}
        <div>
          <SectionTitle>Sections</SectionTitle>
          {SECTIONS.map((s) => (
            <CheckRow key={s.key}>
              <input
                type="checkbox"
                checked={sections.includes(s.key)}
                onChange={() => toggleSection(s.key)}
              />
              <Dot $colour={s.colour} />
              {s.label}
            </CheckRow>
          ))}

          {/* Dictionary group with sub-sections */}
          <CheckRow>
            <input
              type="checkbox"
              checked={DICT_SECTIONS.some((d) => sections.includes(d.key))}
              onChange={() => {
                const allDictKeys = DICT_SECTIONS.map((d) => d.key);
                const anyOn = allDictKeys.some((k) => sections.includes(k));
                const filtered = sections.filter(
                  (s) => !allDictKeys.includes(s)
                );
                onChange({
                  ...options,
                  sections: anyOn ? filtered : [...filtered, ...allDictKeys],
                  showDictInternal: !anyOn
                });
              }}
            />
            <Dot $colour="#4CAF50" />
            Dictionaries
          </CheckRow>
          <div style={{ paddingLeft: 20 }}>
            {DICT_SECTIONS.map((d) => (
              <CheckRow key={d.key} style={{ fontSize: 11 }}>
                <input
                  type="checkbox"
                  checked={sections.includes(d.key)}
                  onChange={() => {
                    const isOn = sections.includes(d.key);
                    const nextSections = isOn
                      ? sections.filter((s) => s !== d.key)
                      : [...sections, d.key];
                    const anyDictOn = DICT_SECTIONS.some((dd) =>
                      nextSections.includes(dd.key)
                    );
                    onChange({
                      ...options,
                      sections: nextSections,
                      showDictInternal: anyDictOn
                    });
                  }}
                />
                <Dot $colour={d.colour} />
                {d.label}
              </CheckRow>
            ))}
          </div>
        </div>

        {/* depth */}
        <SliderRow>
          <label>
            <span>Depth</span>
            <span>{options.depth ?? 1}</span>
          </label>
          <input
            type="range"
            min={0}
            max={2}
            step={1}
            value={options.depth ?? 1}
            onChange={(e) =>
              onChange({
                ...options,
                depth: Number((e.target as HTMLInputElement).value)
              })
            }
          />
        </SliderRow>

        {/* edge types */}
        <div>
          <SectionTitle>Edge Types</SectionTitle>
          {EDGE_TYPES.map((et) => (
            <CheckRow key={et.key}>
              <input
                type="checkbox"
                checked={edgeTypes.includes(et.key)}
                onChange={() => toggleEdgeType(et.key)}
              />
              {et.label}
            </CheckRow>
          ))}
        </div>

        {/* toggles */}
        <div>
          <SectionTitle>Extras</SectionTitle>
          <CheckRow>
            <input
              type="checkbox"
              checked={options.showDictInternal ?? false}
              onChange={() => {
                const next = !options.showDictInternal;
                const nextEdgeTypes = next
                  ? [
                      ...edgeTypes.filter((e) => e !== 'dictionary-internal'),
                      'dictionary-internal'
                    ]
                  : edgeTypes.filter((e) => e !== 'dictionary-internal');
                onChange({
                  ...options,
                  showDictInternal: next,
                  edgeTypes: nextEdgeTypes
                });
              }}
            />
            Dictionary internals
          </CheckRow>
          <CheckRow>
            <input
              type="checkbox"
              checked={options.showComments ?? false}
              onChange={() =>
                onChange({
                  ...options,
                  showComments: !options.showComments
                })
              }
            />
            Comments
          </CheckRow>
          <CheckRow>
            <input
              type="checkbox"
              checked={options.showExternal ?? false}
              onChange={() => {
                const next = !options.showExternal;
                const nextEdgeTypes = next
                  ? [
                      ...edgeTypes.filter((e) => e !== 'external-link'),
                      'external-link'
                    ]
                  : edgeTypes.filter((e) => e !== 'external-link');
                onChange({
                  ...options,
                  showExternal: next,
                  edgeTypes: nextEdgeTypes
                });
              }}
            />
            External links
          </CheckRow>
        </div>

        {/* min connections */}
        <SliderRow>
          <label>
            <span>Min connections</span>
            <span>{options.minEdges ?? 0}</span>
          </label>
          <input
            type="range"
            min={0}
            max={10}
            step={1}
            value={options.minEdges ?? 0}
            onChange={(e) =>
              onChange({
                ...options,
                minEdges: Number((e.target as HTMLInputElement).value)
              })
            }
          />
        </SliderRow>

        {/* physics */}
        <div>
          <SectionTitle>Physics</SectionTitle>
          {PHYSICS_SLIDERS.map((s) => (
            <SliderRow key={s.key}>
              <label>
                <span>{s.label}</span>
                <span>
                  {s.step < 0.01
                    ? physicsValues[s.key].toFixed(3)
                    : s.step < 1
                      ? physicsValues[s.key].toFixed(2)
                      : physicsValues[s.key]}
                </span>
              </label>
              <input
                type="range"
                min={s.min}
                max={s.max}
                step={s.step}
                value={physicsValues[s.key]}
                onChange={(e) =>
                  handlePhysicsSlider(s.key, Number(e.target.value))
                }
              />
            </SliderRow>
          ))}
        </div>

        {/* Visualization toggles */}
        <div>
          <SectionTitle>Visualization</SectionTitle>
          <CheckRow>
            <input
              type="checkbox"
              checked={showGrid}
              onChange={() => onShowGridToggle?.(!showGrid)}
            />
            Show Grid
          </CheckRow>
          <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
            <button
              onClick={() => onSpatialHashToggle?.(false)}
              style={{
                flex: 1,
                padding: '4px 8px',
                fontSize: 11,
                border: '1px solid rgba(0,0,0,0.15)',
                borderRadius: 3,
                background: !useSpatialHash
                  ? '#c87137'
                  : 'rgba(255,255,255,0.6)',
                color: !useSpatialHash ? '#fff' : '#333',
                cursor: 'pointer'
              }}
            >
              QuadTree
            </button>
            <button
              onClick={() => onSpatialHashToggle?.(true)}
              style={{
                flex: 1,
                padding: '4px 8px',
                fontSize: 11,
                border: '1px solid rgba(0,0,0,0.15)',
                borderRadius: 3,
                background: useSpatialHash
                  ? '#c87137'
                  : 'rgba(255,255,255,0.6)',
                color: useSpatialHash ? '#fff' : '#333',
                cursor: 'pointer'
              }}
            >
              Hash Grid
            </button>
          </div>
        </div>
      </Body>
    </Panel>
  );
}
