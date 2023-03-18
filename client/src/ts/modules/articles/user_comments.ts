import { getComments, getCommentReplies, sendComment, getUserInfo } from "../request";
import { dateToString, textToHTML } from "../helpers";

// TODO: consider breaking up code: https://stackoverflow.com/questions/12706290/typescript-define-class-and-its-methods-in-separate-files

class CommentSectionHandler {
    private contentWrapper = document.querySelector(".content-wrapper") as HTMLDivElement; // wraps article
    private userInfo: UserInfo; // response from server set on class instantiation

    private commentForm: HTMLDivElement;
    private commentSection: HTMLElement;
    private maxCommentLength: number = 300;
    private topLevelPreviewLimit: number = 5;
    private repliesPreviewLimit: number = 5;

    // used to store event listeners for reply forms so they can be removed
    private eventListenersMap = new WeakMap<Element, () => Promise<void>>();

    private generateCommentForm(reply: boolean = true): HTMLElement {
        return textToHTML(`
        <div class="new-comment-form ${reply ? "reply-level-comment-form" : "top-level-comment-form"}">
            <div class="comment-user-info">
                <span class="username-holder">
                    <a class="username" href="/user/${this.userInfo.username}">${this.userInfo.username}</a> <span class="username-flag">${this.userInfo.metadata.geo_locations[0].flag}</span>
                </span>
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

        this.commentForm = this.generateCommentForm(false) as HTMLDivElement;

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
            <div id="load-more-comments-holder"></div>
        </div>`);

        this.commentForm = this.generateCommentForm(true) as HTMLDivElement; // everything from now on is a reply

        this.contentWrapper.appendChild(this.commentSection);

        this.addNewCommentListeners(document.querySelector("div.new-comment-form.top-level-comment-form")!);
        this.getComments();
        this.addReplyFunctionality();
        this.loadMoreCommentsFunctionality();
    }

    private addNewCommentListeners(newCommentForm: HTMLDivElement) {
        const postComment = async () => {
            // get the value of the textarea
            const textarea: HTMLTextAreaElement = newCommentForm.querySelector("div.new-comment-textarea > textarea")!;
            const comment: string = textarea.value.trim();
            console.log(comment);

            if (comment.length === 0) alert("Comment cannot be empty.");

            // clear the textarea
            textarea.value = "";

            const datetime: string = new Date().toISOString();

            // send the comment to the server
            let commentId: string | undefined = newCommentForm.parentElement!.parentElement!.id
            commentId = commentId === "" ? undefined : commentId;

            // parse the comment for mentions of other users
            // a mention is @ + username
            const mentions: string[] = comment.match(/@([a-zA-Z0-9_]+)/g) || [];
            // const mentions: string[] = comment.match(/@[a-zA-Z][a-zA-Z0-9_]*/g) || [];

            // remove the leading @ from the username
            for (let i = 0; i < mentions.length; i++) {
                mentions[i] = mentions[i].slice(1);
            }

            const res: ServerRes = await sendComment(comment, datetime, mentions, commentId);

            if (!res.success) throw new Error(res.error);
            window.location.reload();
        };

        newCommentForm.querySelector(".comment-action")!.addEventListener("click", postComment);
        this.eventListenersMap.set(newCommentForm, postComment); // Store the named function in the WeakMap
    }

    private async getComments() {
        // load all top level comments by default
        let res: ServerRes = await getComments(this.topLevelPreviewLimit);
        if (!res.success) throw new Error(res.error);
        if (res.data.comments.length === 0) return console.log("No comments");

        const postedCommentsDiv = document.querySelector(".comment-section .posted-comments") as HTMLDivElement;

        // TODO: should get more comments if user clicks load more comments
        const commentsRes: UserComment[] = res.data.comments;

        let loadCommentsLink: HTMLAnchorElement | undefined;
        for (const comment of commentsRes) {
            const renderedComment = this.renderComment(comment);

            // getting replies to this comment
            // if the comment has replies_to_this array then it has been replied to
            // we can then send the commend_id for this comment and get back the replies
            // get only top 5 replies save the nextToken in the comment html as data attribute
            if (comment.replies_to_this!.length > 0) {
                let res: ServerRes = await getCommentReplies(comment.comment_id, 5);
                if (!res.success) throw new Error(res.error);

                const repliesRes: UserComment[] = res.data.comments;

                if (res.data.nextToken) renderedComment.dataset.nextToken = res.data.nextToken;

                for (const reply of repliesRes) {
                    const renderedReply = this.renderComment(reply);
                    renderedComment.querySelector(".comment-replies-holder")!.appendChild(renderedReply);
                }
            }

            if (res.data.commentsCount > this.topLevelPreviewLimit) {
                loadCommentsLink = textToHTML(`<a id="load-more-comments" style="cursor: pointer;">See ${res.data.commentsCount - this.topLevelPreviewLimit} more comment(s)</a>`) as HTMLAnchorElement;
                // store nextToken in the loadCommentsLink as data attribute
                loadCommentsLink.dataset.nextToken = res.data.nextToken;
            }

            // postedCommentsDiv.insertAdjacentHTML("beforeend", commentElement);
            postedCommentsDiv.appendChild(renderedComment);
        }

        if (loadCommentsLink) document.querySelector("#load-more-comments-holder")!.appendChild(loadCommentsLink);
    }

