import React from 'react';
import { Helmet } from 'react-helmet';

// TODO: use helmet and make this a function so dynamic set title and content summary
const Head: React.FC = () => {
    return (
        <Helmet>
            <title>Dereck's Notes</title>
            <meta
                name="description"
                content="The online brain of Dereck de Mezquita; making sciencing easier."
            />
            <meta
                name="keywords"
                content="Science, Programming, Bioinformatics, Biology, Technology, Education, Art, Dictionary, Blog"
            />
            {/* Add other meta tags and head elements here */}
        </Helmet>
    );
};

export default Head;
