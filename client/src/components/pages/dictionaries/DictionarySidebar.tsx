'use client';
import SelectDropDown from '@components/components/atomic/SelectDropDown';
import { SideBarContainer, SideBarSiteName } from '../posts-dictionaries';

function DictionarySidebar() {
    return (
        <SideBarContainer>
            <SideBarSiteName fontSize="20px">{`Dereck's Notes`}</SideBarSiteName>
            <SelectDropDown
                    options={[
                        { label: 'Search words', value: 'words' },
                        { label: 'Search tags', value: 'tags' }
                    ]}
                    value={searchMode}
                    onChange={(value) => {
                        setSearchMode(value as 'words' | 'tags');
                        setSearchTerm(''); // Clear the search term when switching modes
                    }}
                />
        </SideBarContainer>
    );
}

export default DictionarySidebar;
