import React, { useState, useRef, ChangeEvent } from 'react';
import styled from 'styled-components';
import path from 'path';
import { DEFAULT_PROFILE_IMAGE, ROOT_PUBLIC } from '@constants/config';
import api_profile_photo from '@utils/api/upload/profile_photo';

const ProfileImageWindow = styled.img`
    width: 125px;
    height: 125px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 20px;
`;

const ProfilePhotoButton = styled.button`
    position: absolute;
    bottom: 5px;
    right: 5px;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    border-radius: 5px;
    padding: 2px 5px;
    font-size: 12px;
    display: none;
    cursor: pointer;
`;

const ProfileImageContainer = styled.div`
    position: relative;
    margin-right: 20px;

    &:hover ${ProfilePhotoButton} {
        display: block;
    }
`;

interface ProfileImageComponentProps {
    user: any; // Your user type here
    setUserData: React.Dispatch<React.SetStateAction<any>>; // Adjust according to your user type
}

const ProfileImage: React.FC<ProfileImageComponentProps> = ({
    user,
    setUserData
}) => {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const inputFileRef = useRef<HTMLInputElement>(null);

    const profilePhoto: string = user.latestProfilePhoto
        ? path.join(
              ROOT_PUBLIC,
              'site-images/uploads/profile-photos',
              user.latestProfilePhoto
          )
        : DEFAULT_PROFILE_IMAGE;

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedImage(event.target.files[0]);
        }
    };

    const handleImageUpload = async () => {
        if (selectedImage) {
            try {
                const response = (await api_profile_photo(
                    selectedImage,
                    (progress: number) => {
                        console.log(`Upload progress: ${progress}%`);
                    }
                )) as { message: string; imageName: string };

                if (response.imageName) {
                    setUserData((prevData: any) => ({
                        ...prevData,
                        user: {
                            ...prevData.user,
                            latestProfilePhoto: response.imageName
                        }
                    }));
                    setSelectedImage(null);
                }
            } catch (error) {
                console.error('Error uploading profile photo:', error);
            }
        }
    };

    const handleEditImageClick = () => {
        inputFileRef.current?.click();
    };

    return (
        <ProfileImageContainer>
            <ProfileImageWindow
                src={
                    selectedImage
                        ? URL.createObjectURL(selectedImage)
                        : profilePhoto
                }
                alt={`${user.name?.first || 'First'} ${user.name?.last || 'Last'}`}
            />
            {selectedImage ? (
                <ProfilePhotoButton onClick={handleImageUpload}>
                    Upload
                </ProfilePhotoButton>
            ) : (
                <ProfilePhotoButton onClick={handleEditImageClick}>
                    Edit
                </ProfilePhotoButton>
            )}
            <input
                ref={inputFileRef}
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                style={{ display: 'none' }}
            />
        </ProfileImageContainer>
    );
};

export default ProfileImage;
