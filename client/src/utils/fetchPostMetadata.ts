import get_post_metadata from '@utils/markdown/get_post_metadata';

type Section = 'blog' | 'courses' | 'references';

const fetchPostMetadata = (section: Section): PostMetadata[] => {
    let posts: PostMetadata[] = get_post_metadata(section);
    posts = posts.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return posts.filter((post) => post.published);
};

export default fetchPostMetadata;
