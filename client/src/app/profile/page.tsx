'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@context/AuthContext';
import { useRouter } from 'next/navigation';
import styled, { css } from 'styled-components';
import { api } from '@utils/api/api';
import { CommentType } from '@components/comments';
import { ProfileCommentList } from '@/components/profile/ProfileCommentList';

// ======== STYLED COMPONENTS ========

const PageContainer = styled.div`
    max-width: 1200px;
    margin: 30px auto;
    padding: 0 20px;
`;

const DashboardGrid = styled.div`
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 20px;

    @media (max-width: ${(props) => props.theme.container.breakpoints.medium}) {
        grid-template-columns: 1fr;
    }
`;

const SidebarContainer = styled.div`
    background: ${(props) => props.theme.container.background.colour.solid()};
    border-radius: ${(props) => props.theme.container.border.radius};
    box-shadow: ${(props) => props.theme.container.shadow.box};
    padding: 20px;
    height: fit-content;
`;

const MainContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const Card = styled.div`
    background: ${(props) => props.theme.container.background.colour.solid()};
    border-radius: ${(props) => props.theme.container.border.radius};
    box-shadow: ${(props) => props.theme.container.shadow.box};
    padding: 20px;
    overflow: hidden;
`;

const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
`;

const CardTitle = styled.h2`
    margin: 0;
    color: ${(props) => props.theme.text.colour.header()};
    font-size: ${(props) => props.theme.text.size.large};
    font-weight: ${(props) => props.theme.text.weight.bold};
`;

const TabsContainer = styled.div`
    display: flex;
    border-bottom: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    margin-bottom: 15px;
`;

interface TabProps {
    active: boolean;
}

const Tab = styled.button<TabProps>`
    padding: 8px 15px;
    background: none;
    border: none;
    border-bottom: 3px solid
        ${(props) =>
            props.active ? props.theme.theme_colours[5]() : 'transparent'};
    color: ${(props) =>
        props.active
            ? props.theme.text.colour.header()
            : props.theme.text.colour.light_grey()};
    font-weight: ${(props) =>
        props.active
            ? props.theme.text.weight.bold
            : props.theme.text.weight.normal};
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        color: ${(props) => props.theme.text.colour.header()};
        background: ${(props) =>
            props.theme.container.background.colour.light_contrast()};
    }
`;

const ProfileForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
`;

const Label = styled.label`
    font-weight: ${(props) => props.theme.text.weight.medium};
    color: ${(props) => props.theme.text.colour.primary()};
`;

const Input = styled.input`
    padding: 10px;
    border: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    border-radius: ${(props) => props.theme.container.border.radius};
    font-size: ${(props) => props.theme.text.size.normal};

    &:focus {
        outline: none;
        border-color: ${(props) => props.theme.theme_colours[5]()};
        box-shadow: 0 0 0 2px
            ${(props) =>
                props.theme.theme_colours[5](
                    undefined,
                    undefined,
                    undefined,
                    0.2
                )};
    }
`;

interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
    size?: 'small' | 'medium' | 'large';
    fullWidth?: boolean;
}

const getButtonColor = (variant: string, theme: any) => {
    switch (variant) {
        case 'primary':
            return theme.theme_colours[5]();
        case 'secondary':
            return theme.container.border.colour.primary();
        case 'danger':
            return theme.colours.error;
        case 'success':
            return theme.colours.success;
        case 'warning':
            return theme.colours.warning;
        default:
            return theme.theme_colours[5]();
    }
};

const Button = styled.button<ButtonProps>`
    padding: ${(props) =>
        props.size === 'small'
            ? '5px 10px'
            : props.size === 'large'
              ? '12px 20px'
              : '8px 15px'};
    background: ${(props) =>
        getButtonColor(props.variant || 'primary', props.theme)};
    color: ${(props) =>
        props.variant === 'secondary'
            ? props.theme.text.colour.primary()
            : '#fff'};
    border: none;
    border-radius: ${(props) => props.theme.container.border.radius};
    font-weight: ${(props) => props.theme.text.weight.medium};
    cursor: pointer;
    transition: all 0.2s ease;
    width: ${(props) => (props.fullWidth ? '100%' : 'auto')};

    &:hover {
        opacity: 0.9;
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const ActionBar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    flex-wrap: wrap;
    gap: 10px;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 10px;
`;

