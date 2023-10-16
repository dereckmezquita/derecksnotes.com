import { API_PREFIX } from "@constants/config";

const api_delete_geolocations = async (geolocationIds: string[]) => {
    try {
        if (!geolocationIds || !Array.isArray(geolocationIds) || geolocationIds.length === 0) {
            throw new Error("Geolocation Ids are required.");
        }

        const options: any = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ geolocationIds }),
            credentials: 'include',
        }

        const response = await fetch(API_PREFIX + '/interact/delete_geolocations', options)

        if (!response.ok) {
            throw new Error("Something went wrong while deleting the geolocations.");
        }

        const data = await response.json();

        return data;
    } catch (error) {
        throw error;
    }
}

export default api_delete_geolocations;