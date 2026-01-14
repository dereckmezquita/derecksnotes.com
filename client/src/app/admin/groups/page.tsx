'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@context/AuthContext';
import { api } from '@utils/api/api';
import { toast } from 'sonner';
import styled from 'styled-components';
import {
    AdminHeader,
    AdminTitle,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableHeader,
    TableCell,
    Badge,
    Button,
    ButtonGroup,
    ActionBar,
    ActionBarLeft,
    ActionBarRight,
    LoadingContainer,
    LoadingSpinner,
    LoadingText,
    EmptyState,
    EmptyStateIcon,
    EmptyStateTitle,
    EmptyStateText,
    Alert,
    AccessDenied
} from '../components/AdminStyles';

interface Permission {
    id: string;
    name: string;
    description: string | null;
    category: string;
}

interface Group {
    id: string;
    name: string;
    description: string | null;
    isDefault: boolean;
    createdAt: string;
    permissions: Permission[];
}

interface GroupsResponse {
    groups: Group[];
}

interface PermissionsResponse {
    permissions: Permission[];
    byCategory: Record<string, Permission[]>;
}

// Modal components
const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(2px);
`;

const ModalContent = styled.div`
    background: ${({ theme }) => theme.container.background.colour.solid()};
    border: 1px solid ${({ theme }) => theme.container.border.colour.primary()};
    border-radius: 8px;
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
    padding: 1rem 1.5rem;
    border-bottom: 1px solid
        ${({ theme }) => theme.container.border.colour.primary()};
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    background: ${({ theme }) => theme.container.background.colour.solid()};
    z-index: 1;

    h2 {
        margin: 0;
        font-size: 1.25rem;
        color: ${({ theme }) => theme.text.colour.header()};
    }
`;

const ModalBody = styled.div`
    padding: 1.5rem;
`;

const ModalFooter = styled.div`
    padding: 1rem 1.5rem;
    border-top: 1px solid
        ${({ theme }) => theme.container.border.colour.primary()};
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    position: sticky;
    bottom: 0;
    background: ${({ theme }) => theme.container.background.colour.solid()};
`;

const FormGroup = styled.div`
    margin-bottom: 1rem;

    label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        font-size: 0.875rem;
        color: ${({ theme }) => theme.text.colour.primary()};
    }

    input,
    textarea {
        width: 100%;
        padding: 0.5rem 0.75rem;
        border: 1px solid
            ${({ theme }) => theme.container.border.colour.primary()};
        border-radius: 4px;
        background: ${({ theme }) => theme.container.background.colour.solid()};
        color: ${({ theme }) => theme.text.colour.primary()};
        font-size: 0.875rem;

        &:focus {
            outline: none;
            border-color: ${({ theme }) => theme.theme_colours[5]()};
        }
    }

    textarea {
        min-height: 80px;
        resize: vertical;
    }

    small {
        display: block;
        margin-top: 0.25rem;
        opacity: 0.6;
        font-size: 0.75rem;
        color: ${({ theme }) => theme.text.colour.light_grey()};
    }
`;

const CheckboxGroup = styled.label`
    display: flex !important;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-weight: normal !important;

    input[type='checkbox'] {
        width: auto;
    }
`;

const PermissionCategory = styled.div`
    margin-bottom: 1rem;

    h4 {
        margin: 0 0 0.5rem 0;
        font-size: 0.875rem;
        text-transform: capitalize;
        color: ${({ theme }) => theme.text.colour.primary()};
        padding-bottom: 0.25rem;
        border-bottom: 1px solid
            ${({ theme }) => theme.container.border.colour.primary()};
    }
`;

const PermissionList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
`;

const PermissionItem = styled.label`
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.5rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.text.colour.primary()};

    &:hover {
        background: ${({ theme }) =>
            theme.container.background.colour.light_contrast()};
    }

    input[type='checkbox'] {
        margin-top: 2px;
    }

    span {
        flex: 1;
    }

    small {
        display: block;
        opacity: 0.6;
        font-size: 0.75rem;
        margin-top: 0.125rem;
        color: ${({ theme }) => theme.text.colour.light_grey()};
    }
`;

const GroupCard = styled.div`
    background: ${({ theme }) => theme.container.background.colour.solid()};
    border: 1px solid ${({ theme }) => theme.container.border.colour.primary()};
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
`;

const GroupCardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.75rem;
`;

const GroupName = styled.h3`
    margin: 0;
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const GroupDescription = styled.p`
    margin: 0 0 0.75rem 0;
    font-size: 0.875rem;
    opacity: 0.7;
`;

