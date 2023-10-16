import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import Link from 'next/link';
import styled from 'styled-components';

import IndicateLoading from '@components/atomic/IndicateLoading';

import { FaCheck, FaTimes } from 'react-icons/fa';
import {
    PostContainer, SideBarAbout, SideBarContainer,
    SideBarSiteName, Article
} from '@components/pages/post';
import EditableText from '@components/atomic/EditableText';

import { theme } from '@styles/theme';

import ProfileImage from '@components/pages/myaccount/ProfileImage';
import Comment from '@components/comments-section/Comment';
import ChangePassword from '@components/pages/myaccount/ChangePassword';

import api_me from '@utils/api/auth/me';
import api_update_user_info from '@utils/api/interact/update_user_info';
import get_comments_threads_by_id from '@utils/api/interact/get_comments_threads_by_id';

const ProfileSection = styled.section`
    display: flex;
    align-items: center;
    width: 100%;
`;

const Icon = styled.span`
    font-size: 20px;
    vertical-align: middle;
    margin-right: 8px;
    color: #0077b6;
`;

const StyledLink = styled(Link)`
    display: inline-block;
    padding: 5px 10px 5px 10px;
    margin: 5px 0;
    border-radius: 5px;
    text-decoration: none;
    color: ${theme.text.colour.muted_blue()};
    border: 1px solid ${theme.container.border.colour.primary()};
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;

    &:hover, &:focus {
        box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
    }
`;

const Account: React.FC = () => {
    const [userData, setUserData] = React.useState<MeDTO>();
    const [commentsByUser, setCommentsByUser] = React.useState<CommentsBySlugDTO>();
    const [commentsLikedByUser, setCommentsLikedByUser] = React.useState<CommentsBySlugDTO>();
    const [commentsDislikedByUser, setCommentsDislikedByUser] = React.useState<CommentsBySlugDTO>();

    const router = useRouter();

    useEffect(() => {
        const fetchMe = async () => {
            try {
                const res = await api_me();
                setUserData(res);
            } catch (error) {
                console.error('Error fetching user data:', error);
                router.push('/');
            }
        }

        fetchMe();
    }, []);

    useEffect(() => {
        const fetchComments = async () => {
            if (userData && userData.commentsIds) {
                const res = await get_comments_threads_by_id(userData.commentsIds, 5);
                setCommentsByUser(res);
                const res2 = await get_comments_threads_by_id(userData.commentsLikedIds, 5);
                setCommentsLikedByUser(res2);
                const res3 = await get_comments_threads_by_id(userData.commentsDislikedIds, 5);
                setCommentsDislikedByUser(res3);
            }
        }

        fetchComments();
    }, [userData]);

    if (!userData) return (<IndicateLoading />);

    // ------------------------------
    // ------------------------------
    const handleEditSubmit = async (obj: {
        username?: string,
        email?: string,
        firstName?: string,
        lastName?: string,
        geolocationId?: string
    }) => {
        try {
            const response = await api_update_user_info(obj);

            if (response) { // Assuming a truthy response means success.
                // Notify the user of success, if necessary.
                setUserData((prevUserData) => {
                    if (!prevUserData) return prevUserData;
                    return {
                        ...prevUserData,
                        user: {
                            ...prevUserData.user,
                            ...obj,
                            name: {
                                ...prevUserData.user.name,
                                first: obj.firstName !== undefined ? obj.firstName : prevUserData.user.name.first,
                                last: obj.lastName !== undefined ? obj.lastName : prevUserData.user.name.last
                            },
                            email: {
                                ...prevUserData.user.email,
                                address: obj.email !== undefined ? obj.email : prevUserData.user.email.address
                            }
                        }
                    };
                });
            }
        } catch (error) {
            console.error('Error updating user info:', error);
            // Inform the user of the error.
        }
    };

    const handleEmailVerification = async () => {
        // try {
        //     // This assumes api_verify_email takes an email string and returns a promise.
        //     await api_verify_email(userData.user.email.address);
        //     alert('Verification email sent! Please check your email.');
        //     // Optional: Update user data/UI if needed.
        // } catch (error) {
        //     console.error('Error sending verification email:', error);
        //     alert('Failed to send verification email. Please try again later.');
        // }
    };

    return (
        <PostContainer>
            <SideBarContainer>
                <SideBarSiteName fontSize='20px'>{`Dereck's Notes`}</SideBarSiteName>
                <SideBarAbout />
            </SideBarContainer>

            <Article>
                <h2>
                    <EditableText
                        initialText={userData.user.username}
                        onSubmit={(newText) => handleEditSubmit({ username: newText })}
                    />
                </h2>

                <ProfileSection>
                    <ProfileImage user={userData.user} setUserData={setUserData} />
                    <div>
                        <p>
                            <EditableText
                                initialText={userData.user.name.first ? userData.user.name.first : 'First'}
                                onSubmit={(newText) => handleEditSubmit({ firstName: newText })}
                            />
                            {' '}
                            <EditableText
                                initialText={userData.user.name.last ? userData.user.name.last : 'Last'}
                                onSubmit={(newText) => handleEditSubmit({ lastName: newText })}
                            />
                        </p>
                        <p>
                            <EditableText
                                initialText={userData.user.email.address}
                                onSubmit={(newText) => handleEditSubmit({ email: newText })}
                            />
                            {userData.user.email.verified ? (
                                <Icon as={FaCheck} style={{ color: 'green', marginLeft: '5px' }} />
                            ) : (
                                <Icon as={FaTimes} style={{ color: 'red', cursor: 'pointer', marginLeft: '5px' }} onClick={handleEmailVerification} />
                            )}
                        </p>
                    </div>
                </ProfileSection>

                <ChangePassword />

                <section>
                    <h3>
                        Comments
                    </h3>
                    <p>
                        Total: {userData.commentsCount}
                    </p>
                    {commentsByUser &&
                        Object.entries(groupCommentsBySlug(commentsByUser.comments))
                            .sort(([slugA, commentsA], [slugB, commentsB]) => {
                                // Sorting by the latest comment's date in each group
                                return new Date(commentsB[0].createdAt!).getTime() - new Date(commentsA[0].createdAt!).getTime();
                            })
                            .map(([slug, comments], idx) => (
                                <div key={slug}>
                                    <StyledLink href={slug}>
                                        {slug}
                                    </StyledLink>
                                    {comments.map(comment => (
                                        <Comment
                                            key={comment._id! + comment.latestContent?._id!}
                                            currentUserId={userData.user._id}
                                            commentObj={comment}
                                            depth={0}
                                        />
                                    ))}
                                </div>
                            ))
                    }
                </section>

                <section>
                    <h3>
                        Comments liked/disliked
                    </h3>
                    <p>
                        Liked: {userData.commentsLikedIds.length}
                    </p>
                    <p>
                        Disliked: {userData.commentsDislikedIds.length}
                    </p>
                    {commentsLikedByUser &&
                        Object.entries(groupCommentsBySlug(commentsLikedByUser.comments))
                            .sort(([slugA, commentsA], [slugB, commentsB]) => {
                                // Sorting by the latest comment's date in each group
                                return new Date(commentsB[0].createdAt!).getTime() - new Date(commentsA[0].createdAt!).getTime();
                            })
                            .map(([slug, comments], idx) => (
                                <div key={slug}>
                                    <StyledLink href={slug}>
                                        {slug}
                                    </StyledLink>
                                    {comments.map(comment => (
                                        <Comment
                                            key={comment._id! + comment.latestContent?._id!}
                                            currentUserId={userData.user._id}
                                            commentObj={comment}
                                            depth={0}
                                        />
                                    ))}
                                </div>
                            ))
                    }
                    {commentsDislikedByUser &&
                        Object.entries(groupCommentsBySlug(commentsDislikedByUser.comments))
                            .sort(([slugA, commentsA], [slugB, commentsB]) => {
                                // Sorting by the latest comment's date in each group
                                return new Date(commentsB[0].createdAt!).getTime() - new Date(commentsA[0].createdAt!).getTime();
                            })
                            .map(([slug, comments], idx) => (
                                <div key={slug}>
                                    <StyledLink href={slug}>
                                        {slug}
                                    </StyledLink>
                                    {comments.map(comment => (
                                        <Comment
                                            key={comment._id! + comment.latestContent?._id!}
                                            currentUserId={userData.user._id}
                                            commentObj={comment}
                                            depth={0}
                                        />
                                    ))}
                                </div>
                            ))
                    }
                </section>

                <GeoLocationsBlock geoLocations={userData.user.metadata.geolocations} />
            </Article>
        </PostContainer>
    );
};

