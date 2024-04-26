const geolocationObj: GeolocationDTO = {
    ip: '0.0.0.0',
    country: 'United States',
    countryCode: 'US',
    flag: '🇺🇸',
    regionName: 'California',
    city: 'San Francisco',
    firstUsed: new Date(),
    lastUsed: new Date(),
    _id: '5f9c0b9b9b9b9b9b9b9b9b9b'
};

export function generateCommentObj(
    userId: string,
    comment: string,
    parentId?: string
) {
    return {
        childComments: [],
        parentComment: parentId || null,
        reportTarget: null,
        mentions: [],
        slug: 'test',
        content: [
            {
                comment
            } as ContentDTO
        ],
        geolocation: geolocationObj,
        userId,
        judgement: {},
        deleted: false
    } as CommentDTO;
}
