import { Definition } from "@components/app/dictionaries/biology/page";
import { PostContentWrapper } from "../posts-dictionaries";

/**
 * For rendering definitions in a numbered list; separated by sections per letter
 * @param definitions An array of definitions { source: React.ReactNode; frontmatter: DefinitionMetadata; }
 */
export function renderDefinitions(definitions: Definition[]) {
    let currentLetter = '';

    return definitions.map((definition, idx) => {
        const startNewLetter: boolean =
            definition.frontmatter.letter.toUpperCase() !== currentLetter;
        if (startNewLetter) {
            currentLetter = definition.frontmatter.letter.toUpperCase();
        }

        return (
            <>
                {startNewLetter && <h2 id={currentLetter}>{currentLetter}</h2>}
                <li key={definition.frontmatter.slug}>
                    <PostContentWrapper>{definition.source}</PostContentWrapper>
                </li>
            </>
        );
    });
}