const SelectAll = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
`;

const Badge = styled.span`
    background: ${(props) =>
        props.theme.container.background.colour.light_contrast()};
    color: ${(props) => props.theme.text.colour.primary()};
    padding: 3px 8px;
    border-radius: 20px;
    font-size: ${(props) => props.theme.text.size.small};
    font-weight: ${(props) => props.theme.text.weight.medium};
`;

// Using shared comment components

const Pagination = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
`;

const PageNumber = styled.button<{ active?: boolean }>`
    width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 1px solid
        ${(props) =>
            props.active
                ? props.theme.theme_colours[5]()
                : props.theme.container.border.colour.primary()};
    background: ${(props) =>
        props.active ? props.theme.theme_colours[9]() : 'transparent'};
    color: ${(props) =>
        props.active
            ? props.theme.theme_colours[5]()
            : props.theme.text.colour.primary()};
    font-weight: ${(props) =>
        props.active
            ? props.theme.text.weight.bold
            : props.theme.text.weight.normal};
    cursor: pointer;

    &:hover {
        background: ${(props) =>
            props.theme.container.background.colour.light_contrast()};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

interface CommentItemProps {
    selected?: boolean;
    deleted?: boolean;
}

const CommentItem = styled.div<CommentItemProps>`
    border: 1px solid
        ${(props) =>
            props.selected
                ? props.theme.theme_colours[5]()
                : props.theme.container.border.colour.primary()};
    border-radius: ${(props) => props.theme.container.border.radius};
    padding: 15px;
    background: ${(props) =>
        props.selected
            ? props.theme.theme_colours[9]()
            : props.deleted
              ? '#f8f8f8'
              : props.theme.container.background.colour.content()};
    transition: all 0.2s ease;

    &:hover {
        border-color: ${(props) => props.theme.theme_colours[5]()};
    }
`;

const CommentHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
`;

const CommentMetadata = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const CommentDate = styled.span`
    color: ${(props) => props.theme.text.colour.light_grey()};
    font-size: ${(props) => props.theme.text.size.small};
`;

const CommentActions = styled.div`
    display: flex;
    gap: 5px;
`;

const CommentText = styled.p<{ deleted?: boolean }>`
    margin: 0 0 10px 0;
    color: ${(props) =>
        props.deleted
            ? props.theme.text.colour.light_grey()
            : props.theme.text.colour.primary()};
    font-style: ${(props) => (props.deleted ? 'italic' : 'normal')};
`;

const PostLink = styled.a`
    color: ${(props) => props.theme.text.colour.anchor()};
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: ${(props) => props.theme.text.size.small};

    &:hover {
        text-decoration: underline;
    }
`;

const EmptyState = styled.div`
    text-align: center;
    padding: 40px 20px;
    color: ${(props) => props.theme.text.colour.light_grey()};
`;

const Alert = styled.div<{ variant: 'error' | 'success' | 'warning' | 'info' }>`
    background: ${(props) => {
        switch (props.variant) {
            case 'error':
                return '#FDECEA';
            case 'success':
                return '#EDF7ED';
            case 'warning':
                return '#FFF4E5';
            case 'info':
                return '#E8F4FD';
            default:
                return '#E8F4FD';
        }
    }};

    color: ${(props) => {
        switch (props.variant) {
            case 'error':
                return '#D32F2F';
            case 'success':
                return '#2E7D32';
            case 'warning':
                return '#ED6C02';
            case 'info':
                return '#0288D1';
            default:
                return '#0288D1';
        }
    }};

    padding: 15px;
    border-radius: ${(props) => props.theme.container.border.radius};
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
`;

const Loading = styled.div`
    text-align: center;
    padding: 40px 20px;
    color: ${(props) => props.theme.text.colour.light_grey()};
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
    cursor: pointer;
    width: 18px;
    height: 18px;
    accent-color: ${(props) => props.theme.theme_colours[5]()};
`;

// ======== INTERFACES ========

// Using the shared CommentType interface

// ======== COMPONENT ========

