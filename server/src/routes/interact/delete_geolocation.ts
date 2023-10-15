import { Request, Response, Router } from 'express';
import User from '@models/User';
import isAuthenticated from '@utils/middleware/isAuthenticated';

const delete_geolocations = Router();

interface DeleteGeolocationsRequest {
    geolocationIds: string[];
}

delete_geolocations.delete('/delete_geolocations', isAuthenticated, async (req: Request, res: Response) => {
    try {
        const { geolocationIds } = req.body as DeleteGeolocationsRequest;

        if (!geolocationIds || !Array.isArray(geolocationIds)) {
            return res.status(400).json({ message: "Geolocation Ids are required." });
        }

        if (geolocationIds.length > 10) {
            return res.status(400).json({ message: "Cannot delete more than 50 geolocations at once." });
        }

        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized." });
        }

        const usertemp1 = await User.findOne({ _id: userId });
        console.log(usertemp1?.metadata);

        // use atomic operations to remove geolocations from user.metadata.geolocations
        // use user.metadata.geolocations[*]._id to remove geolocations from geolocations collection
        const updateResult = await User.updateOne(
            { _id: userId },
            { $pull: { "metadata.geolocations": { _id: { $in: geolocationIds } } } }
        );

        const usertemp = await User.findOne({ _id: userId });
        console.log(usertemp?.metadata);

        if (updateResult.modifiedCount === 0) {
            return res.status(400).json({ message: "Geolocations not found." });
        }

        return res.status(200).json({ message: "Geolocations deleted successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while deleting geolocations." });
    }
});

export default delete_geolocations;