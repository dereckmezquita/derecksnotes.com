import {
    Article,
    PostContainer
} from '@components/components/pages/posts-dictionaries';
import { AuthDemo, AuthProtectedDemo } from './demos/AuthDemo';
import { CommentsDemo } from './demos/comments/CommentsDemo';
import { ApiStatus } from './demos/ApiStatus';

function Page() {
    return (
        <PostArticle>
            <h1>Hello world!</h1>
            <ApiStatus />
            <AuthDemo />
            <AuthProtectedDemo />
            <CommentsDemo />
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
