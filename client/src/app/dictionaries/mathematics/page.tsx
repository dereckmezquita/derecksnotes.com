import React from 'react';
import path from 'path';
import { ROOT_DIR_APP } from '@lib/constants.server';
import { Dictionary } from '@components/pages/dictionaries/Dictionary';
import { fetchAllDefintions } from '@utils/dictionaries/fetchDefinitionMetadata';
import { Metadata } from 'next';

const dictionary: string = 'mathematics';
const absDir: string = path.join(
    ROOT_DIR_APP,
    'dictionaries',
    dictionary,
    'definitions'
);

export const metadata: Metadata = {
    title: 'Dn | Mathematics Dictionary',
    description: 'A comprehensive interactive mathematics dictionary.'
};

async function Page() {
    const definitions = await fetchAllDefintions(absDir);
    return (
        <Dictionary dictionaryType="Mathematics" definitions={definitions} />
    );
}

export default Page;
