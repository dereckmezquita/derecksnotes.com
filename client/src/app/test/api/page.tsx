import { Article, PostContainer } from '@components/pages/posts-dictionaries';
import { AuthDemo, AuthProtectedDemo } from './demos/AuthDemo';
import { Comments } from '@components/ui/CommentsSection/Comments';
import { ApiStatus } from './demos/ApiStatus';

function Page() {
    return (
        <PostArticle>
            <h1>Hello world!</h1>
            <ApiStatus />
            <AuthDemo />
            <AuthProtectedDemo />
            <Comments postSlug="test-post" />
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
