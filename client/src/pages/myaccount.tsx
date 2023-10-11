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
} from '@components/pages/post';

import { theme } from '@styles/theme';

import CommentList from '@components/comments-section/CommentList';

import api_profile_photo from '@utils/api/upload/profile_photo';

const ProfileSection = styled.section`
    display: flex;
    align-items: center;
    width: 100%;
`;

const ProfilePhotoButton = styled.button`
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

const ProfileImageContainer = styled.div`
    position: relative;
    margin-right: 20px;

    &:hover ${ProfilePhotoButton} {
        display: block;
    }
`;

const ProfileImage = styled.img`
    width: 125px;
    height: 125px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 20px;
`;

const Icon = styled.span`
    font-size: 20px;
    vertical-align: middle;
    margin-right: 8px;
    color: #0077b6;
`;

const EditButton = styled(Button)`
    margin-left: 10px;
`;

const Account: React.FC = () => {
    const userData = useSelector((state: RootState) => state.user.data);
    const [selectedImage, setSelectedImage] = React.useState<File | null>(null);

    // redux loads userInfo as null two times before loading the actual data
    if (!userData) return (<Spinner />);

    const { userInfo, comments, commentsJudged, commentsCount } = userData;

    const profilePhoto: string = userInfo.latestProfilePhoto ?
        path.join(ROOT_PUBLIC, 'site-images/uploads/profile-photos', userInfo.latestProfilePhoto) :
        DEFAULT_PROFILE_IMAGE;

    const handleImageUpload = async () => {
        if (selectedImage) {
            try {
                const response = await api_profile_photo(
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
        { id: 'sdf', text: 'some comment', author: { id: userInfo.username, name: `${userInfo.name?.first || 'Unknown'} ${userInfo.name?.last || 'User'}`, profileImage: profilePhoto }, replies: [] },
        {
            id: 'sdf', text: 'some other comment', author: { id: userInfo.username, name: `${userInfo.name?.first || 'Unknown'} ${userInfo.name?.last || 'User'}`, profileImage: profilePhoto }, replies: [
                { id: 'sdf', text: 'some other comment', author: { id: userInfo.username, name: `${userInfo.name?.first || 'Unknown'} ${userInfo.name?.last || 'User'}`, profileImage: profilePhoto }, replies: [] },
            ]
        },
    ];

    // test data api not ready yet
    const geolocations: GeoLocation[] = [
        { ip: '0.0.0.0', city: 'Paris', country: 'France', flag: '🇫🇷', isp: 'ISP', firstUsed: new Date(), lastUsed: new Date(), countryCode: 'US', regionName: 'TX', org: 'asdf' },
        { ip: '1.1.1.1', city: 'Modesto', country: 'United States of America', flag: '🇺🇸', isp: 'ISP', firstUsed: new Date(), lastUsed: new Date(), countryCode: 'US', regionName: 'TX', org: 'asdf' },
    ];

    return (
        <PostContainer>
            <SideBarContainer>
                <SideBarSiteName fontSize='20px'>{`Dereck's Notes`}</SideBarSiteName>
                <SideBarAbout />
            </SideBarContainer>
            <Article>
                <h2>{userInfo.username}</h2>
                <ProfileSection>
                    <ProfileImageContainer>
                        <ProfileImage
                            src={selectedImage ? URL.createObjectURL(selectedImage) : profilePhoto}
                            alt={`${userInfo.name?.first || 'Unknown'} ${userInfo.name?.last || 'User'}`}
                        />
                        <ProfilePhotoButton onClick={handleEditImageClick}>Edit</ProfilePhotoButton>
                        {selectedImage && <Button onClick={handleImageUpload}>Upload</Button>}
                        <input id="profileImageUpload" type="file" onChange={handleImageChange} accept="image/*" style={{ display: 'none' }} />
                    </ProfileImageContainer>

                    <div>
                        <p>
                            <Icon as={FaUser} />
                            {userInfo.name?.first && userInfo.name?.last ? `${userInfo.name.first} ${userInfo.name.last}` : 'Unknown User'}
                            <EditButton>Edit</EditButton>
                        </p>
                        <p>
                            <Icon as={FaEnvelope} />
                            {userInfo.email?.address} {userInfo.email?.verified && '(Verified)'}
                            <EditButton>Edit</EditButton>
                        </p>
                    </div>
                </ProfileSection>

                <section>
                    <h3>
                        <Icon as={FaComment} />Your Comments
                    </h3>
                    <p>
                        Total comments: {commentsCount}
                    </p>
                    {/* <CommentList comments={userComments} currentUserId={userInfo.username} /> */}
                </section>

                <section>
                    <h3>
                        <Icon as={FaThumbsUp} /> Comments liked/disliked
                    </h3>
                    <p>
                        Total comments liked: {commentsJudged?.filter((comment: any) => comment.judgement === 'like').length || 0}
                    </p>
                    <p>
                        Total comments disliked: {commentsJudged?.filter((comment: any) => comment.judgement === 'dislike').length || 0}
                    </p>
                    {/* <CommentList comments={userComments.slice(1)} currentUserId={userInfo.username} /> */}
                </section>

                <GeoLocationsBlock geoLocations={geolocations} />
            </Article>
        </PostContainer>
    );
};

export default React.memo(Account);


const GeoLocationCard = styled.div`
    background-color: ${theme.container.background.colour.primary()};
    padding: 12px 15px;
    border-radius: 5px;
    margin-bottom: 10px;
    box-shadow: ${theme.container.shadow.box};
    border: 1px solid ${theme.container.border.colour.primary()};
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;

    /* &:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.12);
    } */
`;

const GeoInfo = styled.div`
    margin-bottom: 8px;

    & strong {
        margin-right: 5px;
    }

    &:last-child {
        margin-bottom: 0;
    }
`;

interface GeoLocationsBlockProps {
    geoLocations: GeoLocation[];
}

function GeoLocationsBlock({ geoLocations }: GeoLocationsBlockProps) {
    return (
        <section>
            <h3>
                <Icon as={FaMapPin} /> Geo Locations
            </h3>
            {geoLocations.map((location: GeoLocation, idx: number) => (
                <GeoLocationCard key={idx}>
                    <GeoInfo><strong>IP:</strong> {location.ip}</GeoInfo>
                    <GeoInfo><strong>City:</strong> {location.city}</GeoInfo>
                    <GeoInfo>
                        <strong>Country:</strong> {location.country} {location.flag}
                    </GeoInfo>
                    <GeoInfo><strong>ISP:</strong> {location.isp}</GeoInfo>
                    <GeoInfo><strong>First Used:</strong> {new Date(location.firstUsed).toLocaleString()}</GeoInfo>
                    <GeoInfo><strong>Last Used:</strong> {new Date(location.lastUsed).toLocaleString()}</GeoInfo>
                </GeoLocationCard>
            ))}
        </section>
    );
}