import React from 'react';

import { APPLICATION_DESCRIPTION } from '@/lib/constants';
import { Metadata } from 'next';

import { getTreeSectionContent } from '@/utils/mdx/fetchTreeContent';
import { Index } from '@/components/pages/index/Index';

export const metadata: Metadata = {
  title: 'Dn | Courses',
  description: APPLICATION_DESCRIPTION
};

async function Page() {
  const posts = getTreeSectionContent('courses');

  return <Index posts={posts} />;
}

export default Page;
