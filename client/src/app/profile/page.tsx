'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@context/AuthContext';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { api } from '@utils/api/api';
import { CommentType } from '@components/comments';
import { ProfileCommentList } from '@/components/profile/ProfileCommentList';
import { toast } from 'sonner';
import Link from 'next/link';
import {
    PostContainer,
    SideBarContainer,
    Article
} from '@components/pages/posts-dictionaries';

// Import shared admin-style components
import {
    Button,
    ButtonGroup,
    Badge,
    FormGroup,
    Label,
    Input,
    Pagination,
    PageButton,
    EmptyState as AdminEmptyState,
    LoadingContainer,
    LoadingSpinner,
    LoadingText,
    ModalBackdrop,
    ModalContent,
    ModalTitle,
    ModalBody,
    Checkbox,
    ActionBar,
    SidebarTitle,
    SidebarNav,
    SidebarLink,
    SidebarDivider,
    AdminMain,
    AdminHeader,
    AdminTitle
} from '../admin/components/AdminStyles';

// ======== STYLED COMPONENTS (Profile-specific) ========

// Responsive container for profile page - stacks on mobile
const ProfileContainer = styled(PostContainer)`
    @media (max-width: 900px) {
        flex-direction: column;
    }
`;

// Override the default hide behavior to make sidebar visible and responsive
const ProfileSidebar = styled(SideBarContainer)`
    text-align: left;
    min-height: 600px;

    /* Override the base display:none with !important */
    @media (max-width: 1096px) {
        display: block !important;
        width: 100%;
        min-height: auto;
        border-bottom: 1px dashed
            ${(props) => props.theme.container.border.colour.primary()};
        padding: 20px;
    }
`;

// Use AdminMain for the profile content area
const ProfileMain = styled(AdminMain)``;

const ProfileForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: ${(props) => props.theme.container.spacing.medium};
`;

const SelectAll = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
`;

const EmptyState = styled(AdminEmptyState)`
    text-align: center;
    padding: 40px 20px;
`;

const Loading = styled.div`
    text-align: center;
    padding: 40px 20px;
    color: ${(props) => props.theme.text.colour.light_grey()};
`;

// Account Settings styled components
const SettingsSection = styled.div`
    margin-bottom: ${(props) => props.theme.container.spacing.large};
    padding-bottom: ${(props) => props.theme.container.spacing.large};
    border-bottom: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};

    &:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
    }
`;

const SettingsTitle = styled.h3`
    margin: 0 0 ${(props) => props.theme.container.spacing.medium} 0;
    color: ${(props) => props.theme.text.colour.header()};
    font-size: ${(props) => props.theme.text.size.large};
`;

const SettingsDescription = styled.p`
    margin: 0 0 ${(props) => props.theme.container.spacing.medium} 0;
    color: ${(props) => props.theme.text.colour.light_grey()};
    font-size: ${(props) => props.theme.text.size.normal};
`;

const SessionList = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${(props) => props.theme.container.spacing.small};
`;

const SessionItem = styled.div<{ $current?: boolean }>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${(props) => props.theme.container.spacing.medium};
    border: 1px solid
        ${(props) =>
            props.$current
                ? props.theme.theme_colours[5]()
                : props.theme.container.border.colour.primary()};
    border-radius: ${(props) => props.theme.container.border.radius};
    background: ${(props) =>
        props.$current
            ? props.theme.theme_colours[9]()
            : props.theme.container.background.colour.content()};
`;

const SessionInfo = styled.div`
    flex: 1;
`;

const SessionDevice = styled.div`
    font-weight: ${(props) => props.theme.text.weight.medium};
    color: ${(props) => props.theme.text.colour.primary()};
    display: flex;
    align-items: center;
    gap: ${(props) => props.theme.container.spacing.small};
`;

const SessionMeta = styled.div`
    font-size: ${(props) => props.theme.text.size.small};
    color: ${(props) => props.theme.text.colour.light_grey()};
    margin-top: 4px;
`;

const CurrentBadge = styled.span`
    background: ${(props) => props.theme.theme_colours[5]()};
    color: white;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: ${(props) => props.theme.text.weight.medium};
`;

