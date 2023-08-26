import Link from 'next/link';
import path from 'path';

const PostPreview = (props: PostMetadata) => {
    return (
        <div key={props.slug}>
            <Link href={path.join("/", props.section, props.slug)} passHref>
                {props.title}
            </Link>
            <p>{props.subtitle}</p>
            <p>{props.date}</p>
        </div>
    )
}

export default PostPreview;