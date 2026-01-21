import { createContentPage } from '@utils/mdx/createContentPage';

const { Page, generateStaticParams, generateMetadata } =
    createContentPage('blog');

export { generateStaticParams, generateMetadata };
export default Page;
