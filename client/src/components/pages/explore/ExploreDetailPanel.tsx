'use client';
import styled from 'styled-components';
import type { GraphNode } from '@derecksnotes/shared';
import { FaTimes, FaArrowRight, FaThumbsUp, FaComment } from 'react-icons/fa';

// ── styled ───────────────────────────────────────────────────────────
const Overlay = styled.div<{ $open: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  z-index: 65;
  width: 340px;
  height: 100vh;
  background: rgba(255, 255, 255, 0.96);
  border-left: 1px solid rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(16px);
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.08);
  color: #333;
  transform: translateX(${(p) => (p.$open ? '0' : '100%')});
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 4px;
  font-size: 16px;

  &:hover {
    color: #333;
  }
`;

const Content = styled.div`
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #222;
  margin: 0;
  line-height: 1.3;
  padding-right: 32px;
`;

const Badge = styled.span<{ $colour: string }>`
  display: inline-block;
  background: ${(p) => p.$colour};
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 3px 8px;
  border-radius: 3px;
`;

const BadgeRow = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Tag = styled.span`
  background: rgba(0, 0, 0, 0.06);
  color: #666;
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 3px;
`;

const Snippet = styled.p`
  font-size: 13px;
  line-height: 1.5;
  color: #555;
  margin: 0;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  color: #888;
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const GoLink = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(200, 113, 55, 0.1);
  border: 1px solid rgba(200, 113, 55, 0.3);
  color: #c87137;
  padding: 10px 16px;
  border-radius: 6px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  transition: background 0.2s;

  &:hover {
    background: rgba(200, 113, 55, 0.2);
  }
`;

// ── section colours (matches graph) ──────────────────────────────────
const SECTION_COLOURS: Record<string, string> = {
  blog: '#2E8BC0',
  courses: '#2D9E5F',
  references: '#7E3B8F',
  'dictionary-biology': '#4CAF50',
  'dictionary-chemistry': '#3B87C5',
  'dictionary-mathematics': '#E85D75',
  comments: '#888888',
  external: '#FFA500'
};

function toTagArray(tags: string[] | string | undefined): string[] {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  if (typeof tags === 'string')
    return tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
  return [];
}

// ── component ────────────────────────────────────────────────────────
interface ExploreDetailPanelProps {
  node: GraphNode | null;
  onClose: () => void;
}

export default function ExploreDetailPanel({
  node,
  onClose
}: ExploreDetailPanelProps) {
  const sectionColour = SECTION_COLOURS[node?.section || ''] || '#888';
  const tags = toTagArray(node?.tags);

  return (
    <Overlay $open={node !== null}>
      <CloseBtn onClick={onClose} aria-label="Close detail panel">
        <FaTimes />
      </CloseBtn>

      {node && (
        <Content>
          <Title>{node.title}</Title>

          <BadgeRow>
            <Badge $colour={sectionColour}>{node.section}</Badge>
            {node.category && (
              <Badge $colour="rgba(0,0,0,0.12)">{node.category}</Badge>
            )}
            <Badge $colour="rgba(0,0,0,0.06)">{node.nodeType}</Badge>
          </BadgeRow>

          {tags.length > 0 && (
            <TagList>
              {tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </TagList>
          )}

          {node.snippet && <Snippet>{node.snippet}</Snippet>}

          <MetaRow>
            {node.date && <MetaItem>{node.date}</MetaItem>}
            {node.author && <MetaItem>{node.author}</MetaItem>}
          </MetaRow>

          {node.metadata && (
            <MetaRow>
              {node.metadata.likes != null && (
                <MetaItem>
                  <FaThumbsUp size={11} />
                  {node.metadata.likes}
                </MetaItem>
              )}
              {node.metadata.commentCount != null && (
                <MetaItem>
                  <FaComment size={11} />
                  {node.metadata.commentCount}
                </MetaItem>
              )}
              {node.metadata.domain && (
                <MetaItem>{node.metadata.domain}</MetaItem>
              )}
            </MetaRow>
          )}

          {node.path && (
            <GoLink href={node.path}>
              Go to page <FaArrowRight size={12} />
            </GoLink>
          )}
        </Content>
      )}
    </Overlay>
  );
}
