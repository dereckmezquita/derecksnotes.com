import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { APPLICATION_DESCRIPTION } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Dn | Knowledge Graph',
  description: `${APPLICATION_DESCRIPTION} Wander the knowledge graph of every note, post, and definition on the site.`
};

export const viewport: Viewport = {
  themeColor: '#c87137'
};

export default function ExploreLayout({ children }: { children: ReactNode }) {
  return children;
}
