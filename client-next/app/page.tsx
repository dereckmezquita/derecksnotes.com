import { get_post_metadata } from '@utils/markdown';
import PostPreview from '@components/PostPreview';

export default function Home() {
    const postMeta = get_post_metadata('blog');
    const postPreviews = postMeta.map((post) => {
        return (
            <PostPreview key={post.slug} {...post} />
        )
    });

    return (
        <div>
            {postPreviews}
        </div>
    )
}
