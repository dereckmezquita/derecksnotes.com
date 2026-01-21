import { createContentPage } from '@utils/mdx/createContentPage';

const { Page, generateStaticParams, generateMetadata } =
    createContentPage('references');

export { generateStaticParams, generateMetadata };
export default Page;
