import { createContentPage } from '@utils/mdx/createContentPage';

const { Page, generateStaticParams, generateMetadata } =
    createContentPage('courses');

export { generateStaticParams, generateMetadata };
export default Page;
