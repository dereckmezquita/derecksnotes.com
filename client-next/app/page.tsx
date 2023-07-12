import get_post_metadata from '@helpers/get_post_metadata';
import PostPreview from '@components/PostPreview';

export default function Home() {
    const postMeta = get_post_metadata();
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