export default function ProfilePage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const [userInfo, setUserInfo] = useState<any>(null);
    const [loadingData, setLoadingData] = useState(true);
    const [alert, setAlert] = useState<{
        show: boolean;
        message: string;
        variant: 'error' | 'success' | 'warning' | 'info';
    }>({
        show: false,
        message: '',
        variant: 'info'
    });

    // Profile data
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');

    // Comments data
    const [activeTab, setActiveTab] = useState('created');
    const [comments, setComments] = useState<CommentType[]>([]);
    const [selectedComments, setSelectedComments] = useState<string[]>([]);

    // Pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [allComments, setAllComments] = useState<CommentType[]>([]);
    const COMMENTS_PER_PAGE = 5;

    useEffect(() => {
        // If not logged in, redirect
        if (!loading && !user) {
            router.push('/');
        }
    }, [user, loading, router]);

    useEffect(() => {
        async function fetchUserInfo() {
            if (!user) return;

            try {
                setLoadingData(true);
                const userInfoRes = await api.get('/profile/user-info');
                setUserInfo(userInfoRes.data.user);
                setFirstName(userInfoRes.data.user.firstName || '');
                setLastName(userInfoRes.data.user.lastName || '');
                setEmail(userInfoRes.data.user.email || '');
            } catch (error) {
                console.error('Error fetching user data:', error);
                showAlert('Failed to load profile data', 'error');
            } finally {
                setLoadingData(false);
            }
        }

        fetchUserInfo();
    }, [user]);

    // Effect for fetching comments from the API
    useEffect(() => {
        async function fetchComments() {
            if (!user?.isVerified) return;

            try {
                setLoadingData(true);
                let endpoint = '/profile/comments';

                if (activeTab === 'liked') {
                    endpoint = '/profile/comments/liked';
                } else if (activeTab === 'disliked') {
                    endpoint = '/profile/comments/disliked';
                }

                const response = await api.get(endpoint);
                setAllComments(response.data);

                // Reset pagination when tab changes
                setPage(1);
                setSelectedComments([]);

                // Calculate total pages
                const total = Math.ceil(
                    response.data.length / COMMENTS_PER_PAGE
                );
                setTotalPages(total > 0 ? total : 1);
            } catch (error) {
                console.error(`Error fetching ${activeTab} comments:`, error);
                showAlert(`Failed to load ${activeTab} comments`, 'error');
            } finally {
                setLoadingData(false);
            }
        }

        if (user?.isVerified) {
            fetchComments();
        }
    }, [user, activeTab]);

    // Effect for pagination - update the visible comments based on the current page
    useEffect(() => {
        // Calculate start and end indices for slicing the comments array
        const startIndex = (page - 1) * COMMENTS_PER_PAGE;
        const endIndex = startIndex + COMMENTS_PER_PAGE;

        // Set the paginated comments
        setComments(allComments.slice(startIndex, endIndex));

        // Clear selected comments when page changes
        setSelectedComments([]);
    }, [page, allComments]);

    const showAlert = (
        message: string,
        variant: 'error' | 'success' | 'warning' | 'info'
    ) => {
        setAlert({
            show: true,
            message,
            variant
        });

        // Auto-hide after 5 seconds
        setTimeout(() => {
            setAlert((prev) => ({ ...prev, show: false }));
        }, 5000);
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await api.patch('/profile/update', {
                firstName,
                lastName,
                email
            });

            if (res.data.message.includes('verify')) {
                showAlert(
                    'Profile updated. Please verify your new email address.',
                    'warning'
                );
            } else {
                showAlert('Profile updated successfully!', 'success');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            showAlert('Failed to update profile', 'error');
        }
    };

    const handleVerifyEmail = async () => {
        try {
            const res = await api.post('/profile/verify-email');
            if (res.data.message === 'Verification email sent') {
                showAlert(
                    'Verification email sent! Please check your inbox.',
                    'success'
                );
            }
        } catch (error) {
            console.error('Error sending verification email:', error);
            showAlert('Failed to send verification email', 'error');
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/');
        } catch (error) {
            console.error('Error logging out:', error);
            showAlert('Failed to logout. Please try again.', 'error');
        }
    };

    const handleDeleteComment = async (id: string) => {
        try {
            await api.delete(`/profile/comments/${id}`);
            setComments((prev) =>
                prev.map((comment) =>
                    comment._id === id
                        ? { ...comment, deleted: true, text: '[deleted]' }
                        : comment
                )
            );
            showAlert('Comment deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting comment:', error);
            showAlert('Failed to delete comment', 'error');
        }
    };

    const handleBulkDelete = async () => {
        if (!selectedComments.length) return;

        if (
            !confirm(
                `Are you sure you want to delete ${selectedComments.length} comments?`
            )
        )
            return;

        try {
            // Use the new bulk delete endpoint
            const response = await api.post('/profile/comments/bulk-delete', {
                commentIds: selectedComments
            });

            // Update both all comments and displayed comments
            setAllComments((prev) =>
                prev.map((comment) =>
                    selectedComments.includes(comment._id)
                        ? { ...comment, deleted: true, text: '[deleted]' }
                        : comment
                )
            );

            setSelectedComments([]);
            showAlert(
                `${response.data.deletedCount} comments deleted successfully`,
                'success'
            );
        } catch (error) {
            console.error('Error bulk deleting comments:', error);
            showAlert('Failed to delete comments', 'error');
        }
    };

    // Bulk unlike comments
    const handleBulkUnlike = async () => {
        if (!selectedComments.length) return;

        if (
            !confirm(
                `Are you sure you want to unlike ${selectedComments.length} comments?`
            )
        )
            return;

        try {
            const response = await api.post('/profile/comments/bulk-unlike', {
                commentIds: selectedComments
            });

            // Refresh the comments list after unliking
            const likedRes = await api.get('/profile/comments/liked');
            setAllComments(likedRes.data);

            // Recalculate total pages
            const total = Math.ceil(likedRes.data.length / COMMENTS_PER_PAGE);
            setTotalPages(total > 0 ? total : 1);

            // If we're on a page that no longer exists, go to last page
            if (page > total && total > 0) {
                setPage(total);
            }

            setSelectedComments([]);
            showAlert(
                `${response.data.modifiedCount} comments unliked successfully`,
                'success'
            );
        } catch (error) {
            console.error('Error unliking comments:', error);
            showAlert('Failed to unlike comments', 'error');
        }
    };

    // Bulk remove dislikes
    const handleBulkUndislike = async () => {
        if (!selectedComments.length) return;

        if (
            !confirm(
                `Are you sure you want to remove your dislike from ${selectedComments.length} comments?`
            )
        )
            return;

        try {
            const response = await api.post(
                '/profile/comments/bulk-undislike',
                {
                    commentIds: selectedComments
                }
            );

            // Refresh the comments list after removing dislikes
            const dislikedRes = await api.get('/profile/comments/disliked');
            setAllComments(dislikedRes.data);

            // Recalculate total pages
            const total = Math.ceil(
                dislikedRes.data.length / COMMENTS_PER_PAGE
            );
            setTotalPages(total > 0 ? total : 1);

            // If we're on a page that no longer exists, go to last page
            if (page > total && total > 0) {
                setPage(total);
            }

            setSelectedComments([]);
            showAlert(
                `Removed dislike from ${response.data.modifiedCount} comments successfully`,
                'success'
            );
        } catch (error) {
            console.error('Error removing dislikes:', error);
            showAlert('Failed to remove dislikes', 'error');
        }
    };

    const getCommentLink = (comment: any) => {
        if (
            comment.post &&
            typeof comment.post === 'object' &&
            comment.post.slug
        ) {
            return comment.post.slug;
        }
        console.error('Missing slug for post', comment.post);
        return '/';
    };

    const toggleSelectComment = (id: string) => {
        setSelectedComments((prev) =>
            prev.includes(id)
                ? prev.filter((commentId) => commentId !== id)
                : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        const visibleNonDeletedComments = comments.filter((c) => !c.deleted);

        if (selectedComments.length === visibleNonDeletedComments.length) {
            // If all are selected, deselect all
            setSelectedComments([]);
        } else {
            // Otherwise, select all visible non-deleted comments
            setSelectedComments(
                visibleNonDeletedComments.map((comment) => comment._id)
            );
        }
    };

    if (loading) {
        return (
            <PageContainer>
                <Loading>Loading profile data...</Loading>
            </PageContainer>
        );
    }

    if (!user) {
        return null; // Will redirect via useEffect
    }

    return (
        <PageContainer>
            {alert.show && (
                <Alert variant={alert.variant}>{alert.message}</Alert>
            )}

            <DashboardGrid>
                {/* Left Sidebar */}
                <SidebarContainer>
                    <CardTitle>Profile Information</CardTitle>

                    {loadingData ? (
                        <Loading>Loading profile data...</Loading>
                    ) : (
                        <ProfileForm onSubmit={handleUpdateProfile}>
                            <FormGroup>
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                    id="firstName"
                                    value={firstName}
                                    onChange={(e) =>
                                        setFirstName(e.target.value)
                                    }
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    value={lastName}
                                    onChange={(e) =>
                                        setLastName(e.target.value)
                                    }
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </FormGroup>

                            <Button type="submit" variant="primary" fullWidth>
                                Update Profile
                            </Button>

                            {!user.isVerified && (
                                <div style={{ marginTop: '10px' }}>
                                    <Alert variant="warning">
                                        Your email is not verified. Verify to
                                        access all features.
                                    </Alert>
                                    <Button
                                        onClick={handleVerifyEmail}
                                        variant="secondary"
                                        fullWidth
                                        style={{ marginTop: '10px' }}
                                    >
                                        Verify Email
                                    </Button>
                                </div>
                            )}

                            <Button
                                onClick={handleLogout}
                                variant="danger"
                                fullWidth
                                style={{ marginTop: '15px' }}
                            >
                                Logout
                            </Button>
                        </ProfileForm>
                    )}
                </SidebarContainer>

                {/* Main Content */}
                <MainContainer>
                    {/* Comments Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>My Comments</CardTitle>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}
                            >
                                <Badge>{allComments.length} Comments</Badge>
                                <Button
                                    variant="secondary"
                                    size="small"
                                    onClick={() => {
                                        setLoadingData(true);
                                        // Re-trigger the comment fetching effect
                                        const fetchTab = activeTab;
                                        setActiveTab('temp');
                                        setTimeout(
                                            () => setActiveTab(fetchTab),
                                            10
                                        );
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M23 4v6h-6"></path>
                                        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                                    </svg>
                                </Button>
                            </div>
                        </CardHeader>

                        {!user.isVerified ? (
                            <Alert variant="warning">
                                You must verify your email to access comment
                                history.
                            </Alert>
                        ) : (
                            <>
                                <TabsContainer>
                                    <Tab
                                        active={activeTab === 'created'}
                                        onClick={() => setActiveTab('created')}
                                    >
                                        Created
                                    </Tab>
                                    <Tab
                                        active={activeTab === 'liked'}
                                        onClick={() => setActiveTab('liked')}
                                    >
                                        Liked
                                    </Tab>
                                    <Tab
                                        active={activeTab === 'disliked'}
                                        onClick={() => setActiveTab('disliked')}
                                    >
                                        Disliked
                                    </Tab>
                                </TabsContainer>

                                {loadingData ? (
                                    <Loading>Loading comments...</Loading>
                                ) : (
                                    <>
                                        {/* Action Bar */}
                                        {allComments.length > 0 &&
                                            activeTab === 'created' && (
                                                <ActionBar>
                                                    <SelectAll>
                                                        <Checkbox
                                                            checked={
                                                                selectedComments.length >
                                                                    0 &&
                                                                selectedComments.length ===
                                                                    comments.filter(
                                                                        (c) =>
                                                                            !c.deleted
                                                                    ).length
                                                            }
                                                            onChange={
                                                                toggleSelectAll
                                                            }
                                                        />
                                                        <span>Select All</span>
                                                        {selectedComments.length >
                                                            0 && (
                                                            <Badge>
                                                                {
                                                                    selectedComments.length
                                                                }{' '}
                                                                selected
                                                            </Badge>
                                                        )}
                                                    </SelectAll>

                                                    {selectedComments.length >
                                                        0 && (
                                                        <ButtonGroup>
                                                            <Button
                                                                variant="danger"
                                                                size="small"
                                                                onClick={
                                                                    handleBulkDelete
                                                                }
                                                            >
                                                                Delete Selected
                                                            </Button>
                                                        </ButtonGroup>
                                                    )}
                                                </ActionBar>
                                            )}

                                        {/* Bulk actions for liked/disliked tabs */}
                                        {allComments.length > 0 &&
                                            activeTab === 'liked' && (
                                                <ActionBar>
                                                    <SelectAll>
                                                        <Checkbox
                                                            checked={
                                                                selectedComments.length >
                                                                    0 &&
                                                                selectedComments.length ===
                                                                    comments.filter(
                                                                        (c) =>
                                                                            !c.deleted
                                                                    ).length
                                                            }
                                                            onChange={
                                                                toggleSelectAll
                                                            }
                                                        />
                                                        <span>Select All</span>
                                                        {selectedComments.length >
                                                            0 && (
                                                            <Badge>
                                                                {
                                                                    selectedComments.length
                                                                }{' '}
                                                                selected
                                                            </Badge>
                                                        )}
                                                    </SelectAll>

                                                    {selectedComments.length >
                                                        0 && (
                                                        <ButtonGroup>
                                                            <Button
                                                                variant="warning"
                                                                size="small"
                                                                onClick={
                                                                    handleBulkUnlike
                                                                }
                                                            >
                                                                Unlike Selected
                                                            </Button>
                                                        </ButtonGroup>
                                                    )}
                                                </ActionBar>
                                            )}

                                        {allComments.length > 0 &&
                                            activeTab === 'disliked' && (
                                                <ActionBar>
                                                    <SelectAll>
                                                        <Checkbox
                                                            checked={
                                                                selectedComments.length >
                                                                    0 &&
                                                                selectedComments.length ===
                                                                    comments.filter(
                                                                        (c) =>
                                                                            !c.deleted
                                                                    ).length
                                                            }
                                                            onChange={
                                                                toggleSelectAll
                                                            }
                                                        />
                                                        <span>Select All</span>
                                                        {selectedComments.length >
                                                            0 && (
                                                            <Badge>
                                                                {
                                                                    selectedComments.length
                                                                }{' '}
                                                                selected
                                                            </Badge>
                                                        )}
                                                    </SelectAll>

                                                    {selectedComments.length >
                                                        0 && (
                                                        <ButtonGroup>
                                                            <Button
                                                                variant="warning"
                                                                size="small"
                                                                onClick={
                                                                    handleBulkUndislike
                                                                }
                                                            >
                                                                Remove Dislike
                                                            </Button>
                                                        </ButtonGroup>
                                                    )}
                                                </ActionBar>
                                            )}

                                        {/* Comments List */}
                                        {allComments.length > 0 ? (
                                            <>
                                                {comments.length > 0 ? (
                                                    <ProfileCommentList
                                                        comments={comments}
                                                        currentUser={user}
                                                        selectedComments={
                                                            selectedComments
                                                        }
                                                        toggleSelectComment={
                                                            toggleSelectComment
                                                        }
                                                        onDelete={
                                                            handleDeleteComment
                                                        }
                                                        Checkbox={Checkbox}
                                                    />
                                                ) : (
                                                    <EmptyState>
                                                        No comments on this
                                                        page. Try a different
                                                        page.
                                                    </EmptyState>
                                                )}

                                                {/* Pagination Controls */}
                                                {totalPages > 1 && (
                                                    <Pagination>
                                                        <PageNumber
                                                            onClick={() =>
                                                                setPage((p) =>
                                                                    Math.max(
                                                                        1,
                                                                        p - 1
                                                                    )
                                                                )
                                                            }
                                                            disabled={
                                                                page === 1
                                                            }
                                                        >
                                                            &lt;
                                                        </PageNumber>

                                                        {/* Generate page numbers */}
                                                        {Array.from(
                                                            {
                                                                length: totalPages
                                                            },
                                                            (_, i) => (
                                                                <PageNumber
                                                                    key={i + 1}
                                                                    active={
                                                                        page ===
                                                                        i + 1
                                                                    }
                                                                    onClick={() =>
                                                                        setPage(
                                                                            i +
                                                                                1
                                                                        )
                                                                    }
                                                                >
                                                                    {i + 1}
                                                                </PageNumber>
                                                            )
                                                        )}

                                                        <PageNumber
                                                            onClick={() =>
                                                                setPage((p) =>
                                                                    Math.min(
                                                                        totalPages,
                                                                        p + 1
                                                                    )
                                                                )
                                                            }
                                                            disabled={
                                                                page ===
                                                                totalPages
                                                            }
                                                        >
                                                            &gt;
                                                        </PageNumber>
                                                    </Pagination>
                                                )}
                                            </>
                                        ) : (
                                            <EmptyState>
                                                {activeTab === 'created' &&
                                                    'You have not created any comments yet.'}
                                                {activeTab === 'liked' &&
                                                    'You have not liked any comments yet.'}
                                                {activeTab === 'disliked' &&
                                                    'You have not disliked any comments yet.'}
                                            </EmptyState>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </Card>
                </MainContainer>
            </DashboardGrid>
        </PageContainer>
    );
}
