import path from 'path';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@store/store';

import Button from '@components/atomic/Button';
import Spinner from '@components/atomic/Spinner';

import { DEFAULT_PROFILE_IMAGE, ROOT_PUBLIC } from '@constants/config';

// These icons are placeholders. You can replace them with suitable ones.
import {
    FaUser, FaEnvelope, FaComment,
    FaMapPin, FaThumbsUp, FaThumbsDown
} from 'react-icons/fa';
import {
    PostContainer, SideBarAbout, SideBarContainer,
    SideBarSiteName, Article
} from '@components/post-elements/post';

import CommentList from '@components/comments-section/CommentList';

import api_upload_profile_photo from '@utils/api/upload/profile_photo';

const EditImageButton = styled.button`
    position: absolute;
    bottom: 5px;
    right: 5px;
    background-color: rgba(0,0,0,0.5);
    color: white;
    border: none;
    border-radius: 5px;
    padding: 2px 5px;
    font-size: 12px;
    display: none;
    cursor: pointer;
`;

const HiddenFileInput = styled.input`
    display: none;
`;

const ProfileSection = styled.section`
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    width: 100%;

    ${EditImageButton}:hover {
        display: block;
    }
`;

const ProfileImageContainer = styled.div`
    position: relative;
    margin-right: 20px;

    &:hover ${EditImageButton} {
        display: block;
    }
`;
const ProfileImage = styled.img`
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 20px;
`;

const InfoBlock = styled.div`
    margin-bottom: 20px;
`;

const GeoLocation = styled.div`
    background: #f4f4f4;
    padding: 10px;
    border-radius: 6px;
    margin-bottom: 10px;
`;

const CommentSection = styled.div`
    background: #f9f9f9;
    padding: 10px;
    border-radius: 6px;
    margin-bottom: 10px;
`;

const CommentHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Icon = styled.span`
    font-size: 20px;
    vertical-align: middle;
    margin-right: 8px;
    color: #0077b6;
`;

const ThumbUpIcon = styled(FaThumbsUp)`
    margin-bottom: 2px;
`;

const ThumbDownIcon = styled(FaThumbsDown)`
    margin-top: 2px;
    margin-left: 10px;
`;

const EditButton = styled(Button)`
    margin-left: 10px;
`;

const Account: React.FC = () => {
    const userInfo = useSelector((state: RootState) => state.user.data);
    const [selectedImage, setSelectedImage] = React.useState<File | null>(null);

    // redux loads userInfo as null two times before loading the actual data
    if (!userInfo) return (<Spinner />);

    const { name, profilePhotos, email, username, metadata } = userInfo as UserInfo;

    const profilePhoto: string = profilePhotos.length > 0 ?
        path.join(ROOT_PUBLIC, 'site-images/uploads/profile-photos', profilePhotos[profilePhotos.length - 1]) :
        DEFAULT_PROFILE_IMAGE;

    const handleImageUpload = async () => {
        if (selectedImage) {
            try {
                const response = await api_upload_profile_photo(
                    selectedImage,
                    (progress) => {
                        console.log(`Upload progress: ${progress}%`);
                        // You can set a state here to update the UI with progress
                    }
                );
                console.log(response.imageName)
                // Here, you might want to update the user state or inform the user that the upload was successful.
            } catch (error) {
                console.error('Error uploading profile photo:', error);
                // Inform the user of the error.
            }
        }
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log('handleImageChange triggered');
        if (event.target.files && event.target.files[0]) {
            setSelectedImage(event.target.files[0]);
            handleImageUpload();
        }
    };

    const handleEditImageClick = () => {
        document.getElementById('profileImageUpload')?.click();
    };

    // here we would get their comments from the api
    const userComments = [
        { id: 'sdf', text: 'some comment', author: { id: userInfo.id, name: `${name?.first || 'Unknown'} ${name?.last || 'User'}`, profileImage: profilePhoto }, replies: [] },
        { id: 'sdf', text: 'some other comment', author: { id: userInfo.id, name: `${name?.first || 'Unknown'} ${name?.last || 'User'}`, profileImage: profilePhoto }, replies: [
            { id: 'sdf', text: 'some other comment', author: { id: userInfo.id, name: `${name?.first || 'Unknown'} ${name?.last || 'User'}`, profileImage: profilePhoto }, replies: [] },
        ] },
    ];
    
    return (
        <PostContainer>
            <SideBarContainer>
                <SideBarSiteName fontSize='20px'>{`Dereck's Notes`}</SideBarSiteName>
                <SideBarAbout />
            </SideBarContainer>
            <Article>
                <h2>{username}</h2>
                <ProfileSection>
                    <ProfileImageContainer>
                        <ProfileImage
                            src={selectedImage ? URL.createObjectURL(selectedImage) : profilePhoto}
                            alt={`${name?.first || 'Unknown'} ${name?.last || 'User'}`}
                        />
                        <EditImageButton onClick={handleEditImageClick}>Edit</EditImageButton>
                        {selectedImage && <Button onClick={handleImageUpload}>Upload</Button>}
                        <HiddenFileInput id="profileImageUpload" type="file" onChange={handleImageChange} accept="image/*" />
                    </ProfileImageContainer>

                    <div>
                        <p>
                            <Icon as={FaUser} />
                            {name?.first && name?.last ? `${name.first} ${name.last}` : 'Unknown User'}
                            <EditButton>Edit</EditButton>
                        </p>
                        <p>
                            <Icon as={FaEnvelope} />
                            {email?.address} {email?.verified && '(Verified)'}
                            <EditButton>Edit</EditButton>
                        </p>
                    </div>
                </ProfileSection>

                <InfoBlock>
                    <h3>
                        <Icon as={FaComment} />Your Comments
                    </h3>
                    <p>You've made a total of {metadata.numberOfComments} comments.</p>
                    <CommentList comments={userComments} currentUserId={userInfo.username} />
                    <h3>
                        <Icon as={FaThumbsUp} /> Comments liked/disliked
                    </h3>
                </InfoBlock>

                <InfoBlock>
                    <h3>
                        <Icon as={FaMapPin} /> Geo Locations
                    </h3>
                    {metadata.geoLocations.map((location: GeoLocation, idx: number) => (
                        <GeoLocation key={idx}>
                            <strong>IP:</strong> {location.ip}<br />
                            <strong>City:</strong> {location.city}<br />
                            <strong>Country:</strong> {location.country} <img src={location.flag} alt={location.country} width="20" />
                            <br />
                            <strong>ISP:</strong> {location.isp}<br />
                            <strong>First Used:</strong> {new Date(location.firstUsed).toLocaleString()}<br />
                            <strong>Last Used:</strong> {new Date(location.lastUsed).toLocaleString()}
                        </GeoLocation>
                    ))}
                </InfoBlock>
            </Article>
        </PostContainer>
    );
};

export default React.memo(Account);