import {
    getComments,
    getCommentReplies,
    sendComment,
    getUserInfo,
    judgeComment,
    reportComment
} from "../request";
import { dateToString, textToHTML } from "../helpers";

// TODO: consider breaking up code: https://stackoverflow.com/questions/12706290/typescript-define-class-and-its-methods-in-separate-files

class CommentSectionHandler {
    private userInfo: UserInfo; // response from server set on class instantiation

    private commentForm: HTMLDivElement;
    private maxCommentLength: number = 300;
    private topLevelPreviewLimit: number = 5;
    private repliesPreviewLimit: number = 5;
    // used to store event listeners for reply forms so they can be removed
    private eventListenersMap = new WeakMap<Element, () => Promise<void>>();

    private generateCommentForm(reply: boolean = true): HTMLElement {
        // ----------------------------------------
        // used twice to generate the comment form
        // ----------------------------------------
        const usernameLink: string = this.userInfo.username !== "Guest" ? `<a class="username" href="/user/${this.userInfo.username}">${this.userInfo.username}</a> <span class="username-flag">${this.userInfo.metadata.geo_locations[0].flag}</span>` : `<span class="username">Login</span>`;

        return textToHTML(`
        <div class="new-comment-form ${reply ? "reply-level-comment-form" : "top-level-comment-form"}">
            <div class="comment-user-info">
                <span class="username-holder">
                    ${usernameLink}
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

    private addNewCommentListeners(newCommentForm: HTMLDivElement) {
        // ----------------------------------------
        // adds listeners to new comment forms; stores the event listener in a WeakMap
        // ----------------------------------------
        const postComment = async () => {
            const textarea: HTMLTextAreaElement = newCommentForm.querySelector("div.new-comment-textarea > textarea")!;
            const comment: string = textarea.value.trim();

            if (comment.length === 0) alert("Comment cannot be empty.");

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

    constructor(userInfo: UserInfo) {
        // ----------------------------------------
        // saves userInfo, generate comment-section and attaches, generates comment form for subsequent replies, add new comment listener, get's comments, adds reply functionality, adds load more comments functionality
        // ----------------------------------------

        this.userInfo = userInfo;

        this.commentForm = this.generateCommentForm(false) as HTMLDivElement;

        const commentSection = textToHTML(`
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

        this.commentForm = this.generateCommentForm(true) as HTMLDivElement; // everything from now on replies

        document.querySelector(".content-wrapper")!.appendChild(commentSection);

        this.addNewCommentListeners(document.querySelector("div.new-comment-form.top-level-comment-form")!);
        this.getComments();
        this.addReplyFunctionality();
        this.loadMoreCommentsFunctionality();
        this.loadMoreRepliesFunctionality();
        this.judgeCommentFunctionality();
        this.reportCommentFunctionality();
    }

    private async getComments(nextToken: string | undefined = undefined): Promise<void> {
        // load all top level comments by default
        const res_comments: ServerRes = await getComments(this.topLevelPreviewLimit, nextToken);

        if (!res_comments.success) throw new Error(res_comments.error);
        if (res_comments.data.comments.length === 0) return console.log("No comments");

        const postedCommentsDiv = document.querySelector(".comment-section .posted-comments") as HTMLDivElement;
        const commentsRes: UserComment[] = res_comments.data.comments;

        for (const comment of commentsRes) {
            const renderedComment = this.renderComment(comment);

            // getting replies to this comment
            // if the comment has replies_to_this array then it has been replied to
            // we can then send the commend_id for this comment and get back the replies
            // get only top 5 replies save the nextToken in the comment html as data attribute
            if (comment.replies_to_this!.length > 0) {
                const res_replies: ServerRes = await getCommentReplies(comment.comment_id, this.topLevelPreviewLimit);
                if (!res_replies.success) throw new Error(res_replies.error);

                const repliesRes: UserComment[] = res_replies.data.comments;

                if (res_replies.data.nextToken) (renderedComment.querySelector(".load-more-replies")! as HTMLDivElement).dataset.nextToken = res_replies.data.nextToken;

                for (const reply of repliesRes) {
                    const renderedReply = this.renderComment(reply);
                    renderedComment.querySelector(".comment-replies-holder")!.appendChild(renderedReply);
                }
            }

            // postedCommentsDiv.insertAdjacentHTML("beforeend", commentElement);
            postedCommentsDiv.appendChild(renderedComment);
        }

        const loadMoreCommentsHolder: HTMLDivElement = document.querySelector("#load-more-comments-holder")!;
        let loadCommentsLink: HTMLAnchorElement | undefined;

        if (res_comments.data.nextToken) {
            loadCommentsLink = textToHTML(`<a id="load-more-comments" style="cursor: pointer;">See ${res_comments.data.commentsCount - this.topLevelPreviewLimit} more comment(s)</a>`) as HTMLAnchorElement;
            // store nextToken in the loadCommentsLink as data attribute
            loadCommentsLink.dataset.nextToken = res_comments.data.nextToken;

            loadMoreCommentsHolder.appendChild(loadCommentsLink);
        } else {
            loadMoreCommentsHolder.innerHTML = "";
        }
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

                    commentHolder.querySelector(".comment-reply-form-holder")!.appendChild(this.commentForm);
                }
            }
        });
    }

    private loadMoreCommentsFunctionality(): void {
        const commentSection = document.querySelector(".comment-section") as HTMLElement;

        commentSection.addEventListener("click", async (e: Event) => {
            const target = e.target as HTMLAnchorElement;

            if (target.id === "load-more-comments") {
                const nextToken = target.dataset.nextToken;
                if (nextToken) {
                    await this.getComments(nextToken);
                }
            }
        });
    }

    private loadMoreRepliesFunctionality(): void {
        document.querySelector(".comment-section")!.addEventListener("click", async (e: Event) => {
            const target = e.target as HTMLAnchorElement;

            if (target.classList.contains("load-more-replies")) {
                const commentId = target.dataset.commentId!;
                const nextToken = target.dataset.nextToken!;

                await this.loadMoreReplies(commentId, nextToken);
            }
        });
    }

    // ------------------------------------------------------
    private renderComment(userComment: UserComment): HTMLDivElement {
        // convert datetime to this format 2022-01-01 12:00
        const datetime: string = dateToString(new Date(userComment.metadata.datetime));

        let comment: string = userComment.comment;
        if (userComment.comment.length > this.maxCommentLength) {
            comment = userComment.comment.slice(0, this.maxCommentLength) + `<span style="display: none;" class="comment-hidden-text">${userComment.comment.slice(this.maxCommentLength)}</span>` + ` <a class="read-more-comment" style="cursor: pointer;">read more...</a><a style="display: none;" class="read-less-comment">...read less.</a>`;
        }

        let loadRepliesLink: string = ""
        if (userComment.replies_to_this!.length > this.repliesPreviewLimit) {
            loadRepliesLink = `<a data-comment-id="${userComment.comment_id}" class="load-more-replies" style="cursor: pointer;">See ${userComment.replies_to_this!.length - this.repliesPreviewLimit} more replies</a>`
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
                <div class="like-holder">
                    <button class="like-button judgement-button">Like</button>
                    <span class="like-count">${userComment.metadata.likes}</span>
                </div>
                <div class="dislike-holder">
                    <button class="dislike-button judgement-button">Dislike</button>
                    <span class="dislike-count">${userComment.metadata.dislikes}</span>
                </div>
                ${loadRepliesLink}
            </div>
            <div class="comment-reply-form-holder"></div>
            <div class="comment-replies-holder"></div>
        </div>`) as HTMLDivElement;

        // TODO: this could be refactored out into a separate method using event delegation
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

    private async loadMoreReplies(commentId: string, nextToken: string): Promise<void> {
        const res: ServerRes = await getCommentReplies(commentId, this.repliesPreviewLimit, nextToken);
        if (!res.success) throw new Error(res.error);

        const repliesRes: UserComment[] = res.data.comments;
        const commentElement = document.getElementById(commentId)!;

        const repliesHolder = commentElement.querySelector(".comment-replies-holder")!;
        for (const reply of repliesRes) {
            const renderedReply = this.renderComment(reply);
            repliesHolder.appendChild(renderedReply);
        }

        const loadMoreRepliesLink = commentElement.querySelector(".load-more-replies") as HTMLAnchorElement;
        if (res.data.nextToken) {
            loadMoreRepliesLink.dataset.nextToken = res.data.nextToken;
        } else {
            loadMoreRepliesLink.remove();
        }
    }

    private judgeCommentFunctionality(): void {
        document.querySelector(".comment-section")!.addEventListener("click", async (e: Event) => {
            const target = e.target as HTMLButtonElement;

            const commentId = target.parentElement!.parentElement!.parentElement!.id;

            if (target.classList.contains("judgement-button")) {
                const judgement = target.classList.contains("like-button") ? "like" : "dislike";
                const res: ServerRes = await judgeComment(commentId, judgement);
                if (!res.success) throw new Error(res.error);

                console.log(res)
                console.log(res.data)

                const likeCount = target.parentElement!.parentElement!.querySelector(".like-count") as HTMLSpanElement;
                const dislikeCount = target.parentElement!.parentElement!.querySelector(".dislike-count") as HTMLSpanElement;

                likeCount.textContent = res.data.likes;
                dislikeCount.textContent = res.data.dislikes;
            }
        });
    }

    private reportCommentFunctionality(): void {
        let activeReportButton: HTMLButtonElement | null = null;

        document.querySelector("body")!.addEventListener("click", async (e: Event) => {
            const target = e.target as HTMLButtonElement;

            if (target.classList.contains("comment-action-report")) {
                // If the button is already yellow, send the report
                if (target.classList.contains("report-button-yellow")) {
                    const commentId = target.parentElement!.parentElement!.id;

                    const res: ServerRes = await reportComment(commentId, new Date().toISOString());
                    if (!res.success) throw new Error(res.error);

                    console.log("Comment reported successfully");

                    // Reset the button's appearance and remove the yellow class
                    target.style.backgroundColor = "";
                    target.classList.remove("report-button-yellow");
                    activeReportButton = null;
                } else {
                    // If the button is not yellow, make it yellow
                    target.style.backgroundColor = "yellow";
                    target.classList.add("report-button-yellow");

                    // Reset the previous active report button if any
                    if (activeReportButton) {
                        activeReportButton.style.backgroundColor = "";
                        activeReportButton.classList.remove("report-button-yellow");
                    }

                    // Set the current button as the active report button
                    activeReportButton = target;
                }
            } else {
                // If click is not on the report button and there's an active report button, reset the button's appearance and remove the yellow class
                if (activeReportButton) {
                    activeReportButton.style.backgroundColor = "";
                    activeReportButton.classList.remove("report-button-yellow");
                    activeReportButton = null;
                }
            }
        });
    }

}

(async () => {
    const res: ServerRes<UserInfo> = await getUserInfo();

    if (!res.success || !res.data) throw new Error(res.error);

    new CommentSectionHandler(res.data);
})();
