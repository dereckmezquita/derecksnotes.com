'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@context/AuthContext';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { api } from '@utils/api/api';

const Container = styled.div`
    width: 70%;
    margin: 20px auto;
    padding: 20px;
    background: ${(props) => props.theme.container.background.colour.content()};
    border: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    border-radius: 5px;
`;

const Section = styled.div`
    margin-bottom: 20px;
`;

const Heading = styled.h2`
    margin-bottom: 10px;
`;

const ProfileForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const Input = styled.input`
    padding: 5px;
    border: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    border-radius: 3px;
`;

const Button = styled.button`
    padding: 5px 10px;
    background: ${(props) => props.theme.theme_colours[5]()};
    color: #fff;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    &:hover {
        background: ${(props) =>
            props.theme.theme_colours[5](undefined, undefined, 80)};
    }
`;

const CommentList = styled.ul`
    list-style: none;
    padding: 0;
`;

const CommentItem = styled.li`
    border-bottom: 1px solid #ccc;
    padding: 10px 0;
`;

const LinkToPost = styled.a`
    color: ${(props) => props.theme.text.colour.anchor()};
    text-decoration: underline;
    cursor: pointer;
`;

export default function ProfilePage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [userInfo, setUserInfo] = useState<any>(null);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');

    const [createdComments, setCreatedComments] = useState<any[]>([]);
    const [likedComments, setLikedComments] = useState<any[]>([]);
    const [dislikedComments, setDislikedComments] = useState<any[]>([]);

    useEffect(() => {
        // If not logged in, redirect
        if (!loading && !user) {
            router.push('/');
        }
    }, [user, loading, router]);

    useEffect(() => {
        async function fetchBasicData() {
            if (!user) return;
            // Fetch user info regardless of verification status
            const userInfoRes = await api.get('/profile/user-info');
            setUserInfo(userInfoRes.data.user);
            setFirstName(userInfoRes.data.user.firstName || '');
            setLastName(userInfoRes.data.user.lastName || '');
            setEmail(userInfoRes.data.user.email || '');

            // If the user is verified, we can fetch their comments data
            if (user.isVerified) {
                const createdRes = await api.get('/profile/comments');
                setCreatedComments(createdRes.data);

                const likedRes = await api.get('/profile/comments/liked');
                setLikedComments(likedRes.data);

                const dislikedRes = await api.get('/profile/comments/disliked');
                setDislikedComments(dislikedRes.data);
            }
        }
        fetchBasicData();
    }, [user]);

    if (!user) {
        return <div>Loading...</div>;
    }

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await api.patch('/profile/update', {
            firstName,
            lastName,
            email
        });

        if (res.data.message.includes('verify')) {
            alert('Profile updated. Please verify your new email address.');
        } else {
            alert('Profile updated successfully!');
        }
    };

    const handleDeleteComment = async (id: string) => {
        if (!confirm('Are you sure you want to delete this comment?')) return;
        await api.delete(`/profile/comments/${id}`);
        setCreatedComments((prev) => prev.filter((c) => c._id !== id));
    };

    const handleVerifyEmail = async () => {
        // Trigger sending verification email
        const res = await api.post('/profile/verify-email');
        if (res.data.message === 'Verification email sent') {
            alert('Verification email sent! Please check your inbox.');
        }
    };

    const getCommentLink = (comment: any) => {
        // Use the slug from the populated post object
        if (
            comment.post &&
            typeof comment.post === 'object' &&
            comment.post.slug
        ) {
            return comment.post.slug;
        }
        // If for some reason the slug isn't available, log the issue
        console.error('Missing slug for post', comment.post);
        return '/';
    };

    return (
        <Container>
            <Section>
                <Heading>User Profile</Heading>
                {userInfo ? (
                    <>
                        <ProfileForm onSubmit={handleUpdateProfile}>
                            <label>
                                First Name:
                                <Input
                                    value={firstName}
                                    onChange={(e) =>
                                        setFirstName(e.target.value)
                                    }
                                />
                            </label>
                            <label>
                                Last Name:
                                <Input
                                    value={lastName}
                                    onChange={(e) =>
                                        setLastName(e.target.value)
                                    }
                                />
                            </label>
                            <label>
                                Email:
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </label>
                            <Button type="submit">Update Profile</Button>
                        </ProfileForm>
                        {!user.isVerified && (
                            <div style={{ marginTop: '10px' }}>
                                <p>Your email is not verified.</p>
                                <Button onClick={handleVerifyEmail}>
                                    Verify Email
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    // If userInfo is null (loading or error), show something minimal
                    <div>Loading profile data...</div>
                )}
            </Section>

            {user.isVerified && userInfo && (
                <>
                    <Section>
                        <Heading>Your Comments</Heading>
                        {createdComments.length > 0 ? (
                            <CommentList>
                                {createdComments.map((comment) => (
                                    <CommentItem key={comment._id}>
                                        <p>
                                            {comment.deleted
                                                ? '[deleted]'
                                                : comment.text}
                                        </p>
                                        <p>
                                            <LinkToPost
                                                href={getCommentLink(comment)}
                                            >
                                                View Post
                                            </LinkToPost>
                                        </p>
                                        {!comment.deleted && (
                                            <Button
                                                onClick={() =>
                                                    handleDeleteComment(
                                                        comment._id
                                                    )
                                                }
                                            >
                                                Delete
                                            </Button>
                                        )}
                                    </CommentItem>
                                ))}
                            </CommentList>
                        ) : (
                            <p>You have not created any comments yet.</p>
                        )}
                    </Section>

                    <Section>
                        <Heading>Comments You Liked</Heading>
                        {likedComments.length > 0 ? (
                            <CommentList>
                                {likedComments.map((comment) => (
                                    <CommentItem key={comment._id}>
                                        <p>
                                            {comment.deleted
                                                ? '[deleted]'
                                                : comment.text}
                                        </p>
                                        <p>
                                            <LinkToPost
                                                href={getCommentLink(comment)}
                                            >
                                                View Post
                                            </LinkToPost>
                                        </p>
                                    </CommentItem>
                                ))}
                            </CommentList>
                        ) : (
                            <p>You have not liked any comments yet.</p>
                        )}
                    </Section>

                    <Section>
                        <Heading>Comments You Disliked</Heading>
                        {dislikedComments.length > 0 ? (
                            <CommentList>
                                {dislikedComments.map((comment) => (
                                    <CommentItem key={comment._id}>
                                        <p>
                                            {comment.deleted
                                                ? '[deleted]'
                                                : comment.text}
                                        </p>
                                        <p>
                                            <LinkToPost
                                                href={getCommentLink(comment)}
                                            >
                                                View Post
                                            </LinkToPost>
                                        </p>
                                    </CommentItem>
                                ))}
                            </CommentList>
                        ) : (
                            <p>You have not disliked any comments yet.</p>
                        )}
                    </Section>
                </>
            )}

            {!user.isVerified && userInfo && (
                <p>
                    You can view and update your profile data, but you must
                    verify your email before interacting with comments and other
                    features.
                </p>
            )}
        </Container>
    );
}
