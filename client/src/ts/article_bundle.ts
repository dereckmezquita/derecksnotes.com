import * as fa from './modules/articles/format_article';

// ------------------------
import { requestDefinitions } from "./modules/articles/request_definitions";

fa.setTitle();
fa.dropCap();
fa.getSideEntries();

(async () => {
    await requestDefinitions(); // checks if dictionary; return if not

    await fa.formatFigures();
    await fa.footNotes();
    await fa.wordCount();
})();

// ------------------------
import './modules/articles/user_comments';