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

// ======== STYLED COMPONENTS ========

// Extend the site's SideBarContainer for profile-specific styling
const ProfileSidebar = styled(SideBarContainer)`
    padding: 20px;
    height: fit-content;
`;

// Extend the site's Article for profile main content
const ProfileMain = styled(Article)`
    width: 75%;
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 20px;

    @media (max-width: 900px) {
        width: 100%;
        border-left: none;
    }
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

const SessionItem = styled.div<{ current?: boolean }>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${(props) => props.theme.container.spacing.medium};
    border: 1px solid
        ${(props) =>
            props.current
                ? props.theme.theme_colours[5]()
                : props.theme.container.border.colour.primary()};
    border-radius: ${(props) => props.theme.container.border.radius};
    background: ${(props) =>
        props.current
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
    variant?: 'admin' | 'moderator' | 'trusted' | 'user';
}>`
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: ${(props) => props.theme.text.weight.medium};
    margin-right: 5px;

    ${(props) => {
        switch (props.variant) {
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

const ModalBackdrop = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
`;

const ModalContent = styled.div`
    background: ${(props) => props.theme.container.background.colour.solid()};
    border-radius: ${(props) => props.theme.container.border.radius};
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    width: 100%;
    max-width: 450px;
    padding: 25px;
`;

const ModalTitle = styled.h3`
    margin: 0 0 15px 0;
    color: ${(props) => props.theme.text.colour.header()};
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

const AdminLink = styled.a`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 15px;
    margin-top: 15px;
    background: ${(props) => props.theme.theme_colours[9]()};
    color: ${(props) => props.theme.theme_colours[5]()};
    border-radius: ${(props) => props.theme.container.border.radius};
    text-decoration: none;
    font-weight: ${(props) => props.theme.text.weight.medium};
    transition: all 0.2s ease;

    &:hover {
        background: ${(props) => props.theme.theme_colours[5]()};
        color: white;
    }

    svg {
        width: 18px;
        height: 18px;
    }
`;

// ======== INTERFACES ========

// Using the shared CommentType interface

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
    const [alert, setAlert] = useState<{
        show: boolean;
        message: string;
        variant: 'error' | 'success' | 'warning' | 'info';
    }>({
        show: false,
        message: '',
        variant: 'info'
    });

    // Main navigation tabs
    const [mainTab, setMainTab] = useState<'comments' | 'settings'>('comments');

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
                showAlert(`Failed to load ${activeTab} comments`, 'error');
            } finally {
                setLoadingData(false);
            }
        }

        if (user) {
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
            await api.patch('/users/me', {
                displayName: displayName || undefined,
                bio: bio || undefined
            });

            showAlert('Profile updated successfully!', 'success');
        } catch (error) {
            console.error('Error updating profile:', error);
            showAlert('Failed to update profile', 'error');
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
            showAlert(
                `Removed dislike from ${response.data.modifiedCount} comments successfully`,
                'success'
            );
        } catch (error) {
            console.error('Error removing dislikes:', error);
            showAlert('Failed to remove dislikes', 'error');
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
            <PostContainer>
                <Article sideBar={false} style={{ width: '100%' }}>
                    <Loading>Loading profile data...</Loading>
                </Article>
            </PostContainer>
        );
    }

    if (!user) {
        return null; // Will redirect via useEffect
    }

    return (
        <PostContainer>
            {alert.show && (
                <Alert variant={alert.variant}>{alert.message}</Alert>
            )}

            {/* Left Sidebar */}
            <ProfileSidebar>
                <CardTitle>Profile Information</CardTitle>

                {/* Role badges */}
                {user?.groups && user.groups.length > 0 && (
                    <div style={{ marginBottom: '15px' }}>
                        {user.groups.map((group) => (
                            <RoleBadge
                                key={group}
                                variant={getRoleBadgeVariant(group)}
                            >
                                {group}
                            </RoleBadge>
                        ))}
                    </div>
                )}

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
                            <Label htmlFor="displayName">Display Name</Label>
                            <Input
                                id="displayName"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
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
                                    minHeight: '80px',
                                    resize: 'vertical'
                                }}
                            />
                        </FormGroup>

                        <Button type="submit" variant="primary" fullWidth>
                            Update Profile
                        </Button>

                        <Button
                            type="button"
                            onClick={handleLogout}
                            variant="danger"
                            fullWidth
                            style={{ marginTop: '15px' }}
                        >
                            Logout
                        </Button>
                    </ProfileForm>
                )}

                {/* Admin link */}
                {isAdmin() && (
                    <Link href="/admin" passHref legacyBehavior>
                        <AdminLink>
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
                            Admin Dashboard
                        </AdminLink>
                    </Link>
                )}
            </ProfileSidebar>

            {/* Main Content */}
            <ProfileMain>
                {/* Main Navigation Tabs */}
                <TabsContainer>
                    <Tab
                        active={mainTab === 'comments'}
                        onClick={() => setMainTab('comments')}
                    >
                        My Comments
                    </Tab>
                    <Tab
                        active={mainTab === 'settings'}
                        onClick={() => setMainTab('settings')}
                    >
                        Account Settings
                    </Tab>
                </TabsContainer>

                {/* Comments Section */}
                {mainTab === 'comments' && (
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
                                                                        !c.isDeleted
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
                                                                        !c.isDeleted
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
                                                                        !c.isDeleted
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
                                                    onReactionUpdate={
                                                        handleReactionUpdate
                                                    }
                                                    Checkbox={Checkbox}
                                                />
                                            ) : (
                                                <EmptyState>
                                                    No comments on this page.
                                                    Try a different page.
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
                                                        disabled={page === 1}
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
                                                                        i + 1
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
                                                            page === totalPages
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
                    </Card>
                )}

                {/* Account Settings Section */}
                {mainTab === 'settings' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Settings</CardTitle>
                        </CardHeader>

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
                                            current={session.isCurrent}
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
                    </Card>
                )}
            </ProfileMain>

            {/* Delete Account Modal */}
            {showDeleteModal && (
                <ModalBackdrop onClick={() => setShowDeleteModal(false)}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        <ModalTitle>Delete Account</ModalTitle>
                        <ModalText>
                            This action cannot be undone. All your data will be
                            permanently deleted. Type <strong>DELETE</strong>{' '}
                            below to confirm.
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
                                    deleting || deleteConfirmText !== 'DELETE'
                                }
                            >
                                {deleting ? 'Deleting...' : 'Delete My Account'}
                            </Button>
                        </ModalButtonGroup>
                    </ModalContent>
                </ModalBackdrop>
            )}
        </PostContainer>
    );
}
