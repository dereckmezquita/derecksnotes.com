I implemented it my own way without use of redux as so:

```tsx
import React, { useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { theme } from '@styles/theme';
import { SiteName } from '@components/ui/Logo';

import TagFilter from '@components/ui/TagFilter';

import { useSelector } from 'react-redux';
import { RootState } from '@store/store';

const PostContainer = styled.div`
    display: flex;
    justify-content: center;
    margin: 0 auto 50px;

    width: 80%;
    background-color: ${theme.container.background.colour.content()};

    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 1px 1px 20px rgba(153, 153, 153, 0.5), 0 0 20px rgba(100, 100, 40, 0.2) inset;

    @media (max-width: 1096px) {
        flex-direction: column;
        width: 95%;
    }
`;

const SideBarContainer = styled.div`
    width: 25%;
    text-align: center;
    padding-top: 20px;

    @media (max-width: 1096px) {
        display: none;
    }
`;
const SideBarSiteName = styled(SiteName) <{ fontSize: string }>`
    font-size: 20px;
    border-bottom: 1px dashed ${theme.container.border.colour.primary()};
`;

const SideBarEntriesContainer = styled.div`
    margin-top: 30px;
    text-align: left;
`;

const SideEntryLink = styled(Link)`
    display: block;
    font-size: 13px;
    text-decoration: none;
    color: ${theme.text.colour.light_grey()};

    &:hover {
        color: ${theme.text.colour.anchor()};
        text-decoration: underline;
    }
`;

const SideBarAboutContainer = styled.div`
    display: block;
    margin-top: 30px;
    padding-top: 30px;
    text-align: justify;
    text-justify: auto;

    p {
        font-size: 0.9rem;
        padding-right: 10px;
        margin-right: 10px;
    }
`;

const SideBarAboutH2 = styled.h2`
    padding-top: 10px;
    font-size: 20px;
    color: ${theme.text.colour.light_grey(undefined, undefined, 50)};
`;

const Article = styled.article`
    width: 70%;
    margin-top: 30px;
    margin-bottom: 30px;
    padding-left: 40px;
    padding-right: 40px;
    border-left: 1px dashed ${theme.container.border.colour.primary()};
    
    text-align: justify;
    text-justify: auto;
    
    @media (max-width: 1096px) {
        width: 100%;
    }
`;

const PostContent = styled.div`
    margin: 0 auto;
    padding: 0px;
`;

interface PostPageProps {
    content: string;
    post: PostMetadata;
    posts: PostMetadata[];
};

// reminder this returns a function
// this function is used in [slug].tsx and uses post, posts which are global variables
// these variables are passed by getStaticProps
export const withPostPage = (section: string) => {
    const PostPage: React.FC<PostPageProps> = ({ content, post, posts }) => {
        const allTags = Array.from(new Set(posts.flatMap(post => post.tags))).sort();

        const [selectedTags, setSelectedTags] = useState<string[]>([]);

        // if no tags selected, show all posts
        const filteredPosts: PostMetadata[] = selectedTags.length > 0 ? posts.filter(
            post => selectedTags.some(tag => post.tags.includes(tag))
        ) : posts;

        const handleTagSelect = (tag: string) => {
            setSelectedTags(prev => [...prev, tag]);
        };

        const handleTagDeselect = (tag: string) => {
            setSelectedTags(prev => prev.filter(t => t !== tag));
        };

        // redux control for tag filter visibility
        const tagsFilterVisible = useSelector((state: RootState) => state.visibility.tagsFilterVisible);

        return (
            <>
                <TagFilter
                    tags={allTags}
                    selectedTags={selectedTags}
                    onTagSelect={handleTagSelect}
                    onTagDeselect={handleTagDeselect}
                    visible={tagsFilterVisible}
                />
                <PostContainer>
                    <SideBarContainer>
                        <SideBarSiteName fontSize='20px'>{`Dereck's Notes`}</SideBarSiteName>
                        <SideBarEntriesContainer>
                            {filteredPosts.map((meta) => (
                                <SideEntryLink
                                    key={meta.slug}
                                    href={`/${section}/${meta.slug}`}
                                    passHref
                                >
                                    <span style={{ fontWeight: 'bold' }}>{meta.date}</span>: {meta.title}
                                </SideEntryLink>
                            ))}
                        </SideBarEntriesContainer>
                        <SideBarAboutContainer>
                            <SideBarAboutH2>About</SideBarAboutH2>
                            <p>
                                This website is custom made by Dereck using React, Next.js, and TypeScript. It incorporates progressive web app technologies an relies on a NodeJS backend along with a MongoDB database.
                            </p>
                            <p>
                                If you'd like to know more you can find the full source code on <a href='https://github.com/dereckmezquita/derecksnotes.com'>github.com/dereckmezquita/derecksnotes.com</a>
                            </p>
                        </SideBarAboutContainer>
                    </SideBarContainer>
                    <Article>
                        <h1>{post.title}</h1>
                        <PostContent dangerouslySetInnerHTML={{ __html: content }} />
                    </Article>
                </PostContainer>
            </>
        );
    };

    return PostPage;
};
```

Now this is my TagsFilter component. I want to make it so that if the window is smaller than 1200px as seen in my css then the tags filter component gets toggled off in redux.

```tsx
import styled from 'styled-components';
import { theme } from '@styles/theme';
import { useRef, useState } from 'react';

