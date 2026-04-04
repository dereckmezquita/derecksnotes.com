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
  background: rgba(10, 10, 20, 0.92);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(16px);
  color: #ddd;
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
  color: #888;
  cursor: pointer;
  padding: 4px;
  font-size: 16px;

  &:hover {
    color: #fff;
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
  color: #fff;
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
  background: rgba(255, 255, 255, 0.08);
  color: #aaa;
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 3px;
`;

const Snippet = styled.p`
  font-size: 13px;
  line-height: 1.5;
  color: #aaa;
  margin: 0;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  color: #777;
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
  background: rgba(46, 139, 192, 0.2);
  border: 1px solid rgba(46, 139, 192, 0.4);
  color: #4aa8e0;
  padding: 10px 16px;
  border-radius: 6px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  transition: background 0.2s;

  &:hover {
    background: rgba(46, 139, 192, 0.35);
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
              <Badge $colour="rgba(255,255,255,0.15)">{node.category}</Badge>
            )}
            <Badge $colour="rgba(255,255,255,0.08)">{node.nodeType}</Badge>
          </BadgeRow>

          {node.tags && node.tags.length > 0 && (
            <TagList>
              {node.tags.map((tag) => (
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
