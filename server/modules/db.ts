
import type { Collection, ObjectId, Filter, FindOptions, Document } from 'mongodb';

export const page = async (collection: Collection, filter: Filter<Document> = {}, options: FindOptions = {}, size: number, nextID?: ObjectId): Promise<{ docs: Document[], nextID: ObjectId }> => {
    if (nextID) filter['_id'] = {$lt: nextID};

    const docs = await collection.find(filter, options).sort({_id: 1}).limit(size).toArray();
    const nextID2 = docs.at(-1)?._id as ObjectId;

    return { docs: docs, nextID: nextID2 };
}
