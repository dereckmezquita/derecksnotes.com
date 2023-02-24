import { Collection, ObjectId, Filter, Document } from 'mongodb';

export const page = async (
    collection: Collection,
    filter: Filter<Document> = {},
    pageSize: number,
    nextID?: ObjectId
): Promise<PageData> => {
    if (nextID) filter['_id'] = { $lt: nextID };

    const docs: any[] = await collection
        .find(filter)
        .sort({ _id: -1 })
        .limit(pageSize + 1)
        .toArray();

    nextID = undefined;

    if (docs[(pageSize + 1) - 1]) {
        nextID = docs[(pageSize + 1) - 2]['_id'];
        docs.splice(-1, 1); // remove last one
    }

    for (const doc of docs) {
        delete doc['_id'];
    }

    return { docs: docs, nextID: nextID };
}