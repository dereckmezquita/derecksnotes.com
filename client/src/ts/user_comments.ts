import { getComments, sendComment, getUserInfo } from "./modules/request";

// comments section goes adjacent to article
// </article>
// <!-- comments section goes here -->

type AccountInfoRes = {
    // firstName: string;
    // lastName: string;
    username: string;
    email: string;
    profilePhoto: string;
    numberOfComments: number;
    // lastConnected: Date;
};

class CommentSectionHandler {
    page: string = window.location.pathname.split("/").pop(); // every article should have unique name

    private contentWrapper = document.querySelector(".content-wrapper") as HTMLDivElement;

    // user profile photo needs to be loaded
    private static readonly commentSection: string = `
    <div class="comment-section">
        <h2>Comments</h2>
        <div id="new-comment-form">
            <div class="comment-user-info">
                <button class="comment-action">Post</button>
            </div>
            <div class="new-comment-textarea">
                <img class="comment-profile-photo">
                <textarea></textarea>
            </div>
        </div>

        <div class="comment-sort">
            <select>
                <option value="comment-sort-newest">Newest</option>
                <option value="comment-sort-oldest">Oldest</option>
                <option value="comment-sort-most-liked">Most Liked</option>
                <option value="comment-sort-most-disliked">Most Disliked</option>
            </select>
        </div>

        <div class="posted-comments"></div>
    </div>`;

    constructor() {
        // append the comment section to content-wrapper
        this.contentWrapper.insertAdjacentHTML("beforeend", CommentSectionHandler.commentSection);

        // get user info
        this.getUserInfo();
        this.addNewcommentListeners();
    }

    private addNewcommentListeners() {
        // add event listener to the post button
        document.querySelector("#new-comment-form .comment-action").addEventListener("click", async () => {
            // get the value of the textarea
            const textarea: HTMLTextAreaElement = document.querySelector("#new-comment-form textarea");
            const comment: string = textarea.value;

            // clear the textarea
            textarea.value = "";

            const datetime: string = new Date().toISOString();

            // send the comment to the server
            const res: ServerRes = await sendComment(comment, datetime);

            if (!res.success) throw new Error(res.error);

            console.log(`Comment response:`, res.data);
        });
    }

    private async getUserInfo() {
        const res: ServerRes = await getUserInfo();

        if (!res.success) throw new Error(res.error);

        console.log(`Login response:`, res.data);

        const userInfo: AccountInfoRes = res.data;

        // set the username
        const username: HTMLSpanElement = document.createElement("span");
        username.classList.add("username");
        username.textContent = userInfo.username;

        // append as the first element the username to the comment-user-info
        document.querySelector("#new-comment-form .comment-user-info").prepend(username);

        // set the profile photo
        const profilePhoto: HTMLImageElement = document.querySelector("#new-comment-form .comment-profile-photo");
        profilePhoto.src = `/site-images/user-content/profile-photos/${userInfo.profilePhoto}`;
    }
}

new CommentSectionHandler();
