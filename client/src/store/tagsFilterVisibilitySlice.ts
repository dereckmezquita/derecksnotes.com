import { createSlice } from '@reduxjs/toolkit';

interface TagsFilterVisibilityState {
    tagsFilterVisible: boolean;
}

const initialState: TagsFilterVisibilityState = {
    tagsFilterVisible: false
};

export const tagsFilterVisibilitySlice = createSlice({
    name: 'tagsFilterVisibility',
    initialState,
    reducers: {
        toggleTagsFilter: (state) => {
            state.tagsFilterVisible = !state.tagsFilterVisible;
        }
    }
});

export const { toggleTagsFilter } = tagsFilterVisibilitySlice.actions;
export default tagsFilterVisibilitySlice.reducer;
