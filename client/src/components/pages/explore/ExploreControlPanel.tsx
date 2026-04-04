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
  background: rgba(10, 10, 20, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #ddd;
  font-size: 13px;
  backdrop-filter: blur(12px);
  overflow: hidden;
  transition: max-height 0.3s ease;
  max-height: ${(p) => (p.$collapsed ? '42px' : '700px')};
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
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

const Body = styled.div`
  padding: 10px 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
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

  input {
    accent-color: #4488ff;
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
  }

  input[type='range'] {
    width: 100%;
    accent-color: #4488ff;
  }
`;

// ── section config ───────────────────────────────────────────────────
const SECTIONS = [
  { key: 'blog', label: 'Blog', colour: '#2E8BC0' },
  { key: 'courses', label: 'Courses', colour: '#2D9E5F' },
  { key: 'references', label: 'References', colour: '#7E3B8F' },
  { key: 'dictionaries', label: 'Dictionaries', colour: '#4CAF50' }
];

const EDGE_TYPES = [
  { key: 'explicit-link', label: 'Explicit links' },
  { key: 'tag-similarity', label: 'Tag similarity' },
  { key: 'nlp-similarity', label: 'NLP similarity' }
];

// ── component ────────────────────────────────────────────────────────
interface ExploreControlPanelProps {
  options: GraphQueryOptions;
  onChange: (next: GraphQueryOptions) => void;
}

export default function ExploreControlPanel({
  options,
  onChange
}: ExploreControlPanelProps) {
  const [collapsed, setCollapsed] = useState(false);

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

  return (
    <Panel $collapsed={collapsed}>
      <Header onClick={() => setCollapsed(!collapsed)}>
        Controls
        {collapsed ? <FaChevronDown size={12} /> : <FaChevronUp size={12} />}
      </Header>

      <Body>
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
              onChange={() =>
                onChange({
                  ...options,
                  showDictInternal: !options.showDictInternal
                })
              }
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
              onChange={() =>
                onChange({
                  ...options,
                  showExternal: !options.showExternal
                })
              }
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
      </Body>
    </Panel>
  );
}
