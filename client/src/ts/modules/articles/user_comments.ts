import { getComments, getCommentReplies, sendComment, getUserInfo } from "../request";
import { dateToString, textToHTML } from "../helpers";

// TODO: consider breaking up code: https://stackoverflow.com/questions/12706290/typescript-define-class-and-its-methods-in-separate-files

class CommentSectionHandler {
    private contentWrapper = document.querySelector(".content-wrapper") as HTMLDivElement; // wraps article
    private userInfo: UserInfo; // response from server set on class instantiation

    private commentForm: HTMLElement;
    private commentSection: HTMLElement;
    private maxCommentLength: number = 300;

    private generateCommentForm(reply: boolean = true): HTMLElement {
        return textToHTML(`
        <div class="new-comment-form ${reply ? "reply-level-comment-form" : "top-level-comment-form"}">
            <div class="comment-user-info">
                <span class="username">${this.userInfo.username} ${this.userInfo.metadata.geo_locations[0].flag}</span>
                <span></span>
                <button class="comment-action">Post</button>
            </div>
            <div class="new-comment-textarea">
                <img src="${this.userInfo.profilePhoto}" class="comment-profile-photo">
                <textarea></textarea>
            </div>
        </div>`);
    }

    constructor(userInfo: UserInfo) {
        this.userInfo = userInfo;

        this.commentForm = this.generateCommentForm(false);

        this.commentSection = textToHTML(`
        <div class="comment-section">
            <h2>Comments</h2>
            ${this.commentForm.outerHTML}
            <div class="comment-sort">
                <select>
                    <option value="comment-sort-newest">Newest</option>
                    <option value="comment-sort-oldest">Oldest</option>
                    <option value="comment-sort-most-liked">Most Liked</option>
                    <option value="comment-sort-most-disliked">Most Disliked</option>
                </select>
            </div>
            <div class="posted-comments"></div>
        </div>`);

        console.log(this.commentSection)

        this.commentForm = this.generateCommentForm(true); // everything from now on is a reply

        // this.contentWrapper.insertAdjacentHTML("beforeend", this.commentSection);
        this.contentWrapper.appendChild(this.commentSection);

        // this.setUserInfo();
        this.addNewCommentListeners();
        this.getComments();
        this.addReplyFunctionality();
    }

