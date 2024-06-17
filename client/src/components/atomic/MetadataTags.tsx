import React from 'react';
import Head from 'next/head';

interface Props {
    title: string;
    description: string;
    image: string;
    url: string;
}

const MetadataTags: React.FC<Props> = ({ title, description, image, url }) => {
    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={url} />
            <link rel="icon" href="/favicon.ico" type="image/x-icon" />

            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={url} />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
        </Head>
    );
};

export default MetadataTags;
