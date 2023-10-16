export function generateCommentObj(userId: string, comment: string, parentId?: string) {
    return {
        childComments: [],
        parentComment: parentId || null,
        reportTarget: null,
        mentions: [],
        slug: 'test',
        content: [
            {
                comment,
            } as ContentDTO,
        ],
        userId,
        judgement: {},
        deleted: false,
    } as CommentDTO;
}