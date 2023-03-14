import { getComments, sendComment, getUserInfo } from "../request";
import { dateToString, textToHTML } from "../helpers";

// TODO: consider breaking up code: https://stackoverflow.com/questions/12706290/typescript-define-class-and-its-methods-in-separate-files


class CommentSectionHandler {
    private contentWrapper = document.querySelector(".content-wrapper") as HTMLDivElement; // wraps article
    private userInfo: UserInfo; // response from server set on class instantiation

    private commentForm: string;
    private commentSection: string;

    private generateCommentForm(reply: boolean = true): string {
        return `
        <div class="new-comment-form ${reply ? "top-level-comment-form" : "reply-level-comment-form"}">
            <div class="comment-user-info">
                <span class="username">${this.userInfo.username}</span>
                <span></span>
                <button class="comment-action">Post</button>
            </div>
            <div class="new-comment-textarea">
                <img src="${this.userInfo.profilePhoto}" class="comment-profile-photo">
                <textarea></textarea>
            </div>
        </div>`;
    }

    constructor(userInfo: UserInfo) {
        this.userInfo = userInfo;

        this.commentForm = this.generateCommentForm(false);

        this.commentSection = `
        <div class="comment-section">
            <h2>Comments</h2>
            ${this.commentForm}
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

        this.commentForm = this.generateCommentForm(true); // everything from now on is a reply

        this.contentWrapper.insertAdjacentHTML("beforeend", this.commentSection);

        // this.setUserInfo();
        this.addNewcommentListeners();
        this.getComments();
    }

    private addNewcommentListeners() {
        // add event listener to the post button
        document.querySelector(".new-comment-form .comment-action")!.addEventListener("click", async () => {
            // get the value of the textarea
            const textarea: HTMLTextAreaElement = document.querySelector(".new-comment-form textarea")!;
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

    private async getComments() {
        let res: ServerRes = await getComments(10);
        if (!res.success) throw new Error(res.error);
        if (res.data.comments.length === 0) return console.log("No comments");

        // should get more comments if user clicks load more comments
        const commentsRes: UserComment[] = res.data.comments;
        while (res.data.nextToken) {
            res = await getComments(10, res.data.nextToken);
            commentsRes.push(...res.data.comments);

            if (!res.success) throw new Error(res.error);
        }

        const postedCommentsDiv = document.querySelector(".comment-section .posted-comments") as HTMLDivElement;
        const maxCommentLength: number = 300;

        for (const comment of commentsRes) {
            this.currentComment = comment;

            const commentElement = this.generateComment(maxCommentLength);

            // postedCommentsDiv.insertAdjacentHTML("beforeend", commentElement);
            postedCommentsDiv.appendChild(commentElement);
        }
    }

    private generateComment(maxCommentLength: number): HTMLDivElement {
        // convert datetime to this format 2022-01-01 12:00
        const currentDatetime: string = dateToString(new Date(this.currentComment.commentInfo.datetime));

        let comment: string = this.currentComment.comment;
        if (this.currentComment.comment.length > maxCommentLength) {
            comment = this.currentComment.comment.slice(0, maxCommentLength) + `<span style="display: none;" class="comment-hidden-text">${this.currentComment.comment.slice(maxCommentLength)}</span>` + ` <a class="read-more-comment">read more...</a><a style="display: none;" class="read-less-comment">...read less.</a>`;
        }

        console.log(this.currentComment);

        const commentElement = textToHTML(`
        <div id="${this.currentComment.comment_id}" class="posted-comment">
            <div class="comment-user-info">
                <span class="username">${this.currentComment.userInfo.username}</span>
                <span class="datetime">${currentDatetime}</span>
                <button class="comment-action comment-action-reply">Reply</button>
                <button class="comment-action comment-action-report">Report</button>
            </div>
            <div class="posted-comment-holder">
                <img src="${this.currentComment.userInfo.profilePhoto}" class="comment-profile-photo">
                <div class="posted-comment-text">${comment}</div>
            </div>
            <div class="posted-comment-actions">
                <button class="like-button">Like</button>
                <span class="like-count">${this.currentComment.commentInfo.likes}</span>
                <button class="dislike-button">Dislike</button>
                <span class="dislike-count">${this.currentComment.commentInfo.dislikes}</span>
            </div>
        </div>`) as HTMLDivElement;

        // add listener for show more button for that specific comment
        if (this.currentComment.comment.length > maxCommentLength) {
            const readMore = commentElement.querySelector(".read-more-comment") as HTMLAnchorElement;
            const readLess = commentElement.querySelector(".read-less-comment") as HTMLAnchorElement;
            const hiddenText = commentElement.querySelector(".comment-hidden-text") as HTMLSpanElement;

            readMore.addEventListener("click", () => {
                readMore.style.display = "none";
                hiddenText.style.display = "inline";

                // add event listener to read less button
                readLess.addEventListener("click", () => {
                    hiddenText.style.display = "none";
                    readMore.style.display = "inline";
                    readLess.style.display = "none";
                });
            });
        }

        return commentElement;
    }
}


(async () => {
    const res: ServerRes<UserInfo> = await getUserInfo();

    console.log(res.data);
    if (!res.success || !res.data) throw new Error(res.error);

    new CommentSectionHandler(res.data);
})();
