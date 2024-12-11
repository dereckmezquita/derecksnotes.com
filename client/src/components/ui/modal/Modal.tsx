import React from 'react';
import styled from 'styled-components';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
`;

const ModalContainer = styled.div`
    width: 450px;
    background-color: ${(props) =>
        props.theme.container.background.colour.primary()};
    padding: 20px;
    border: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    border-radius: 5px;
    box-shadow: ${(props) => props.theme.container.shadow.box};
    color: ${(props) => props.theme.text.colour.primary()};

    @media (max-width: 650px) {
        width: 95%;
    }
`;

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
`;

const ModalTitle = styled.h2`
    font-size: 1.5rem;
    font-weight: bold;
    color: ${(props) => props.theme.text.colour.primary()};
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    color: ${(props) => props.theme.text.colour.primary()};
    &:hover {
        color: ${(props) => props.theme.text.colour.anchor()};
    }
`;

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContainer onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                    <ModalTitle>{title}</ModalTitle>
                    <CloseButton onClick={onClose}>
                        <X size={24} />
                    </CloseButton>
                </ModalHeader>
                {children}
            </ModalContainer>
        </ModalOverlay>
    );
}