    private addNewCommentListeners() {
        // add event listener to the post button
        document.querySelector(".new-comment-form .comment-action")!.addEventListener("click", async () => {
            // get the value of the textarea
            const textarea: HTMLTextAreaElement = document.querySelector(".new-comment-form textarea")!;
            const comment: string = textarea.value.trim();

            if (comment.length === 0) alert("Comment cannot be empty");

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

        // TODO: should get more comments if user clicks load more comments
        const commentsRes: UserComment[] = res.data.comments;
        while (res.data.nextToken) {
            res = await getComments(10, res.data.nextToken);
            commentsRes.push(...res.data.comments);

            if (!res.success) throw new Error(res.error);
        }

        const postedCommentsDiv = document.querySelector(".comment-section .posted-comments") as HTMLDivElement;

        for (const comment of commentsRes) {
            const renderedComment = this.renderComment(comment);

            // getting replies to this comment
            // if the comment has replies_to_this array then it has been replied to
            // we can then send the commend_id for this comment and get back the replies
            if (comment.replies_to_this!.length > 0) {
                let res: ServerRes = await getCommentReplies(comment.comment_id, 10);
                if (!res.success) throw new Error(res.error);

                const repliesRes: UserComment[] = res.data.comments;
                while (res.data.nextToken) {
                    res = await getCommentReplies(comment.comment_id, 10, res.data.nextToken);
                    repliesRes.push(...res.data.comments);

                    if (!res.success) throw new Error(res.error);
                }

                for (const reply of repliesRes) {
                    const renderedReply = this.renderComment(reply);
                    renderedComment.appendChild(renderedReply);
                }
            }

            // postedCommentsDiv.insertAdjacentHTML("beforeend", commentElement);
            postedCommentsDiv.appendChild(renderedComment);
        }
    }

    private renderComment(userComment: UserComment): HTMLDivElement {
        // convert datetime to this format 2022-01-01 12:00
        const datetime: string = dateToString(new Date(userComment.metadata.datetime));

        let comment: string = userComment.comment;
        if (userComment.comment.length > this.maxCommentLength) {
            comment = userComment.comment.slice(0, this.maxCommentLength) + `<span style="display: none;" class="comment-hidden-text">${userComment.comment.slice(this.maxCommentLength)}</span>` + ` <a class="read-more-comment" style="cursor: pointer;">read more...</a><a style="display: none;" class="read-less-comment">...read less.</a>`;
        }

        // TODO: update type we always have replies_to_this set to an empty array
        const repliesLink: string = userComment.replies_to_this!.length > 0 ? `<a id="${userComment.comment_id}" class="view-replies-link" style="cursor: pointer;">${userComment.replies_to_this!.length} replies</a>` : "";

        const commentElement = textToHTML(`
        <div id="${userComment.comment_id}" class="posted-comment">
            <div class="comment-user-info">
                <span class="username">${userComment.metadata.user.username} ${userComment.metadata.geo_location.flag}</span>
                <span class="datetime">${datetime}</span>
                <button class="comment-action comment-action-reply">Reply</button>
                <button class="comment-action comment-action-report">Report</button>
            </div>
            <div class="posted-comment-holder">
                <img src="${userComment.metadata.user.profilePhoto}" class="comment-profile-photo">
                <div class="posted-comment-text">${comment}</div>
            </div>
            <div class="posted-comment-actions">
                <button class="like-button">Like</button>
                <span class="like-count">${userComment.metadata.likes}</span>
                <button class="dislike-button">Dislike</button>
                <span class="dislike-count">${userComment.metadata.dislikes}</span>
                ${repliesLink}
            </div>
        </div>`) as HTMLDivElement;

        // add listener for show more button for that specific comment
        if (userComment.comment.length > this.maxCommentLength) {
            const readMore = commentElement.querySelector(".read-more-comment") as HTMLAnchorElement;
            const readLess = commentElement.querySelector(".read-less-comment") as HTMLAnchorElement;
            const hiddenText = commentElement.querySelector(".comment-hidden-text") as HTMLSpanElement;

            readMore.addEventListener("click", () => {
                readMore.style.display = "none";
                readLess.style.display = "inline";
                readLess.style.cursor = "pointer";
                hiddenText.style.display = "inline";

                // add event listener to read less button
                readLess.addEventListener("click", () => {
                    hiddenText.style.display = "none";
                    readMore.style.display = "inline";
                    readLess.style.display = "none";
                    readLess.style.cursor = "pointer";
                });
            });
        }

        return commentElement;
    }

    private addReplyFunctionality(): void {
        // we will use event delegation
        // we want to appendChild to the target comment; has class of posted-comment
        document.querySelector(".comment-section")!.addEventListener("click", (e: Event) => {
            const target = e.target as HTMLButtonElement;

            if (target.classList.contains("comment-action-reply")) {
                const commentId = target.parentElement!.parentElement!.id;
                const commentHolder = target.parentElement!.parentElement! as HTMLDivElement; // gets "posted-comment" element

                // Check if a reply form already exists
                const existingReplyForm = commentHolder.querySelector(".new-comment-form.reply-level-comment-form");

                if (existingReplyForm) {
                    // If a reply form exists, remove it
                    commentHolder.removeChild(existingReplyForm);
                } else {
                    // If no reply form exists, add one

                    // Add the comment at the end
                    // commentHolder.insertAdjacentHTML("beforeend", this.commentForm);
                    commentHolder.appendChild(this.commentForm);

                    // Add event listener to the post button of the reply element
                    commentHolder.querySelector(".new-comment-form .comment-action")!.addEventListener("click", async () => {
                        // Get the value of the textarea
                        const textarea: HTMLTextAreaElement = commentHolder.querySelector(".new-comment-form textarea")!;
                        const comment: string = textarea.value.trim();

                        if (comment.length === 0) alert("Comment cannot be empty");

                        // Clear the textarea
                        textarea.value = "";

                        const datetime: string = new Date().toISOString();

                        // Send the comment to the server
                        const res: ServerRes = await sendComment(comment, datetime, commentId);

                        if (!res.success) throw new Error(res.error);
                        window.location.reload();
                    });
                }
            }
        });
    }

    private getReplies(): void {
        document.querySelector(".comment-section")!.addEventListener("click", async (e: Event) => {
            const target = e.target as HTMLAnchorElement;

            if (target.classList.contains("view-replies-link")) {
                const commentHolder = target.parentElement!.parentElement! as HTMLDivElement; // gets "posted-comment" element
                const commentId = target.id;

                console.log(commentId)

                let res: ServerRes<UserComment[]> = await getCommentReplies(commentId, 10);

                if (!res.success) throw new Error(res.error);

                const replies: UserComment[] = res.data!;

                console.log(replies);
            }
        });
    }
}

(async () => {
    const res: ServerRes<UserInfo> = await getUserInfo();

    if (!res.success || !res.data) throw new Error(res.error);

    new CommentSectionHandler(res.data);
})();
