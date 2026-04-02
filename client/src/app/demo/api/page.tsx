import { Article, PostContainer } from '@components/pages/posts-dictionaries';
import { AuthDemo, AuthProtectedDemo } from './demos/AuthDemo';
import { Comments } from '@components/comments/Comments';
import { ApiStatus } from './demos/ApiStatus';

function Page() {
    return (
        <PostArticle>
            <h1>Demo Page</h1>
            <ApiStatus />
            <AuthDemo />
            <AuthProtectedDemo />
            <Comments slug="demo/api" title="API Demo Page" />
        </PostArticle>
    );
}

export default Page;

const PostArticle: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
    <PostContainer>
        <Article $sideBar={false} style={{ width: '90%' }}>
            {children}
        </Article>
    </PostContainer>
);
