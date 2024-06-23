import React from 'react';
import path from 'path';
import {
    ROOT_DIR_APP
} from '@components/lib/constants';
import { Dictionary } from '@components/components/pages/dictionaries/Dictionary';
import { fetchAllDefintions } from '@components/utils/dictionaries/fetchDefinitionMetadata';
import { Metadata } from 'next';

const dictionary: string = 'chemistry';
const absDir: string = path.join(
    ROOT_DIR_APP,
    'dictionaries',
    dictionary,
    'definitions'
);

export const metadata: Metadata = {
    title: 'Dn | Chemistry Dictionary',
    description: 'A comprehensive interactive chemistry dictionary.'
};

async function Page() {
    const definitions = await fetchAllDefintions(absDir);
    return (
        <Dictionary
            dictionaryType="Chemistry"
            definitions={definitions}
        />
    );
}

export default Page;
