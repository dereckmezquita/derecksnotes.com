export { };

declare global {
    interface UserNameDTO {
        first: string | null;
        last: string | null;
    }

    interface UserEmailDTO {
        address: string;
        verified: boolean;
    }

    interface UserMetadataDTO {
        geolocations: GeolocationDTO[];
        lastConnected: Date;
    }

    interface UserPublicDTO {
        profilePhotos: string[];
        username: string;

        // Virtual
        latestProfilePhoto?: string | null;
    }

    interface UserDTO extends UserPublicDTO {
        name: UserNameDTO;
        email: UserEmailDTO;
        metadata: UserMetadataDTO;

        // should always delete password before sending to client
        password?: string;
    }
}