import { getComments, sendComment, getUserInfo } from "./modules/request";
import { dateToString } from "./modules/helpers";

// TODO: consider breaking up code: https://stackoverflow.com/questions/12706290/typescript-define-class-and-its-methods-in-separate-files

type AccountInfoRes = {
    // firstName: string;
    // lastName: string;
    username: string;
    email: string;
    profilePhoto?: string; // server could not have this info if user didn't set it
    // numberOfComments: number;
    // lastConnected: Date;
};

class CommentSectionHandler {
    constructor() { }
    // https://stackoverflow.com/questions/36363278/can-async-await-be-used-in-constructors
    static async create() {
        const o = new CommentSectionHandler();
        return await o.initialise();
    }

    private contentWrapper = document.querySelector(".content-wrapper") as HTMLDivElement; // wraps article
    private userInfo: AccountInfoRes; // response from server set on class instantiation

    private static readonly commentForm: string = `
    <div id="new-comment-form">
        <div class="comment-user-info">
            <span class="username">${this.userInfo}</span>
            <span class="datetime"></span>
            <button class="comment-action">Post</button>
        </div>
        <div class="new-comment-textarea">
            <img src="" class="comment-profile-photo">
            <textarea></textarea>
        </div>
    </div>`;
    private static readonly commentSection: string = `
    <div class="comment-section">
        <h2>Comments</h2>
        ${CommentSectionHandler.commentForm}
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

    async initialise() {
        this.contentWrapper.insertAdjacentHTML("beforeend", CommentSectionHandler.commentSection);

        await this.getUserInfo();
        this.setUserInfo();
        this.addNewcommentListeners();
        this.getComments();
    }

    private async getUserInfo(): Promise<void> {
        const res: ServerRes = await getUserInfo();

        if (!res.success) {
            this.userInfo.email = "guest";
            this.userInfo.username = "Log in to comment";
            this.userInfo.profilePhoto = `/site-images/user-defaults/profile-photos/default-profile-photo-${Math.floor(Math.random() * 4) + 1}-small.png`;
        }

        // from here only executes if user is logged in
        this.userInfo = res.data as AccountInfoRes;
    }

    private setUserInfo(): void {
        // do querySelectorAll new comment forms; get node list
        const profilePhoto: NodeListOf<HTMLImageElement> = document.querySelectorAll("#new-comment-form .comment-profile-photo");
        const username: NodeListOf<HTMLSpanElement> = document.querySelectorAll("#new-comment-form .username");

        for (let i = 0; i < profilePhoto.length; i++) {
            // set the username
            username[i].textContent = this.userInfo.username;

            // set the profile photo
            profilePhoto[i].src = `/site-images/user-content/profile-photos/${this.userInfo.profilePhoto}`;
        }
    }

    private async getComments() {
        let res: ServerRes = await getComments(10);
        if (!res.success) throw new Error(res.error);
        if (res.data.comments.length === 0) return console.log("No comments");

        // should get more comments if user clicks load more comments
        const commentsRes: CommentRes[] = res.data.comments;
        while (res.data.nextToken) {
            res = await getComments(10, res.data.nextToken);
            commentsRes.push(...res.data.comments);

            if (!res.success) throw new Error(res.error);
        }

        const postedCommentsDiv = document.querySelector(".comment-section .posted-comments") as HTMLDivElement;

        for (const comment of commentsRes) {
            let profilePhotoPath: string;
            if (comment.userInfo.profilePhoto) {
                profilePhotoPath = `/site-images/user-content/profile-photos/${comment.userInfo.profilePhoto}`;
            } else {
                profilePhotoPath = "/site-images/user-defaults/profile-photos/default-profile-photo-black.png";
            }

            // if comment is greater than 500 characters show only first 500 characters then add a read more button
            let currentComment: string = comment.comment;
            // convert datetime to this format 2022-01-01 12:00
            let currentDatetime: string = dateToString(comment.commentInfo.datetime);
            const maxCommentLength: number = 300;

            if (comment.comment.length > maxCommentLength) {
                currentComment = comment.comment.slice(0, maxCommentLength) + `<span style="display: none;" class="comment-hidden-text">${comment.comment.slice(maxCommentLength)}</span>` + ` <a class="read-more-comment">read more...</a>`;
            }

            const commentElement = `
            <div id="${comment.comment_id}" class="posted-comment">
                <div class="comment-user-info">
                    <span class="username">${comment.userInfo.username}</span>
                    <span class="datetime">${currentDatetime}</span>
                    <button class="comment-action comment-action-reply">Reply</button>
                    <button class="comment-action comment-action-report">Report</button>
                </div>
                <div class="posted-comment-holder">
                    <img src="${profilePhotoPath}" class="comment-profile-photo">
                    <div class="posted-comment-text">${currentComment}</div>
                </div>
                <div class="posted-comment-actions">
                    <button class="like-button">Like</button>
                    <span class="like-count">${comment.commentInfo.likes}</span>
                    <button class="dislike-button">Dislike</button>
                    <span class="dislike-count">${comment.commentInfo.dislikes}</span>
                </div>
            </div>`;

            postedCommentsDiv.insertAdjacentHTML("beforeend", commentElement);

            // add listener for show more button for that specific comment
            if (comment.comment.length > maxCommentLength) {
                const commentElement = document.querySelector(`#${comment.comment_id}`) as HTMLDivElement;
                const readMoreButton = commentElement.querySelector(".read-more-comment") as HTMLButtonElement;
                console.log(readMoreButton);
                const hiddenText = document.querySelector(`#${comment.comment_id} .comment-hidden-text`) as HTMLDivElement;

                readMoreButton.addEventListener("click", () => {
                    readMoreButton.style.display = "none";
                    hiddenText.style.display = "inline";

                    // add a read less button
                    const readLessButton = document.createElement("a");
                    readLessButton.classList.add("read-less-comment");
                    readLessButton.textContent = "...read less.";

                    // append the read less button to the comment
                    commentElement.querySelector(".posted-comment-text").appendChild(readLessButton);

                    // add event listener to read less button
                    readLessButton.addEventListener("click", () => {
                        hiddenText.style.display = "none";
                        readMoreButton.style.display = "inline";
                        readLessButton.remove();
                    });
                });
            }
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
            window.location.reload();
        });
    }
}

(async () => {
    const obj = await CommentSectionHandler.create();
})();
