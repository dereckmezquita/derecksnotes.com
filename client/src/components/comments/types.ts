import { User } from '@context/AuthContext';

export interface CommentAuthor {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
}

export interface CommentReactions {
    likes: number;
    dislikes: number;
    userReaction: 'like' | 'dislike' | null;
}

export interface CommentHistoryEntry {
    content: string;
    editedAt: string;
    isCurrent: boolean;
}

export interface ParentComment {
    id: string;
    content: string;
    isDeleted: boolean;
    user: CommentAuthor | null;
}

export interface CommentType {
    id: string;
    postSlug: string;
    parentId: string | null;
    content: string;
    depth: number;
    approved: boolean;
    createdAt: string;
    editedAt: string | null;
    isDeleted: boolean;
    isOwner: boolean;
    user: CommentAuthor | null;
    reactions: CommentReactions;
    replies?: CommentType[];
    totalReplies?: number;
    hasMoreReplies?: boolean;
    parentComment?: ParentComment | null;
}

export interface CommentPagination {
    page: number;
    limit: number;
    totalTopLevel: number;
    hasMore: boolean;
}

export interface ReplyPagination {
    offset: number;
    limit: number;
    totalReplies: number;
    hasMore: boolean;
}

export interface CommentResponse {
    comments: CommentType[];
    pagination: CommentPagination;
}

export interface RepliesResponse {
    replies: CommentType[];
    pagination: ReplyPagination;
}

export interface CommentItemProps {
    comment: CommentType;
    postSlug: string;
    currentUser: User | null;
    level: number;
    onUpdateComment: (
        commentId: string,
        updateFn: (comment: CommentType) => CommentType
    ) => void;
    onAddReply?: (parentId: string, newReply: CommentType) => void;
    isProfileView?: boolean;
    onDelete?: (id: string) => Promise<void>;
}

export interface CommentFormProps {
    onSubmit: (text: string) => void;
    initialValue?: string;
    submitLabel?: string;
    onCancel?: () => void;
    isReply?: boolean;
    isEdit?: boolean;
}

export interface CommentListProps {
    comments: CommentType[];
    postSlug: string;
    currentUser: User | null;
    onUpdateComment: (
        commentId: string,
        updateFn: (comment: CommentType) => CommentType
    ) => void;
    onAddReply?: (parentId: string, newReply: CommentType) => void;
    level?: number;
    isProfileView?: boolean;
    onDelete?: (id: string) => Promise<void>;
}