const RoleBadge = styled.span<{
    $variant?: 'admin' | 'moderator' | 'trusted' | 'user';
}>`
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: ${(props) => props.theme.text.weight.medium};
    margin-right: 5px;

    ${(props) => {
        switch (props.$variant) {
            case 'admin':
                return `
                    background: ${props.theme.colours.error}20;
                    color: ${props.theme.colours.error};
                `;
            case 'moderator':
                return `
                    background: ${props.theme.colours.warning}20;
                    color: ${props.theme.colours.warning};
                `;
            case 'trusted':
                return `
                    background: ${props.theme.colours.success}20;
                    color: ${props.theme.colours.success};
                `;
            default:
                return `
                    background: ${props.theme.container.background.colour.light_contrast()};
                    color: ${props.theme.text.colour.light_grey()};
                `;
        }
    }}
`;

const DangerZone = styled.div`
    margin-top: ${(props) => props.theme.container.spacing.large};
    padding: ${(props) => props.theme.container.spacing.large};
    border: 1px solid ${(props) => props.theme.colours.error}40;
    border-radius: ${(props) => props.theme.container.border.radius};
    background: ${(props) => props.theme.colours.error}10;
`;

const DangerTitle = styled.h3`
    color: ${(props) => props.theme.colours.error};
    margin: 0 0 ${(props) => props.theme.container.spacing.small} 0;
`;

const DangerDescription = styled.p`
    color: ${(props) => props.theme.text.colour.light_grey()};
    margin: 0 0 ${(props) => props.theme.container.spacing.medium} 0;
`;

const ModalText = styled.p`
    margin: 0 0 20px 0;
    color: ${(props) => props.theme.text.colour.primary()};
`;

const ModalButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
`;

// ======== MINI ANALYTICS STYLES ========

const MiniAnalyticsContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: ${(props) => props.theme.container.spacing.small};
    margin-bottom: ${(props) => props.theme.container.spacing.medium};
    padding: ${(props) => props.theme.container.spacing.medium};
    background: ${(props) =>
        props.theme.container.background.colour.light_contrast()};
    border-radius: ${(props) => props.theme.container.border.radius};
    border: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
`;

const AnalyticsStat = styled.div`
    text-align: center;
    padding: ${(props) => props.theme.container.spacing.small};
`;

const AnalyticsValue = styled.div<{ $positive?: boolean; $negative?: boolean }>`
    font-size: 1.5rem;
    font-weight: ${(props) => props.theme.text.weight.bold};
    color: ${(props) =>
        props.$positive
            ? props.theme.colours.success
            : props.$negative
              ? props.theme.colours.error
              : props.theme.text.colour.header()};
`;

const AnalyticsLabel = styled.div`
    font-size: ${(props) => props.theme.text.size.small};
    color: ${(props) => props.theme.text.colour.light_grey()};
    margin-top: ${(props) => props.theme.container.spacing.xsmall};
`;

const SentimentBar = styled.div`
    display: flex;
    height: 8px;
    border-radius: 4px;
    overflow: hidden;
    background: ${(props) => props.theme.container.border.colour.primary()};
    margin-top: ${(props) => props.theme.container.spacing.xsmall};
`;

const SentimentPositive = styled.div<{ $width: number }>`
    width: ${(props) => props.$width}%;
    background: ${(props) => props.theme.colours.success};
    transition: width 0.3s ease;
`;

const SentimentNegative = styled.div<{ $width: number }>`
    width: ${(props) => props.$width}%;
    background: ${(props) => props.theme.colours.error};
    transition: width 0.3s ease;
`;

// Comment sub-tabs container
const SubTabContainer = styled.div`
    display: flex;
    gap: ${(props) => props.theme.container.spacing.small};
    margin-bottom: ${(props) => props.theme.container.spacing.medium};
    border-bottom: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    padding-bottom: ${(props) => props.theme.container.spacing.small};
`;

