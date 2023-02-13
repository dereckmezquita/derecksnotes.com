import { getComments } from "./modules/request";

// comments section goes adjacent to article
// </article>
// <!-- comments section goes here -->

class CommentSectionHandler {
    private contentWrapper = document.querySelector(".content-wrapper") as HTMLDivElement;

    // user profile photo needs to be loaded
    private static readonly commentSection: string = `
    <section class="comments">
        <div class="add-comment">
            <div class="image-textarea">
                <textarea placeholder="Add comment..."></textarea>
            </div>
            <button>Post</button>
        </div>
        <div class="sort-by">
            <select>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="most-likes">Most likes</option>
                <option value="least-likes">Least likes</option>
            </select>
        </div>
    </section>`;

    constructor() {
        // append the comment section to content-wrapper
        this.contentWrapper.insertAdjacentHTML("beforeend", CommentSectionHandler.commentSection);

        // we have to add the user's profile photo to the comment section
        const userPhoto = document.createElement("img");
    }
}

// new CommentSectionHandler();