function groupCommentsBySlug(comments: CommentPopUserDTO[]): Record<string, CommentPopUserDTO[]> {
    const groupedComments: Record<string, CommentPopUserDTO[]> = {};

    comments.forEach(comment => {
        if (!groupedComments[comment.slug]) {
            groupedComments[comment.slug] = [];
        }
        groupedComments[comment.slug].push(comment);
    });

    return groupedComments;
}

export default Account;

import { ActionButton } from '@components/comments-section/comment-styled';
import api_delete_geolocations from '@utils/api/interact/delete_geolocations';

const ActionContainer = styled.div`
    width: 100%; /* Full width */
    text-align: right; /* Align button to right */
`;

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
    geoLocations: GeolocationDTO[];
}

function GeoLocationsBlock({ geoLocations }: GeoLocationsBlockProps) {
    const [geoLocationsState, setGeoLocationsState] = React.useState<GeolocationDTO[]>(geoLocations);

    useEffect(() => {
        setGeoLocationsState(geoLocations);
    }, [geoLocations]);

    const handleDeleteGeolocation = async (id: string) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this geolocation?");
        if (!isConfirmed) return;

        const response = await api_delete_geolocations([id]);
        if (response) {
            setGeoLocationsState((prevGeoLocations) => {
                return prevGeoLocations.filter((geoLocation) => {
                    if (geoLocation._id === id) return false;
                });
            });
        }
    }

    return (
        <section>
            <h3>
                Geo Locations
            </h3>
            {geoLocationsState.map((location: GeolocationDTO, idx: number) => (
                <GeoLocationCard key={location._id}>
                    <GeoInfo>
                        <strong>IP:</strong> {location.ip}
                    </GeoInfo>
                    <GeoInfo>
                        <strong>City:</strong> {location.city}
                    </GeoInfo>
                    <GeoInfo>
                        <strong>Country:</strong> {location.country} {location.flag}
                    </GeoInfo>
                    <GeoInfo>
                        <strong>ISP:</strong> {location.isp}
                    </GeoInfo>
                    <GeoInfo>
                        <strong>First Used:</strong> {location.firstUsed ? new Date(location.firstUsed).toLocaleString() : "???"}
                    </GeoInfo>
                    <GeoInfo>
                        <strong>Last Used:</strong> {location.lastUsed ? new Date(location.lastUsed).toLocaleString() : "???"}
                    </GeoInfo>
                    <ActionContainer>
                        <ActionButton style={{ alignItems: 'right' }} onClick={() => handleDeleteGeolocation(location._id as string)}>delete</ActionButton>
                    </ActionContainer>
                </GeoLocationCard>
            ))}
        </section>
    );
}