const SubTab = styled.button<{ $active: boolean }>`
    padding: ${(props) => props.theme.container.spacing.small}
        ${(props) => props.theme.container.spacing.medium};
    background: ${(props) =>
        props.$active
            ? props.theme.container.background.colour.light_contrast()
            : 'transparent'};
    color: ${(props) =>
        props.$active
            ? props.theme.text.colour.header()
            : props.theme.text.colour.light_grey()};
    border: none;
    border-radius: ${(props) => props.theme.container.border.radius};
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: ${(props) => (props.$active ? '500' : '400')};
    transition: all 0.2s ease;

    &:hover {
        background: ${(props) =>
            props.theme.container.background.colour.light_contrast()};
        color: ${(props) => props.theme.text.colour.header()};
    }
`;

// ======== INTERFACES ========

interface Session {
    id: string;
    userAgent: string;
    ipAddress: string;
    createdAt: string;
    lastUsedAt: string;
    isCurrent: boolean;
}

// ======== COMPONENT ========

export default function ProfilePage() {
    const { user, loading, logout, isAdmin, changePassword, deleteAccount } =
        useAuth();
    const router = useRouter();
    const [loadingData, setLoadingData] = useState(true);

    // Main navigation tabs
    const [mainTab, setMainTab] = useState<'profile' | 'comments' | 'settings'>(
        'profile'
    );

    // Profile data
    const [displayName, setDisplayName] = useState('');
    const [bio, setBio] = useState('');

    // Password change
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [changingPassword, setChangingPassword] = useState(false);

    // Sessions
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loadingSessions, setLoadingSessions] = useState(false);
    const [revokingSession, setRevokingSession] = useState<string | null>(null);

    // Delete account modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [deleting, setDeleting] = useState(false);

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
        // Populate form from user context
        if (user) {
            setDisplayName(user.displayName || '');
            setBio(user.bio || '');
            setLoadingData(false);
        }
    }, [user]);

    // Effect for fetching comments from the API
    useEffect(() => {
        async function fetchComments() {
            if (!user) return;

            try {
                setLoadingData(true);
                let endpoint = '/users/me/comments';

                if (activeTab === 'liked') {
                    endpoint = '/users/me/comments/liked';
                } else if (activeTab === 'disliked') {
                    endpoint = '/users/me/comments/disliked';
                }

                const response = await api.get<{ comments: CommentType[] }>(
                    endpoint
                );
                setAllComments(response.data.comments);

                // Reset pagination when tab changes
                setPage(1);
                setSelectedComments([]);

                // Calculate total pages
                const total = Math.ceil(
                    response.data.comments.length / COMMENTS_PER_PAGE
                );
                setTotalPages(total > 0 ? total : 1);
            } catch (error) {
                console.error(`Error fetching ${activeTab} comments:`, error);
                toast.error(`Failed to load ${activeTab} comments`);
            } finally {
                setLoadingData(false);
            }
        }

        if (user && mainTab === 'comments') {
            fetchComments();
        }
    }, [user, activeTab, mainTab]);

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

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await api.patch('/users/me', {
                displayName: displayName || undefined,
                bio: bio || undefined
            });

            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/');
        } catch (error) {
            console.error('Error logging out:', error);
            toast.error('Failed to logout. Please try again.');
        }
    };

    // Fetch sessions
    const fetchSessions = useCallback(async () => {
        setLoadingSessions(true);
        try {
            const res = await api.get<{ sessions: Session[] }>(
                '/auth/sessions'
            );
            setSessions(res.data.sessions);
        } catch (error) {
            console.error('Error fetching sessions:', error);
            toast.error('Failed to load sessions');
        } finally {
            setLoadingSessions(false);
        }
    }, []);

    // Load sessions when settings tab is active
    useEffect(() => {
        if (mainTab === 'settings' && user) {
            fetchSessions();
        }
    }, [mainTab, user, fetchSessions]);

    // Password change handler
    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }

        setChangingPassword(true);
        try {
            await changePassword(currentPassword, newPassword);
            toast.success('Password changed successfully');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            toast.error(
                error.response?.data?.error || 'Failed to change password'
            );
        } finally {
            setChangingPassword(false);
        }
    };

    // Revoke session handler
    const handleRevokeSession = async (sessionId: string) => {
        setRevokingSession(sessionId);
        try {
            await api.delete(`/auth/sessions/${sessionId}`);
            toast.success('Session revoked');
            setSessions((prev) => prev.filter((s) => s.id !== sessionId));
        } catch (error: any) {
            toast.error(
                error.response?.data?.error || 'Failed to revoke session'
            );
        } finally {
            setRevokingSession(null);
        }
    };

    // Delete account handler
    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== 'DELETE') {
            toast.error('Please type DELETE to confirm');
            return;
        }

        setDeleting(true);
        try {
            await deleteAccount();
            toast.success('Account deleted');
            router.push('/');
        } catch (error: any) {
            toast.error(
                error.response?.data?.error || 'Failed to delete account'
            );
            setDeleting(false);
        }
    };

    // Helper to parse user agent for display
    const parseUserAgent = (ua: string): string => {
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Safari')) return 'Safari';
        if (ua.includes('Edge')) return 'Edge';
        return 'Unknown Browser';
    };

    // Helper to get role badge variant
    const getRoleBadgeVariant = (
        group: string
    ): 'admin' | 'moderator' | 'trusted' | 'user' => {
        if (group === 'admin') return 'admin';
        if (group === 'moderator') return 'moderator';
        if (group === 'trusted') return 'trusted';
        return 'user';
    };

    const handleDeleteComment = async (id: string) => {
        try {
            await api.delete(`/comments/${id}`);
            setComments((prev) =>
                prev.map((comment) =>
                    comment.id === id
                        ? { ...comment, isDeleted: true, content: '[deleted]' }
                        : comment
                )
            );
            setAllComments((prev) =>
                prev.map((comment) =>
                    comment.id === id
                        ? { ...comment, isDeleted: true, content: '[deleted]' }
                        : comment
                )
            );
            toast.success('Comment deleted successfully');
        } catch (error) {
            console.error('Error deleting comment:', error);
            toast.error('Failed to delete comment');
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
            const response = await api.post<{ deletedCount: number }>(
                '/users/me/comments/bulk-delete',
                {
                    commentIds: selectedComments
                }
            );

            // Update both all comments and displayed comments
            setAllComments((prev) =>
                prev.map((comment) =>
                    selectedComments.includes(comment.id)
                        ? { ...comment, isDeleted: true, content: '[deleted]' }
                        : comment
                )
            );

            setSelectedComments([]);
            toast.success(
                `${response.data.deletedCount} comments deleted successfully`
            );
        } catch (error) {
            console.error('Error bulk deleting comments:', error);
            toast.error('Failed to delete comments');
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
            const response = await api.post<{ modifiedCount: number }>(
                '/users/me/comments/bulk-unlike',
                {
                    commentIds: selectedComments
                }
            );

            // Refresh the comments list after unliking
            const likedRes = await api.get<{ comments: CommentType[] }>(
                '/users/me/comments/liked'
            );
            setAllComments(likedRes.data.comments);

            // Recalculate total pages
            const total = Math.ceil(
                likedRes.data.comments.length / COMMENTS_PER_PAGE
            );
            setTotalPages(total > 0 ? total : 1);

            // If we're on a page that no longer exists, go to last page
            if (page > total && total > 0) {
                setPage(total);
            }

            setSelectedComments([]);
            toast.success(
                `${response.data.modifiedCount} comments unliked successfully`
            );
        } catch (error) {
            console.error('Error unliking comments:', error);
            toast.error('Failed to unlike comments');
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
            const response = await api.post<{ modifiedCount: number }>(
                '/users/me/comments/bulk-undislike',
                {
                    commentIds: selectedComments
                }
            );

            // Refresh the comments list after removing dislikes
            const dislikedRes = await api.get<{ comments: CommentType[] }>(
                '/users/me/comments/disliked'
            );
            setAllComments(dislikedRes.data.comments);

            // Recalculate total pages
            const total = Math.ceil(
                dislikedRes.data.comments.length / COMMENTS_PER_PAGE
            );
            setTotalPages(total > 0 ? total : 1);

            // If we're on a page that no longer exists, go to last page
            if (page > total && total > 0) {
                setPage(total);
            }

            setSelectedComments([]);
            toast.success(
                `Removed dislike from ${response.data.modifiedCount} comments successfully`
            );
        } catch (error) {
            console.error('Error removing dislikes:', error);
            toast.error('Failed to remove dislikes');
        }
    };

    const toggleSelectComment = (id: string) => {
        setSelectedComments((prev) =>
            prev.includes(id)
                ? prev.filter((commentId) => commentId !== id)
                : [...prev, id]
        );
    };

    const handleReactionUpdate = (
        commentId: string,
        newReaction: 'like' | 'dislike' | null
    ) => {
        const updateComment = (comment: CommentType): CommentType => {
            if (comment.id !== commentId) return comment;

            const oldReaction = comment.reactions.userReaction;
            let newLikes = comment.reactions.likes;
            let newDislikes = comment.reactions.dislikes;

            // Remove old reaction count
            if (oldReaction === 'like') newLikes--;
            if (oldReaction === 'dislike') newDislikes--;

            // Add new reaction count
            if (newReaction === 'like') newLikes++;
            if (newReaction === 'dislike') newDislikes++;

            return {
                ...comment,
                reactions: {
                    ...comment.reactions,
                    likes: newLikes,
                    dislikes: newDislikes,
                    userReaction: newReaction
                }
            };
        };

        setComments((prev) => prev.map(updateComment));
        setAllComments((prev) => prev.map(updateComment));
    };

    const toggleSelectAll = () => {
        const visibleNonDeletedComments = comments.filter((c) => !c.isDeleted);

        if (selectedComments.length === visibleNonDeletedComments.length) {
            // If all are selected, deselect all
            setSelectedComments([]);
        } else {
            // Otherwise, select all visible non-deleted comments
            setSelectedComments(
                visibleNonDeletedComments.map((comment) => comment.id)
            );
        }
    };

    if (loading) {
        return (
            <LoadingContainer>
                <LoadingSpinner />
                <LoadingText>Loading...</LoadingText>
            </LoadingContainer>
        );
    }

    if (!user) {
        return null; // Will redirect via useEffect
    }

    // Navigation items for sidebar
    const navItems = [
        {
            id: 'profile' as const,
            label: 'Profile',
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                </svg>
            )
        },
        {
            id: 'comments' as const,
            label: 'My Comments',
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                    />
                </svg>
            )
        },
        {
            id: 'settings' as const,
            label: 'Account Settings',
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                </svg>
            )
        }
    ];

    return (
        <ProfileContainer>
            {/* Sidebar Navigation */}
            <ProfileSidebar>
                <SidebarTitle>
                    {user?.displayName || user?.username}
                </SidebarTitle>

                {/* Role badges */}
                {user?.groups && user.groups.length > 0 && (
                    <div style={{ marginBottom: '15px', paddingLeft: '12px' }}>
                        {user.groups.map((group) => (
                            <RoleBadge
                                key={group}
                                $variant={getRoleBadgeVariant(group)}
                            >
                                {group}
                            </RoleBadge>
                        ))}
                    </div>
                )}

                <SidebarNav>
                    {navItems.map((item) => (
                        <SidebarLink
                            key={item.id}
                            $active={mainTab === item.id}
                            onClick={() => setMainTab(item.id)}
                            style={{ cursor: 'pointer' }}
                        >
                            {item.icon}
                            {item.label}
                        </SidebarLink>
                    ))}
                </SidebarNav>

                <SidebarDivider />

                <SidebarNav>
                    {isAdmin() && (
                        <Link href="/admin" passHref legacyBehavior>
                            <SidebarLink>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                                    />
                                </svg>
                                Admin Dashboard
                            </SidebarLink>
                        </Link>
                    )}
                    <Link href="/" passHref legacyBehavior>
                        <SidebarLink>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                                />
                            </svg>
                            Back to Site
                        </SidebarLink>
                    </Link>
                    <SidebarLink
                        onClick={handleLogout}
                        style={{ cursor: 'pointer' }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                            />
                        </svg>
                        Logout
                    </SidebarLink>
                </SidebarNav>
            </ProfileSidebar>

            {/* Main Content */}
            <ProfileMain>
                {/* Profile Section */}
                {mainTab === 'profile' && (
                    <>
                        <AdminHeader>
                            <AdminTitle>Profile Settings</AdminTitle>
                        </AdminHeader>

                        {loadingData ? (
                            <Loading>Loading profile data...</Loading>
                        ) : (
                            <ProfileForm onSubmit={handleUpdateProfile}>
                                <FormGroup>
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        value={user?.username || ''}
                                        disabled
                                        style={{ opacity: 0.6 }}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label htmlFor="displayName">
                                        Display Name
                                    </Label>
                                    <Input
                                        id="displayName"
                                        value={displayName}
                                        onChange={(e) =>
                                            setDisplayName(e.target.value)
                                        }
                                        placeholder="How you want to be called"
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label htmlFor="bio">Bio</Label>
                                    <Input
                                        as="textarea"
                                        id="bio"
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        placeholder="Tell us about yourself"
                                        style={{
                                            minHeight: '100px',
                                            resize: 'vertical'
                                        }}
                                    />
                                </FormGroup>

                                <Button type="submit" variant="primary">
                                    Update Profile
                                </Button>
                            </ProfileForm>
                        )}
                    </>
                )}

                {/* Comments Section */}
                {mainTab === 'comments' && (
                    <>
                        <AdminHeader>
                            <AdminTitle>My Comments</AdminTitle>
                        </AdminHeader>

                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '15px'
                            }}
                        >
                            <Badge $variant="secondary">
                                {allComments.length} Comments
                            </Badge>
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

                        {/* Mini Analytics - only show on "Created" tab when there are comments */}
                        {activeTab === 'created' &&
                            allComments.length > 0 &&
                            (() => {
                                // Calculate analytics from user's created comments
                                const totalLikes = allComments.reduce(
                                    (sum, c) => sum + (c.reactions?.likes || 0),
                                    0
                                );
                                const totalDislikes = allComments.reduce(
                                    (sum, c) =>
                                        sum + (c.reactions?.dislikes || 0),
                                    0
                                );
                                const totalReactions =
                                    totalLikes + totalDislikes;
                                const sentimentPercent =
                                    totalReactions > 0
                                        ? Math.round(
                                              (totalLikes / totalReactions) *
                                                  100
                                          )
                                        : 50;

                                return (
                                    <MiniAnalyticsContainer>
                                        <AnalyticsStat>
                                            <AnalyticsValue $positive>
                                                {totalLikes}
                                            </AnalyticsValue>
                                            <AnalyticsLabel>
                                                Total Likes
                                            </AnalyticsLabel>
                                        </AnalyticsStat>
                                        <AnalyticsStat>
                                            <AnalyticsValue $negative>
                                                {totalDislikes}
                                            </AnalyticsValue>
                                            <AnalyticsLabel>
                                                Total Dislikes
                                            </AnalyticsLabel>
                                        </AnalyticsStat>
                                        <AnalyticsStat>
                                            <AnalyticsValue>
                                                {sentimentPercent}%
                                            </AnalyticsValue>
                                            <AnalyticsLabel>
                                                Positive Sentiment
                                            </AnalyticsLabel>
                                            <SentimentBar>
                                                <SentimentPositive
                                                    $width={sentimentPercent}
                                                />
                                                <SentimentNegative
                                                    $width={
                                                        100 - sentimentPercent
                                                    }
                                                />
                                            </SentimentBar>
                                        </AnalyticsStat>
                                        <AnalyticsStat>
                                            <AnalyticsValue>
                                                {totalReactions > 0
                                                    ? (
                                                          totalReactions /
                                                          allComments.length
                                                      ).toFixed(1)
                                                    : '0'}
                                            </AnalyticsValue>
                                            <AnalyticsLabel>
                                                Avg Engagement
                                            </AnalyticsLabel>
                                        </AnalyticsStat>
                                    </MiniAnalyticsContainer>
                                );
                            })()}

                        {/* Sub-tabs for comment types */}
                        <SubTabContainer>
                            <SubTab
                                $active={activeTab === 'created'}
                                onClick={() => setActiveTab('created')}
                            >
                                Created
                            </SubTab>
                            <SubTab
                                $active={activeTab === 'liked'}
                                onClick={() => setActiveTab('liked')}
                            >
                                Liked
                            </SubTab>
                            <SubTab
                                $active={activeTab === 'disliked'}
                                onClick={() => setActiveTab('disliked')}
                            >
                                Disliked
                            </SubTab>
                        </SubTabContainer>

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
                                                                    !c.isDeleted
                                                            ).length
                                                    }
                                                    onChange={toggleSelectAll}
                                                />
                                                <span>Select All</span>
                                                {selectedComments.length >
                                                    0 && (
                                                    <Badge $variant="secondary">
                                                        {
                                                            selectedComments.length
                                                        }{' '}
                                                        selected
                                                    </Badge>
                                                )}
                                            </SelectAll>

                                            {selectedComments.length > 0 && (
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
                                                                    !c.isDeleted
                                                            ).length
                                                    }
                                                    onChange={toggleSelectAll}
                                                />
                                                <span>Select All</span>
                                                {selectedComments.length >
                                                    0 && (
                                                    <Badge $variant="secondary">
                                                        {
                                                            selectedComments.length
                                                        }{' '}
                                                        selected
                                                    </Badge>
                                                )}
                                            </SelectAll>

                                            {selectedComments.length > 0 && (
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
                                                                    !c.isDeleted
                                                            ).length
                                                    }
                                                    onChange={toggleSelectAll}
                                                />
                                                <span>Select All</span>
                                                {selectedComments.length >
                                                    0 && (
                                                    <Badge $variant="secondary">
                                                        {
                                                            selectedComments.length
                                                        }{' '}
                                                        selected
                                                    </Badge>
                                                )}
                                            </SelectAll>

                                            {selectedComments.length > 0 && (
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
                                                onDelete={handleDeleteComment}
                                                onReactionUpdate={
                                                    handleReactionUpdate
                                                }
                                                Checkbox={Checkbox}
                                            />
                                        ) : (
                                            <EmptyState>
                                                No comments on this page. Try a
                                                different page.
                                            </EmptyState>
                                        )}

                                        {/* Pagination Controls */}
                                        {totalPages > 1 && (
                                            <Pagination>
                                                <PageButton
                                                    onClick={() =>
                                                        setPage((p) =>
                                                            Math.max(1, p - 1)
                                                        )
                                                    }
                                                    disabled={page === 1}
                                                >
                                                    &lt;
                                                </PageButton>

                                                {/* Generate page numbers */}
                                                {Array.from(
                                                    {
                                                        length: totalPages
                                                    },
                                                    (_, i) => (
                                                        <PageButton
                                                            key={i + 1}
                                                            $active={
                                                                page === i + 1
                                                            }
                                                            onClick={() =>
                                                                setPage(i + 1)
                                                            }
                                                        >
                                                            {i + 1}
                                                        </PageButton>
                                                    )
                                                )}

                                                <PageButton
                                                    onClick={() =>
                                                        setPage((p) =>
                                                            Math.min(
                                                                totalPages,
                                                                p + 1
                                                            )
                                                        )
                                                    }
                                                    disabled={
                                                        page === totalPages
                                                    }
                                                >
                                                    &gt;
                                                </PageButton>
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

                {/* Account Settings Section */}
                {mainTab === 'settings' && (
                    <>
                        <AdminHeader>
                            <AdminTitle>Account Settings</AdminTitle>
                        </AdminHeader>

                        {/* Password Change */}
                        <SettingsSection>
                            <SettingsTitle>Change Password</SettingsTitle>
                            <SettingsDescription>
                                Update your password to keep your account
                                secure.
                            </SettingsDescription>
                            <ProfileForm onSubmit={handlePasswordChange}>
                                <FormGroup>
                                    <Label htmlFor="currentPassword">
                                        Current Password
                                    </Label>
                                    <Input
                                        id="currentPassword"
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) =>
                                            setCurrentPassword(e.target.value)
                                        }
                                        placeholder="Enter current password"
                                        required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label htmlFor="newPassword">
                                        New Password
                                    </Label>
                                    <Input
                                        id="newPassword"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) =>
                                            setNewPassword(e.target.value)
                                        }
                                        placeholder="Enter new password (min 8 characters)"
                                        required
                                        minLength={8}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label htmlFor="confirmPassword">
                                        Confirm New Password
                                    </Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                        placeholder="Confirm new password"
                                        required
                                    />
                                </FormGroup>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={changingPassword}
                                >
                                    {changingPassword
                                        ? 'Changing...'
                                        : 'Change Password'}
                                </Button>
                            </ProfileForm>
                        </SettingsSection>

                        {/* Active Sessions */}
                        <SettingsSection>
                            <SettingsTitle>Active Sessions</SettingsTitle>
                            <SettingsDescription>
                                These are the devices currently logged into your
                                account. You can revoke any session you
                                don&apos;t recognize.
                            </SettingsDescription>

                            {loadingSessions ? (
                                <Loading>Loading sessions...</Loading>
                            ) : sessions.length === 0 ? (
                                <EmptyState>No active sessions</EmptyState>
                            ) : (
                                <SessionList>
                                    {sessions.map((session) => (
                                        <SessionItem
                                            key={session.id}
                                            $current={session.isCurrent}
                                        >
                                            <SessionInfo>
                                                <SessionDevice>
                                                    {parseUserAgent(
                                                        session.userAgent
                                                    )}
                                                    {session.isCurrent && (
                                                        <CurrentBadge>
                                                            Current
                                                        </CurrentBadge>
                                                    )}
                                                </SessionDevice>
                                                <SessionMeta>
                                                    IP: {session.ipAddress} |
                                                    Last used:{' '}
                                                    {new Date(
                                                        session.lastUsedAt
                                                    ).toLocaleDateString()}
                                                </SessionMeta>
                                            </SessionInfo>
                                            {!session.isCurrent && (
                                                <Button
                                                    variant="danger"
                                                    size="small"
                                                    onClick={() =>
                                                        handleRevokeSession(
                                                            session.id
                                                        )
                                                    }
                                                    disabled={
                                                        revokingSession ===
                                                        session.id
                                                    }
                                                >
                                                    {revokingSession ===
                                                    session.id
                                                        ? 'Revoking...'
                                                        : 'Revoke'}
                                                </Button>
                                            )}
                                        </SessionItem>
                                    ))}
                                </SessionList>
                            )}
                        </SettingsSection>

                        {/* Danger Zone */}
                        <DangerZone>
                            <DangerTitle>Danger Zone</DangerTitle>
                            <DangerDescription>
                                Once you delete your account, there is no going
                                back. Please be certain.
                            </DangerDescription>
                            <Button
                                variant="danger"
                                onClick={() => setShowDeleteModal(true)}
                            >
                                Delete Account
                            </Button>
                        </DangerZone>
                    </>
                )}
            </ProfileMain>

            {/* Delete Account Modal */}
            {showDeleteModal && (
                <ModalBackdrop onClick={() => setShowDeleteModal(false)}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        <ModalTitle>Delete Account</ModalTitle>
                        <ModalBody>
                            <ModalText>
                                This action cannot be undone. All your data will
                                be permanently deleted. Type{' '}
                                <strong>DELETE</strong> below to confirm.
                            </ModalText>
                            <FormGroup>
                                <Input
                                    value={deleteConfirmText}
                                    onChange={(e) =>
                                        setDeleteConfirmText(e.target.value)
                                    }
                                    placeholder="Type DELETE to confirm"
                                />
                            </FormGroup>
                            <ModalButtonGroup>
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setDeleteConfirmText('');
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={handleDeleteAccount}
                                    disabled={
                                        deleting ||
                                        deleteConfirmText !== 'DELETE'
                                    }
                                >
                                    {deleting
                                        ? 'Deleting...'
                                        : 'Delete My Account'}
                                </Button>
                            </ModalButtonGroup>
                        </ModalBody>
                    </ModalContent>
                </ModalBackdrop>
            )}
        </ProfileContainer>
    );
}
