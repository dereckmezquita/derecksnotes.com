import React from 'react';
import { Helmet } from 'react-helmet';

interface HeadProps {
    title?: string;
}

const Head: React.FC<HeadProps> = ({ title }) => {
    const defaultTitle = "Dereck's Notes";

    return (
        <Helmet>
            <title>{title ? `${defaultTitle} | ${title}` : defaultTitle}</title>
            <meta
                name="description"
                content="The online brain of Dereck Mezquita; making sciencing easier."
            />
            <meta
                name="keywords"
                content="Science, Programming, Bioinformatics, Biology, Technology, Education, Art, Dictionary, Blog"
            />
            <meta name="author" content="Dereck Mezquita" />

            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Helmet>
    );
};

export default Head;
