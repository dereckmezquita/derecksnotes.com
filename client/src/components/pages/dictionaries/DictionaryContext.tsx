'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Definition } from '@components/utils/dictionaries/fetchDefinitionMetadata';

/**
 * This file implements the React Context API to manage shared state for the Dictionary component tree.
 * It provides a centralised way to manage and access state related to dictionary definitions,
 * filtering, searching, and tag selection without prop drilling.
 */

/**
 * Defines the shape of the context object that will be shared across components.
 * This includes all the state variables and setter functions needed for the dictionary functionality.
 */
interface DictionaryContextType {
    definitions: Definition[];  // All dictionary definitions
    filteredDefinitions: Definition[];  // Definitions filtered based on search and tags
    setFilteredDefinitions: React.Dispatch<React.SetStateAction<Definition[]>>;
    searchMode: 'words' | 'tags';  // Current search mode
    setSearchMode: React.Dispatch<React.SetStateAction<'words' | 'tags'>>;
    searchTerm: string;  // Current search term
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    selectedTags: string[];  // Currently selected tags for filtering
    setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
}

// Create a context with the defined type, initially undefined
const DictionaryContext = createContext<DictionaryContextType | undefined>(undefined);

/**
 * The DictionaryProvider component is responsible for managing the state and providing it to its children.
 * It wraps the entire Dictionary component tree, making the shared state available to all child components.
 * 
 * @param children - The child components that will have access to the context
 * @param initialDefinitions - The initial set of dictionary definitions
 * 
 * Usage:
 * <DictionaryProvider initialDefinitions={definitions}>
 *   <YourComponent />
 * </DictionaryProvider>
 */
// export const DictionaryProvider: React.FC<{ children: ReactNode, initialDefinitions: Definition[] }> = ({ children, initialDefinitions }) => {
export function DictionaryProvider({ children, initialDefinitions }: { children: ReactNode, initialDefinitions: Definition[] }) {
    // Initialize all the state variables
    const [definitions] = useState<Definition[]>(initialDefinitions);
    const [filteredDefinitions, setFilteredDefinitions] = useState<Definition[]>(initialDefinitions);
    const [searchMode, setSearchMode] = useState<'words' | 'tags'>('words');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    // Provide the state and setter functions to all children through the context
    return (
        <DictionaryContext.Provider value={{
            definitions,
            filteredDefinitions,
            setFilteredDefinitions,
            searchMode,
            setSearchMode,
            searchTerm,
            setSearchTerm,
            selectedTags,
            setSelectedTags
        }}>
            {children}
        </DictionaryContext.Provider>
    );
};

/**
 * A custom hook that provides easy access to the DictionaryContext.
 * This hook should be used in any component that needs to access or modify the shared dictionary state.
 * 
 * @throws Error if used outside of a DictionaryProvider
 * 
 * Usage:
 * const { filteredDefinitions, setSearchTerm } = useDictionary();
 */
export const useDictionary = () => {
    const context = useContext(DictionaryContext);
    if (context === undefined) {
        throw new Error('useDictionary must be used within a DictionaryProvider');
    }
    return context;
};

/**
 * How to use this system:
 * 
 * 1. Wrap your top-level Dictionary component with the DictionaryProvider:
 *    <DictionaryProvider initialDefinitions={yourDefinitions}>
 *      <Dictionary />
 *    </DictionaryProvider>
 * 
 * 2. In any child component that needs access to the dictionary state, use the useDictionary hook:
 *    const { filteredDefinitions, setSearchTerm } = useDictionary();
 * 
 * 3. You can then use and update the state directly in your components:
 *    <input onChange={(e) => setSearchTerm(e.target.value)} />
 *    {filteredDefinitions.map(def => <DefinitionItem key={def.id} definition={def} />)}
 * 
 * This pattern allows you to manage complex state across multiple components without prop drilling,
 * making your code cleaner and easier to maintain.
 */