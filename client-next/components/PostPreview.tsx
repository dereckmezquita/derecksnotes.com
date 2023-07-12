import Link from 'next/link';

const PostPreview = (props: PostMetadata) => {
    return (
        <div key={props.slug}>
            <Link href={`/blog/${props.slug}`}>
                <h2>{props.title}</h2>
            </Link>
            <p>{props.subtitle}</p>
            <p>{props.date}</p>
        </div>
    )
}

export default PostPreview;