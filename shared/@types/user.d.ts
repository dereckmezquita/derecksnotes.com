export { };

declare global {
    interface UserInfo {
        name: {
            first: string | null;
            last: string | null;
        };
        profilePhotos: string[];
        email: {
            address: string; // must be unique
            verified: boolean;
        },
        username: string; // must be unique
        password?: string; // we don't send it back to user
        metadata: {
            geoLocations: GeoLocation[];
            lastConnected: Date;
            numberOfComments?: number;
            commentsJudged?: {
                commentId: string;
                judgement: 'like' | 'dislike';
            }[];
        },
        latestProfilePhoto?: string; // virtual
    }
}