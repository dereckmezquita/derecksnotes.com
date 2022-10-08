
// this code is injected to dictionaries
// this is nearly identical to article_bundle
// this script assures definitions are loaded first then images are formatted

// ------------------------
// get the definitions for the dictionary and write to DOM
import "./modules/request_definitions";

// ------------------------
// get the h1 and use it to set the title of the page; appears in tab name
import "./modules/article_title";

// ------------------------
// first letter of the first paragraph is a drop cap
import "./modules/article_drop_cap";

// ------------------------
// calculate and print word count/read time to side bar
import "./modules/article_word_count";

// ------------------------
// formats and adds counters to pages with figures using figure/figcaption tags
import "./modules/article_figures";

// ------------------------
// footnotes: <a class="foot-note" href="some-link" target="_blank">
import "./modules/article_foot_notes";

// ------------------------
// requests side bar content from server
import "./modules/article_request_side_entries";
