import React from 'react';
import path from 'path';
import {
    APPLICATION_DEFAULT_METADATA,
    ROOT_DIR_APP
} from '@components/lib/constants';
import { Dictionary } from '@components/components/pages/dictionaries/Dictionary';
import { fetchAllDefintions } from '@components/utils/dictionaries/fetchDefinitionMetadata';

const dictionary: string = 'chemistry';
const absDir: string = path.join(
    ROOT_DIR_APP,
    'dictionaries',
    dictionary,
    'definitions'
);

APPLICATION_DEFAULT_METADATA.title = 'DN | Chemistry Dictionary';
APPLICATION_DEFAULT_METADATA.description =
    'A comprehensive interactive chemistry dictionary.';

if (!APPLICATION_DEFAULT_METADATA.url) {
    throw new Error('NEXT_PUBLIC_APP_URL is not defined');
}

APPLICATION_DEFAULT_METADATA.url = new URL(
    path.join('dictionaries', dictionary),
    APPLICATION_DEFAULT_METADATA.url
).toString();

async function Page() {
    const definitions = await fetchAllDefintions(absDir);
    return (
        <Dictionary
            dictionaryType="Chemistry"
            definitions={definitions}
            pageMetadata={APPLICATION_DEFAULT_METADATA}
        />
    );
}

export default Page;
