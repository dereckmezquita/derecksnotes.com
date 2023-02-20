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
                <span class="username">Login to comment!</span>
                <span class="datetime"></span>
                <button class="comment-action">Post</button>
            </div>
            <div class="new-comment-textarea">
                <img src="" class="comment-profile-photo">
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

        this.getComments();
    }

    private async getComments() {
        let res: ServerRes = await getComments(10);
        if (!res.success) throw new Error(res.error);

        console.log(res.data.comments)

        // should get more comments if user clicks load more comments
        // const comments: any[] = res.data.comments;
        while (res.data.nextToken) {
            res = await getComments(10, res.data.nextToken);
            // comments.push(...res.data.comments);
            console.log(res.data.comments)

            if (!res.success) throw new Error(res.error);
        }
    }
    
    private addNewcommentListeners() {
        // add event listener to the post button
        document.querySelector("#new-comment-form .comment-action").addEventListener("click", async () => {
            // get the value of the textarea
            const textarea: HTMLTextAreaElement = document.querySelector("#new-comment-form textarea");
            const comment: string = textarea.value.trim();

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
        const profilePhoto: HTMLImageElement = document.querySelector("#new-comment-form .comment-profile-photo");

        const res: ServerRes = await getUserInfo();

        if (!res.success) {
            // a number between 1 and 4
            const photo_num: number = Math.floor(Math.random() * 4) + 1;

            // set the profile photo
            profilePhoto.src = `/site-images/user-defaults/profile-photos/default-profile-photo-${photo_num}-small.png`;
            return;
        }

        console.log(`Login response:`, res.data);

        const userInfo: AccountInfoRes = res.data;

        // set the username
        const username: HTMLSpanElement = document.createElement("span");
        username.classList.add("username");
        username.textContent = userInfo.username;

        // append as the first element the username to the comment-user-info
        document.querySelector("#new-comment-form .comment-user-info").prepend(username);

        // set the profile photo
        profilePhoto.src = `/site-images/user-content/profile-photos/${userInfo.profilePhoto}`;
    }
}

new CommentSectionHandler();
