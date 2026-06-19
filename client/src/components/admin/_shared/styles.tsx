'use client';
import styled from 'styled-components';

// Shared styled-components used by multiple admin tabs. Originally inlined
// at the top of /admin/page.tsx; extracted here so each tab can `import`
// what it actually uses and the parent page doesn't carry styles for tabs
// it does not render.

export const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${(p) => p.theme.container.spacing.small};
  margin-bottom: ${(p) => p.theme.container.spacing.medium};
`;

export const StatCard = styled.div`
  text-align: center;
  padding: ${(p) => p.theme.container.spacing.medium};
  border: 1px solid ${(p) => p.theme.container.border.colour.primary()};
  border-radius: ${(p) => p.theme.container.border.radius};
  background: ${(p) => p.theme.container.background.colour.card()};
`;

export const StatNumber = styled.div`
  font-size: ${(p) => p.theme.text.size.xlarge};
  font-weight: ${(p) => p.theme.text.weight.bold};
  color: ${(p) => p.theme.text.colour.header()};
`;

export const StatLabel = styled.div`
  font-size: ${(p) => p.theme.text.size.small};
  color: ${(p) => p.theme.text.colour.light_grey()};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const AdminBadge = styled.span<{ $color: string }>`
  display: inline-block;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 0.7rem;
  font-weight: 600;
  background: ${(p) => p.$color}20;
  color: ${(p) => p.$color};
  margin-left: 4px;
`;

export const BarChart = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin: ${(p) => p.theme.container.spacing.small} 0;
`;

export const BarRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.container.spacing.small};
  font-size: 0.75rem;
  font-family: ${(p) => p.theme.text.font.roboto};
`;

export const BarLabel = styled.span`
  width: 60px;
  text-align: right;
  color: ${(p) => p.theme.text.colour.light_grey()};
  flex-shrink: 0;
`;

export const Bar = styled.div<{ $width: number }>`
  height: 14px;
  width: ${(p) => Math.max(2, p.$width)}%;
  background: ${(p) => p.theme.text.colour.header()};
  border-radius: 1px;
  opacity: 0.7;
  transition: width 0.3s ease;
`;

export const BarValue = styled.span`
  color: ${(p) => p.theme.text.colour.primary()};
  font-size: 0.7rem;
  min-width: 20px;
`;

export const RankList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const RankRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.container.spacing.small};
  padding: 4px 0;
  font-size: ${(p) => p.theme.text.size.small};
  border-bottom: 1px solid ${(p) => p.theme.container.border.colour.primary()};
  &:last-child {
    border-bottom: none;
  }
`;

export const RankNumber = styled.span`
  font-weight: ${(p) => p.theme.text.weight.bold};
  color: ${(p) => p.theme.text.colour.header()};
  width: 20px;
`;