const FilterContainer = styled.div<{ visible: boolean }>`
    // width and margin to centre if not in a flex container
    width: 1000px;
    margin: 0 auto;

    /* if window is smaller than 900px make it 100% */
    @media (max-width: 1200px) {
        width: 95%;
    }

    top: 0;
    left: 0;
    padding: 10px;
    margin-bottom: 20px;
    background-color: ${theme.container.background.colour.primary()};
    border: 1px solid ${theme.container.border.colour.primary()};
    border-radius: 5px;
    box-shadow: ${theme.container.shadow.primary};
    opacity: ${props => props.visible ? 1 : 0};
    transition: opacity 0.3s;
    z-index: 1;
    display: ${props => props.visible ? 'flex' : 'none'};
    flex-wrap: wrap; // Allow tags to wrap to the next line if needed
    gap: 10px; // Provides consistent spacing between the tags
`;

const BaseButton = styled.span`
    user-select: none; // Prevent text selection
    font-family: ${theme.text.font.times};
    padding: 0px 7px 1px;
    cursor: pointer;
    border-radius: 5px;
    white-space: nowrap; // Prevents the tag from breaking into two lines
    transition: opacity 0.3s;

    &:hover {
        opacity: 0.3;
    }
`;

const FilterTag = styled(BaseButton) <{ selected: boolean }>`
    background-color: ${props => props.selected ? 'hsl(205, 70%, 50%)' : 'hsl(190, 15%, 90%)'};
    color: ${props => props.selected ? 'white' : 'black'};
`;

// css X
const ClearAllButton = styled(BaseButton)`
    background-color: hsl(0, 70%, 50%); // Shade of red
    color: white;
    position: relative;
    width: 20px;
    height: 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    &::before, &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 70%;
        height: 3px;
        background-color: white;
    }

    &::before {
        transform: translate(-50%, -50%) rotate(45deg);
    }

    &::after {
        transform: translate(-50%, -50%) rotate(-45deg);
    }
`;

interface TagFilterProps {
    tags: string[];
    selectedTags: string[];
    onTagSelect: (tag: string) => void;
    onTagDeselect: (tag: string) => void;
    visible: boolean; // redux
}

const TagFilter: React.FC<TagFilterProps> = ({
    tags, selectedTags, onTagSelect, onTagDeselect, visible
}) => {
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);  // To reference the filter container

    const clearAllTags = () => {
        selectedTags.forEach(tag => onTagDeselect(tag));
    };

    const handleMouseDown = (event: React.MouseEvent, tag: string) => {
        event.preventDefault(); // prevent text selection
        if (!selectedTags.includes(tag)) {
            onTagSelect(tag);
        } else {
            onTagDeselect(tag);
        }
        setIsDragging(true);
    };

    const handleMouseEnter = (event: React.MouseEvent, tag: string) => {
        event.preventDefault();
        if (isDragging) {
            if (!selectedTags.includes(tag)) {
                onTagSelect(tag);
            } else {
                onTagDeselect(tag);
            }
        }
    };

    const endDrag = () => {
        setIsDragging(false);
    };

    return (
        <FilterContainer ref={containerRef} onMouseUp={endDrag} onMouseLeave={endDrag} visible={visible}>
            {tags.map(tag => (
                <FilterTag
                    key={tag}
                    selected={selectedTags.includes(tag)}
                    onMouseDown={(ev) => handleMouseDown(ev, tag)}
                    onMouseEnter={(ev) => handleMouseEnter(ev, tag)}
                >
                    {tag}
                </FilterTag>
            ))}
            <ClearAllButton onClick={clearAllTags} />
        </FilterContainer>
    );
};

export default TagFilter;
```

As a reminder here is how that toggling is handled in nav bar:

```tsx
import Link from 'next/link';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '@styles/theme';

