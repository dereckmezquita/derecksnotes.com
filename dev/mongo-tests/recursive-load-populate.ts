import mongoose, { connect } from 'mongoose';
import Comment from './models/Comment';
import User from './models/User';

console.log(User);

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
                model: 'User'
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

    // Define the depth of child comments you want to populate. 
    // For instance, a value of 3 will get top-level comments, their children, 
    // the children's children, and the respective users for each comment.
    const depth = 3;

    const populateObj = buildPopulateObject(depth);

    // Fetch the top-level comments and populate the nested child comments and users.
    const comments = await Comment.find({ parentComment: null })
        .populate(populateObj)
        .exec();

    const commentObjects = comments.map(comment => comment.toObject({ virtuals: true }));
    console.log(JSON.stringify(commentObjects));
}

main();
