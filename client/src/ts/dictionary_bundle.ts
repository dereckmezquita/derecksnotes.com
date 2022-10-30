
// this code is injected to dictionaries
// this is nearly identical to article_bundle
// this script assures definitions are loaded first then images are formatted

import {
    setTitle, // get the h1 and use it to set the title of the page; appears in tab name
    dropCap, // first letter of the first paragraph is a drop cap
    wordCount, // calculate and print word count/read time to side bar
    formatFigures, // formats and adds counters to pages with figures using figure/figcaption tags
    footNotes, // footnotes: <a class="foot-note" href="some-link" target="_blank">
    getSideEntries // requests side bar content from server
} from './modules/formatDOM';

// ------------------------
// get the definitions for the dictionary and write to DOM
import { requestDefinitions } from "./modules/request_definitions";

// async function call all these in order blocking code
(async () => {
    await setTitle();
    await requestDefinitions();
    await getSideEntries();
    
    await dropCap();
    await wordCount();
    await formatFigures();
    await footNotes();
})();