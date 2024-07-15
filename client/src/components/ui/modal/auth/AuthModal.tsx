import React, { useState } from 'react';
import { Modal } from '../Modal';
import { AuthViews } from './AuthViews/AuthViews';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [title, setTitle] = useState('Login');

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <AuthViews onAuthSuccess={onClose} onTitleChange={setTitle} />
        </Modal>
    );
}
