export default function buildPopulateObject(depth: number): any {
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
