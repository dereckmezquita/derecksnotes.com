import mongoose, { connect } from 'mongoose';
import Comment from './models/Comment';
import User from './models/User';

console.log(User); // we have to use User for it to be registered with mongoose

export const connectToDB = async (uri: string) => {
    try {
        await mongoose.connect(uri);
        console.log("MongoDB Connected!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};

function buildPopulateObject(depth: number): any {
    if (depth <= 0) {
        return null;
    }

    let populateChildren = buildPopulateObject(depth - 1);

    let result = {
        path: 'childComments',
        populate: [
            {
                path: 'user',
                model: 'User',
                select: 'profilePhotos username'
            }
        ]
    };

    if (populateChildren) {
        result.populate.push(populateChildren);
    }

    return result;
}

const MONGO_URI = 'mongodb://localhost:27017/derecksnotes';

async function main(): Promise<void> {
    await connectToDB(MONGO_URI);

    const depth = 100;

    const topUserPopulate = {
        path: 'user',
        model: 'User',
        select: 'profilePhotos username'
    };

    const populateObj = buildPopulateObject(depth);

    // Fetch the top-level comments and populate the nested child comments and users.
    const comments = await Comment.find({ parentComment: null })
        .populate([topUserPopulate, populateObj])
        .exec();

    const commentObjects = comments.map(comment => comment.toObject({ virtuals: true }));
    console.log(JSON.stringify(commentObjects));
}

main();