const PermissionTags = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
`;

const PermissionTag = styled.span`
    font-size: 0.7rem;
    padding: 0.125rem 0.375rem;
    background: ${({ theme }) =>
        theme.container.background.colour.light_contrast()};
    color: ${({ theme }) => theme.text.colour.light_grey()};
    border-radius: 3px;
    opacity: 0.8;
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem;
    color: ${({ theme }) => theme.text.colour.primary()};
    opacity: 0.6;

    &:hover {
        opacity: 1;
    }

    svg {
        width: 1.25rem;
        height: 1.25rem;
    }
`;

const SYSTEM_GROUPS = ['user', 'trusted', 'moderator', 'admin'];

export default function AdminGroupsPage() {
    const { isAdmin, hasPermission } = useAuth();
    const [groups, setGroups] = useState<Group[]>([]);
    const [allPermissions, setAllPermissions] =
        useState<PermissionsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState<string | null>(null);

    // Modal states
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [permissionsModalOpen, setPermissionsModalOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

    // Form states
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupDescription, setNewGroupDescription] = useState('');
    const [newGroupIsDefault, setNewGroupIsDefault] = useState(false);
    const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
        new Set()
    );

    const canManageGroups = isAdmin() || hasPermission('admin.groups.manage');
    const canAssignPermissions =
        isAdmin() || hasPermission('admin.permissions.assign');

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [groupsRes, permsRes] = await Promise.all([
                api.get<GroupsResponse>('/admin/groups'),
                api.get<PermissionsResponse>('/admin/groups/permissions')
            ]);
            setGroups(groupsRes.data.groups);
            setAllPermissions(permsRes.data);
        } catch (err: any) {
            console.error('Error fetching groups:', err);
            setError(err.response?.data?.error || 'Failed to load groups');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleCreateGroup = async () => {
        if (!newGroupName.trim()) {
            toast.error('Group name is required');
            return;
        }

        setProcessing('create');
        try {
            await api.post('/admin/groups', {
                name: newGroupName.trim(),
                description: newGroupDescription.trim() || undefined,
                isDefault: newGroupIsDefault
            });
            toast.success('Group created');
            setCreateModalOpen(false);
            setNewGroupName('');
            setNewGroupDescription('');
            setNewGroupIsDefault(false);
            fetchData();
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to create group');
        } finally {
            setProcessing(null);
        }
    };

    const handleUpdateGroup = async () => {
        if (!selectedGroup) return;

        setProcessing('update');
        try {
            await api.patch(`/admin/groups/${selectedGroup.id}`, {
                description: newGroupDescription.trim() || undefined,
                isDefault: newGroupIsDefault
            });
            toast.success('Group updated');
            setEditModalOpen(false);
            setSelectedGroup(null);
            fetchData();
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to update group');
        } finally {
            setProcessing(null);
        }
    };

    const handleDeleteGroup = async (group: Group) => {
        if (SYSTEM_GROUPS.includes(group.name)) {
            toast.error('Cannot delete system groups');
            return;
        }

        if (
            !confirm(
                `Delete group "${group.name}"? This action cannot be undone.`
            )
        ) {
            return;
        }

        setProcessing(group.id);
        try {
            await api.delete(`/admin/groups/${group.id}`);
            toast.success('Group deleted');
            fetchData();
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to delete group');
        } finally {
            setProcessing(null);
        }
    };

    const handleUpdatePermissions = async () => {
        if (!selectedGroup) return;

        setProcessing('permissions');
        try {
            await api.put(`/admin/groups/${selectedGroup.id}/permissions`, {
                permissions: Array.from(selectedPermissions)
            });
            toast.success('Permissions updated');
            setPermissionsModalOpen(false);
            setSelectedGroup(null);
            fetchData();
        } catch (err: any) {
            toast.error(
                err.response?.data?.error || 'Failed to update permissions'
            );
        } finally {
            setProcessing(null);
        }
    };

    const openEditModal = (group: Group) => {
        setSelectedGroup(group);
        setNewGroupDescription(group.description || '');
        setNewGroupIsDefault(group.isDefault);
        setEditModalOpen(true);
    };

    const openPermissionsModal = (group: Group) => {
        setSelectedGroup(group);
        setSelectedPermissions(new Set(group.permissions.map((p) => p.name)));
        setPermissionsModalOpen(true);
    };

    const togglePermission = (permName: string) => {
        setSelectedPermissions((prev) => {
            const next = new Set(prev);
            if (next.has(permName)) {
                next.delete(permName);
            } else {
                next.add(permName);
            }
            return next;
        });
    };

    const getGroupBadgeVariant = (
        groupName: string
    ): 'primary' | 'success' | 'warning' | 'danger' | 'secondary' => {
        switch (groupName) {
            case 'admin':
                return 'danger';
            case 'moderator':
                return 'warning';
            case 'trusted':
                return 'success';
            default:
                return 'secondary';
        }
    };

    if (!isAdmin() && !hasPermission('admin.dashboard')) {
        return (
            <AccessDenied>
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
                        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                    />
                </svg>
                <h1>Access Denied</h1>
                <p>You do not have permission to manage groups.</p>
            </AccessDenied>
        );
    }

    if (error) {
        return (
            <Alert $variant="error">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    width={20}
                    height={20}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                    />
                </svg>
                {error}
                <Button
                    variant="secondary"
                    size="small"
                    onClick={fetchData}
                    style={{ marginLeft: 'auto' }}
                >
                    Retry
                </Button>
            </Alert>
        );
    }

    return (
        <>
            <AdminHeader>
                <AdminTitle>Groups & Permissions</AdminTitle>
            </AdminHeader>

            <ActionBar>
                <ActionBarLeft>
                    <Badge $variant="secondary">{groups.length} groups</Badge>
                </ActionBarLeft>
                <ActionBarRight>
                    {canManageGroups && (
                        <Button
                            variant="primary"
                            size="small"
                            onClick={() => setCreateModalOpen(true)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                width={16}
                                height={16}
                                style={{ marginRight: '0.25rem' }}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 4.5v15m7.5-7.5h-15"
                                />
                            </svg>
                            New Group
                        </Button>
                    )}
                </ActionBarRight>
            </ActionBar>

            {loading ? (
                <LoadingContainer>
                    <LoadingSpinner />
                    <LoadingText>Loading groups...</LoadingText>
                </LoadingContainer>
            ) : groups.length === 0 ? (
                <EmptyState>
                    <EmptyStateIcon>
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
                                d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                            />
                        </svg>
                    </EmptyStateIcon>
                    <EmptyStateTitle>No groups yet</EmptyStateTitle>
                    <EmptyStateText>
                        Create your first group to organize permissions
                    </EmptyStateText>
                </EmptyState>
            ) : (
                <div>
                    {groups.map((group) => (
                        <GroupCard key={group.id}>
                            <GroupCardHeader>
                                <GroupName>
                                    {group.name}
                                    {group.isDefault && (
                                        <Badge $variant="primary">
                                            Default
                                        </Badge>
                                    )}
                                    {SYSTEM_GROUPS.includes(group.name) && (
                                        <Badge $variant="secondary">
                                            System
                                        </Badge>
                                    )}
                                </GroupName>
                                <ButtonGroup>
                                    {canAssignPermissions && (
                                        <Button
                                            variant="secondary"
                                            size="small"
                                            onClick={() =>
                                                openPermissionsModal(group)
                                            }
                                        >
                                            Permissions
                                        </Button>
                                    )}
                                    {canManageGroups && (
                                        <>
                                            <Button
                                                variant="secondary"
                                                size="small"
                                                onClick={() =>
                                                    openEditModal(group)
                                                }
                                            >
                                                Edit
                                            </Button>
                                            {!SYSTEM_GROUPS.includes(
                                                group.name
                                            ) && (
                                                <Button
                                                    variant="danger"
                                                    size="small"
                                                    onClick={() =>
                                                        handleDeleteGroup(group)
                                                    }
                                                    disabled={
                                                        processing === group.id
                                                    }
                                                >
                                                    Delete
                                                </Button>
                                            )}
                                        </>
                                    )}
                                </ButtonGroup>
                            </GroupCardHeader>
                            {group.description && (
                                <GroupDescription>
                                    {group.description}
                                </GroupDescription>
                            )}
                            <PermissionTags>
                                {group.permissions.length === 0 ? (
                                    <span
                                        style={{
                                            opacity: 0.5,
                                            fontSize: '0.75rem'
                                        }}
                                    >
                                        No permissions
                                    </span>
                                ) : (
                                    group.permissions.map((perm) => (
                                        <PermissionTag key={perm.id}>
                                            {perm.name}
                                        </PermissionTag>
                                    ))
                                )}
                            </PermissionTags>
                        </GroupCard>
                    ))}
                </div>
            )}

            {/* Create Group Modal */}
            {createModalOpen && (
                <ModalOverlay onClick={() => setCreateModalOpen(false)}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        <ModalHeader>
                            <h2>Create New Group</h2>
                            <CloseButton
                                onClick={() => setCreateModalOpen(false)}
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
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </CloseButton>
                        </ModalHeader>
                        <ModalBody>
                            <FormGroup>
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={newGroupName}
                                    onChange={(e) =>
                                        setNewGroupName(e.target.value)
                                    }
                                    placeholder="e.g., editors"
                                />
                                <small>
                                    Lowercase letters, numbers, underscores, and
                                    hyphens only
                                </small>
                            </FormGroup>
                            <FormGroup>
                                <label>Description</label>
                                <textarea
                                    value={newGroupDescription}
                                    onChange={(e) =>
                                        setNewGroupDescription(e.target.value)
                                    }
                                    placeholder="What is this group for?"
                                />
                            </FormGroup>
                            <FormGroup>
                                <CheckboxGroup>
                                    <input
                                        type="checkbox"
                                        checked={newGroupIsDefault}
                                        onChange={(e) =>
                                            setNewGroupIsDefault(
                                                e.target.checked
                                            )
                                        }
                                    />
                                    Set as default group for new users
                                </CheckboxGroup>
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                variant="secondary"
                                onClick={() => setCreateModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleCreateGroup}
                                disabled={processing === 'create'}
                            >
                                {processing === 'create'
                                    ? 'Creating...'
                                    : 'Create Group'}
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </ModalOverlay>
            )}

            {/* Edit Group Modal */}
            {editModalOpen && selectedGroup && (
                <ModalOverlay onClick={() => setEditModalOpen(false)}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        <ModalHeader>
                            <h2>Edit Group: {selectedGroup.name}</h2>
                            <CloseButton
                                onClick={() => setEditModalOpen(false)}
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
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </CloseButton>
                        </ModalHeader>
                        <ModalBody>
                            <FormGroup>
                                <label>Description</label>
                                <textarea
                                    value={newGroupDescription}
                                    onChange={(e) =>
                                        setNewGroupDescription(e.target.value)
                                    }
                                    placeholder="What is this group for?"
                                />
                            </FormGroup>
                            {!SYSTEM_GROUPS.includes(selectedGroup.name) && (
                                <FormGroup>
                                    <CheckboxGroup>
                                        <input
                                            type="checkbox"
                                            checked={newGroupIsDefault}
                                            onChange={(e) =>
                                                setNewGroupIsDefault(
                                                    e.target.checked
                                                )
                                            }
                                        />
                                        Set as default group for new users
                                    </CheckboxGroup>
                                </FormGroup>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                variant="secondary"
                                onClick={() => setEditModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleUpdateGroup}
                                disabled={processing === 'update'}
                            >
                                {processing === 'update'
                                    ? 'Saving...'
                                    : 'Save Changes'}
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </ModalOverlay>
            )}

            {/* Permissions Modal */}
            {permissionsModalOpen && selectedGroup && allPermissions && (
                <ModalOverlay onClick={() => setPermissionsModalOpen(false)}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        <ModalHeader>
                            <h2>Permissions: {selectedGroup.name}</h2>
                            <CloseButton
                                onClick={() => setPermissionsModalOpen(false)}
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
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </CloseButton>
                        </ModalHeader>
                        <ModalBody>
                            <p
                                style={{
                                    marginTop: 0,
                                    opacity: 0.7,
                                    fontSize: '0.875rem'
                                }}
                            >
                                Select permissions for this group. Changes are
                                synced GitHub-style (selected = granted,
                                unselected = revoked).
                            </p>
                            {Object.entries(allPermissions.byCategory).map(
                                ([category, perms]) => (
                                    <PermissionCategory key={category}>
                                        <h4>{category}</h4>
                                        <PermissionList>
                                            {perms.map((perm) => (
                                                <PermissionItem key={perm.id}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedPermissions.has(
                                                            perm.name
                                                        )}
                                                        onChange={() =>
                                                            togglePermission(
                                                                perm.name
                                                            )
                                                        }
                                                    />
                                                    <span>
                                                        <strong>
                                                            {perm.name}
                                                        </strong>
                                                        {perm.description && (
                                                            <small>
                                                                {
                                                                    perm.description
                                                                }
                                                            </small>
                                                        )}
                                                    </span>
                                                </PermissionItem>
                                            ))}
                                        </PermissionList>
                                    </PermissionCategory>
                                )
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                variant="secondary"
                                onClick={() => setPermissionsModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleUpdatePermissions}
                                disabled={processing === 'permissions'}
                            >
                                {processing === 'permissions'
                                    ? 'Saving...'
                                    : 'Save Permissions'}
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </ModalOverlay>
            )}
        </>
    );
}