import { useDispatch } from 'react-redux';
import { toggleTagsFilter } from '@store/tagsFilterVisibilitySlice'; // control visibility of tag filter

const NavContainer = styled.nav`
    background-color: ${theme.container.background.colour.primary()};
    overflow: hidden;
    margin: 20px auto;
    width: 90%;
    color: ${theme.theme_colours[5]()};

    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 1px 1px 20px rgba(153, 153, 153, 0.5), 0 0 20px rgba(100, 100, 40, 0.2) inset;

    &:hover {
        box-shadow: 1px 1px 20px rgba(153, 153, 153, 0.5);
    }

    @media screen and (max-width: 1024px) {
        width: 95%;
    }
`;

const CommonNavItem = styled.div`
    cursor: pointer;
    display: block;
    color: inherit;
    text-align: center;
    padding: 14px 13px;
    text-decoration: none;
    font-size: 17px;
`;

// allows for argument to determine if align left or right
// inherit from Link component allows for linking to other pages
const NavLeftItem = styled(CommonNavItem).attrs({ as: Link }) <{ rightmost?: boolean }>`
    float: left;
    &:hover {
        color: ${theme.text.colour.white()};
        background: ${theme.theme_colours[5]()};
    }
`;

const NavRightItemLink = styled(CommonNavItem).attrs({ as: Link }) <{ rightmost?: boolean }>`
    float: right;
`;

const NavRightItem = styled(CommonNavItem) <{ rightmost?: boolean }>`
    float: right;
`;

const CommonNavImage = styled.img`
    height: 16px;
    cursor: pointer;
`;

const NavImage = styled(CommonNavImage)``;

const NavUIImage = styled(CommonNavImage)`
    opacity: 0.2;
    transition: opacity 0.5s ease-in-out;
    &:hover {
        opacity: 1;
    }
`;

const DropDownContainer = styled.div`
    float: left;
    overflow: hidden;
`;

// the same as NavItem but no link
const DropDownLabel = styled(CommonNavItem) <{ rightmost?: boolean }>``;

const DropDownContent = styled.div`
    display: none;
    position: absolute;
    background-color: red;
    min-width: 160px;
    z-index: 1;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 1px 1px 10px #ccc;

    ${DropDownContainer}:hover & {
        display: block;
    }

    ${NavLeftItem} {
        float: none;
        padding: 12px 16px;
        text-align: left;
    }
`;

const DateTimeDisplay = styled.div`
    cursor: pointer;
    float: right;
    display: block;
    color: inherit;
    text-align: center;
    padding: 14px 13px;
    text-decoration: none;
    font-size: 17px;
`;

// since using conditionals in components we must ensure that the component is mounted before rendering
// either this or use dynamic from next/dynamic
function NavBar() {
    const [hasMounted, setHasMounted] = useState(false);
    const [dateTime, setDateTime] = useState<string | null>(null);

    useEffect(() => {
        setHasMounted(true);

        const updateDateTime = () => {
            const currentDate = new Date();
            const displayDate = currentDate.toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'short'
            });
            const displayTime = currentDate.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            setDateTime(`${displayDate} ${displayTime}`);
        };

        updateDateTime();
        const interval = setInterval(updateDateTime, 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    if (!hasMounted) {
        return null;
    }

    // redux control of tag filter
    const dispatch = useDispatch();

    const handleToggleFilterClick = () => {
        dispatch(toggleTagsFilter());
    };

    return (
        <NavContainer>
            <NavLeftItem href='/'>Blog</NavLeftItem>
            <NavLeftItem href='/courses'>Courses</NavLeftItem>
            <NavLeftItem href='/references'>References</NavLeftItem>
            <DropDownContainer>
                <DropDownLabel>Dictionaries</DropDownLabel>
                <DropDownContent>
                    <NavLeftItem href='/dictionaries/biology'>Biology Dictionary</NavLeftItem>
                    <NavLeftItem href='/dictionaries/chemistry'>Chemistry Dictionary</NavLeftItem>
                </DropDownContent>
            </DropDownContainer>

            <NavRightItemLink href='https://www.linkedin.com/in/dereck/' target='_blank' title='LinkedIn'>
                <NavImage src='/site-images/icons/linkedin.png' />
            </NavRightItemLink>
            <DateTimeDisplay>{dateTime || "00 Jan 00:00:00"}</DateTimeDisplay>
            <NavRightItem onClick={handleToggleFilterClick}>
                <NavUIImage src='/site-images/ui/filter-solid.svg' />
            </NavRightItem>
        </NavContainer>
    )
}

export default NavBar;
```

Can I execute that function in my styled-components css or how is it done? You are the expert and teacher.