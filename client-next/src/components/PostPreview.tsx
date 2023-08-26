import Link from 'next/link';

const PostPreview = (props: PostMetadata) => {
    return (
        <div key={props.slug}>
            <Link href={`/blog/${props.slug}`} passHref>
                {props.title}
            </Link>
            <p>{props.subtitle}</p>
            <p>{props.date}</p>
        </div>
    )
}

export default PostPreview;