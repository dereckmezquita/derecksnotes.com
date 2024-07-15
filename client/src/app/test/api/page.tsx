'use client';
import {
    Article,
    PostContainer
} from '@components/components/pages/posts-dictionaries';
import { AuthDemo } from './demos/AuthDemo';

function Page() {
    return (
        <PostArticle>
            <h1>Hello world!</h1>
            <AuthDemo />
        </PostArticle>
    );
}

export default Page;

const PostArticle: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
    <PostContainer>
        <Article sideBar={false} style={{ width: '90%' }}>
            {children}
        </Article>
    </PostContainer>
);
