import React from 'react';
import path from 'path';
import {
    APPLICATION_DEFAULT_METADATA,
    ROOT_DIR_APP
} from '@components/lib/constants';
import { Dictionary } from '@components/components/pages/dictionaries/Dictionary';
import { fetchAllDefintions } from '@components/utils/dictionaries/fetchDefinitionMetadata';

const dictionary: string = 'biology';
const absDir: string = path.join(
    ROOT_DIR_APP,
    'dictionaries',
    dictionary,
    'definitions'
);

APPLICATION_DEFAULT_METADATA.title = 'DN | Biology Dictionary';
APPLICATION_DEFAULT_METADATA.description =
    'A comprehensive interactive biology dictionary.';
APPLICATION_DEFAULT_METADATA.url = new URL(
    path.join('dictionaries', dictionary),
    APPLICATION_DEFAULT_METADATA.url
).toString();

async function Page() {
    const definitions = await fetchAllDefintions(absDir);
    return (
        <Dictionary
            definitions={definitions}
            pageMetadata={APPLICATION_DEFAULT_METADATA}
        />
    );
}

export default Page;
