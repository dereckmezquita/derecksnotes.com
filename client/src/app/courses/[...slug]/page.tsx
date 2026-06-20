import { createTreeContentPage } from '@/utils/mdx/createTreeContentPage';

const { Page, generateStaticParams, generateMetadata } =
  createTreeContentPage('courses');

export { generateStaticParams, generateMetadata };
export default Page;
