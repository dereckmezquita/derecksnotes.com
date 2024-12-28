'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { CommentList } from './CommentList';
import { CommentForm } from './CommentForm';
import { useAuth } from '@context/AuthContext';
import { api } from '@utils/api/api';

interface CommentsProps {
    postSlug: string;
}

const CommentsContainer = styled.div`
    margin-top: 40px;
    padding: 20px;
    background-color: ${(props) =>
        props.theme.container.background.colour.content()};
    border: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    border-radius: 5px;
    box-shadow: ${(props) => props.theme.container.shadow.box};
    color: ${(props) => props.theme.text.colour.primary()};
`;

const CommentsTitle = styled.h2`
    margin-bottom: 20px;
    font-size: 1.4em;
    font-variant: small-caps;
    color: ${(props) => props.theme.text.colour.primary()};
    border-bottom: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    padding-bottom: 10px;
`;

export function Comments({ postSlug }: CommentsProps) {
    const { user, loading: authLoading } = useAuth();
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchComments() {
            try {
                const res = await api.get(`/comments/post/${postSlug}?depth=2`);
                setComments(res.data);
            } catch (error) {
                console.error('Error fetching comments:', error);
            } finally {
                setLoading(false);
            }
        }
        if (postSlug) {
            fetchComments();
        }
    }, [postSlug]);

    const handleAddComment = async (text: string) => {
        try {
            const res = await api.post('/comments', {
                text,
                postSlug
            });
            setComments((prev) => [res.data, ...prev]);
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    return (
        <CommentsContainer>
            <CommentsTitle>Comments</CommentsTitle>
            {authLoading ? (
                <p>Checking authentication...</p>
            ) : user ? (
                <CommentForm onSubmit={handleAddComment} />
            ) : (
                <p style={{ marginBottom: '20px' }}>
                    <em>Please log in to leave a comment.</em>
                </p>
            )}
            {loading ? (
                <p>Loading comments...</p>
            ) : (
                <CommentList comments={comments} postSlug={postSlug} />
            )}
        </CommentsContainer>
    );
}
