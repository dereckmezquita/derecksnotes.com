import { User } from '@context/AuthContext';

export interface CommentType {
    _id: string;
    text: string;
    author: {
        _id: string;
        username: string;
        firstName: string;
        lastName?: string;
        profilePhoto?: string;
    };
    createdAt: string;
    lastEditedAt?: string;
    likes: any[];
    dislikes: any[];
    deleted: boolean;
    revisions?: { text: string; timestamp: string }[];
    replies?: CommentType[];
    post?: {
        _id: string;
        title: string;
        slug: string;
    };
}

export interface PaginationInfo {
    total: number;
    page: number;
    pageSize: number;
    pages: number;
    hasMore?: boolean;
    nextSkip?: number | null;
}

export interface CommentResponse {
    comments: CommentType[];
    pagination: PaginationInfo;
}

export interface ReplyResponse {
    replies: CommentType[];
    pagination: PaginationInfo;
}

export interface CommentItemProps {
    comment: CommentType;
    postSlug?: string;
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
    postSlug?: string;
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