    private async loadMoreComments(nextToken: string): Promise<void> {
        const res: ServerRes = await getComments(this.topLevelPreviewLimit, nextToken);

        if (!res.success) throw new Error(res.error);
        if (res.data.comments.length === 0) return console.log("No more comments");

        const postedCommentsDiv = document.querySelector(".comment-section .posted-comments") as HTMLDivElement;
        const commentsRes: UserComment[] = res.data.comments;

        for (const comment of commentsRes) {
            const renderedComment = this.renderComment(comment);
            postedCommentsDiv.appendChild(renderedComment);
        }

        const loadCommentsLink = document.querySelector("#load-more-comments") as HTMLAnchorElement;

        if (res.data.nextToken) {
            loadCommentsLink.dataset.nextToken = res.data.nextToken;
        } else {
            loadCommentsLink.remove();
        }
    }

    private loadMoreCommentsFunctionality(): void {
        const commentSection = document.querySelector(".comment-section") as HTMLElement;
    
        commentSection.addEventListener("click", async (e: Event) => {
            const target = e.target as HTMLAnchorElement;
    
            if (target.id === "load-more-comments") {
                const nextToken = target.dataset.nextToken;
                if (nextToken) {
                    await this.loadMoreComments(nextToken);
                }
            }
        });
    }

    private renderComment(userComment: UserComment): HTMLDivElement {
        // convert datetime to this format 2022-01-01 12:00
        const datetime: string = dateToString(new Date(userComment.metadata.datetime));

        let comment: string = userComment.comment;
        if (userComment.comment.length > this.maxCommentLength) {
            comment = userComment.comment.slice(0, this.maxCommentLength) + `<span style="display: none;" class="comment-hidden-text">${userComment.comment.slice(this.maxCommentLength)}</span>` + ` <a class="read-more-comment" style="cursor: pointer;">read more...</a><a style="display: none;" class="read-less-comment">...read less.</a>`;
        }

        let loadRepliesLink: string = ""
        if (userComment.replies_to_this!.length > this.repliesPreviewLimit) {
            loadRepliesLink = `<a id="${userComment.comment_id}" class="view-replies-link" style="cursor: pointer;">See ${userComment.replies_to_this!.length - this.repliesPreviewLimit} more replies</a>`
        }

        const commentElement = textToHTML(`
        <div id="${userComment.comment_id}" class="posted-comment">
            <div class="comment-user-info">
                <span class="username-holder">
                    <a class="username" href="/user/${userComment.metadata.user.username}">${userComment.metadata.user.username}</a> <span class="username-flag">${userComment.metadata.geo_location.flag}</span>
                </span>
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
                ${loadRepliesLink}
            </div>
            <div class="comment-reply-form-holder"></div>
            <div class="comment-replies-holder"></div>
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
                const commentHolder = target.parentElement!.parentElement! as HTMLDivElement; // gets "posted-comment" element

                // Check if a reply form already exists
                const existingReplyForm = commentHolder.querySelector(".new-comment-form.reply-level-comment-form");

                if (existingReplyForm) {
                    // If a reply form exists, remove it and make sure event listeners are removed
                    const postComment = this.eventListenersMap.get(existingReplyForm);
                    if (postComment) {
                        existingReplyForm.querySelector(".comment-action")!.removeEventListener("click", postComment);
                    }
                    this.eventListenersMap.delete(existingReplyForm);
                    existingReplyForm.remove();
                } else {
                    // If no reply form exists, add one
                    this.addNewCommentListeners(this.commentForm);

                    // set textarea with @username of the comment we are replying to
                    // get the text of the username element and nothing else inside it
                    const username = commentHolder.querySelector("span.username-holder > a.username")!.textContent!.trim();
                    this.commentForm.querySelector("textarea")!.value = `@${username} `;

                    console.log(this.commentForm);

                    commentHolder.querySelector(".comment-reply-form-holder")!.appendChild(this.commentForm);
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
