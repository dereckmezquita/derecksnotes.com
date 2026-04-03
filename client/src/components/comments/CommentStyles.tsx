import styled from 'styled-components';

export const CommentsSection = styled.section`
  margin-top: ${(p) => p.theme.container.spacing.large};
  padding-top: ${(p) => p.theme.container.spacing.large};
  border-top: 1px solid ${(p) => p.theme.container.border.colour.primary()};
`;

export const CommentsTitle = styled.h3`
  font-family: ${(p) => p.theme.text.font.header};
  color: ${(p) => p.theme.text.colour.header()};
  font-size: ${(p) => p.theme.text.size.large};
  margin: 0 0 ${(p) => p.theme.container.spacing.medium} 0;
`;

export const CommentFormWrapper = styled.div`
  margin-bottom: ${(p) => p.theme.container.spacing.large};
`;

export const CommentTextarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: ${(p) => p.theme.container.spacing.small};
  border: 1px solid ${(p) => p.theme.container.border.colour.primary()};
  border-radius: ${(p) => p.theme.container.border.radius};
  font-family: ${(p) => p.theme.text.font.roboto};
  font-size: ${(p) => p.theme.text.size.normal};
  resize: vertical;
  background: ${(p) => p.theme.container.background.colour.card()};

  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.text.colour.header()};
  }

  &::placeholder {
    color: ${(p) => p.theme.text.colour.light_grey()};
  }
`;

export const CommentSubmitButton = styled.button`
  margin-top: ${(p) => p.theme.container.spacing.small};
  padding: ${(p) => p.theme.container.spacing.small}
    ${(p) => p.theme.container.spacing.medium};
  background: ${(p) => p.theme.text.colour.header()};
  color: white;
  border: none;
  border-radius: ${(p) => p.theme.container.border.radius};
  font-family: ${(p) => p.theme.text.font.roboto};
  font-size: ${(p) => p.theme.text.size.small};
  font-weight: ${(p) => p.theme.text.weight.bold};
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const CommentCard = styled.div<{ $depth: number }>`
  border-left: ${(p) =>
    p.$depth > 0 ? `2px solid ${p.theme.text.colour.header()}` : 'none'};
  border-bottom: ${(p) =>
    p.$depth === 0
      ? `1px solid ${p.theme.container.border.colour.primary()}`
      : 'none'};
  padding: ${(p) => p.theme.container.spacing.small} 0;
  padding-left: ${(p) =>
    p.$depth > 0 ? p.theme.container.spacing.small : '0'};
  margin-left: ${(p) => (p.$depth > 0 ? '0.75rem' : '0')};
  margin-top: ${(p) => (p.$depth > 0 ? p.theme.container.spacing.xsmall : '0')};
`;

export const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.container.spacing.xsmall};
  margin-bottom: 2px;
  font-size: ${(p) => p.theme.text.size.small};
`;

export const CommentAuthor = styled.a`
  font-weight: ${(p) => p.theme.text.weight.bold};
  color: ${(p) => p.theme.text.colour.anchor()};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const CommentTimestamp = styled.span`
  color: ${(p) => p.theme.text.colour.light_grey()};
`;

export const EditedBadge = styled.span`
  color: ${(p) => p.theme.text.colour.light_grey()};
  cursor: pointer;
  text-decoration: underline dotted;

  &:hover {
    color: ${(p) => p.theme.text.colour.anchor()};
  }
`;

export const PendingBadge = styled.span`
  color: ${(p) => p.theme.colours.warning};
  font-size: ${(p) => p.theme.text.size.small};
  font-style: italic;
`;

export const DeletedMessage = styled.em`
  color: ${(p) => p.theme.text.colour.light_grey()};
`;

export const CommentBody = styled.div`
  font-family: ${(p) => p.theme.text.font.roboto};
  font-size: ${(p) => p.theme.text.size.normal};
  line-height: 1.6;
  color: ${(p) => p.theme.text.colour.primary()};

  p {
    margin: 0 0 0.5em 0;
  }
  p:last-child {
    margin: 0;
  }
  code {
    background: ${(p) => p.theme.container.background.colour.light_contrast()};
    padding: 0.1em 0.3em;
    border-radius: 3px;
    font-size: 0.9em;
  }
  pre {
    background: ${(p) => p.theme.container.background.colour.light_contrast()};
    padding: ${(p) => p.theme.container.spacing.small};
    border-radius: ${(p) => p.theme.container.border.radius};
    overflow-x: auto;
  }
  blockquote {
    border-left: 3px solid ${(p) => p.theme.container.border.colour.primary()};
    margin: 0.5em 0;
    padding-left: ${(p) => p.theme.container.spacing.small};
    color: ${(p) => p.theme.text.colour.light_grey()};
  }
`;

export const CommentActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.container.spacing.small};
  margin-top: 2px;
  font-size: ${(p) => p.theme.text.size.small};
`;

export const ActionButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: ${(p) => p.theme.text.size.small};
  color: ${(p) =>
    p.$active
      ? p.theme.text.colour.header()
      : p.theme.text.colour.light_grey()};

  &:hover {
    background: ${(p) => p.theme.container.background.colour.light_contrast()};
    color: ${(p) => p.theme.text.colour.header()};
  }
`;

export const ReplyLink = styled.button`
  background: none;
  border: none;
  border-left: 1px solid ${(p) => p.theme.container.border.colour.primary()};
  cursor: pointer;
  color: ${(p) => p.theme.text.colour.light_grey()};
  font-size: ${(p) => p.theme.text.size.small};
  padding: 0 0 0 ${(p) => p.theme.container.spacing.small};

  &:hover {
    color: ${(p) => p.theme.text.colour.anchor()};
  }
`;

export const LoginPrompt = styled.p`
  color: ${(p) => p.theme.text.colour.light_grey()};
  font-size: ${(p) => p.theme.text.size.small};
  font-style: italic;
`;

export const HistoryModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const HistoryContent = styled.div`
  background: ${(p) => p.theme.container.background.colour.card()};
  border: 1px solid ${(p) => p.theme.container.border.colour.primary()};
  border-radius: ${(p) => p.theme.container.border.radius};
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  padding: ${(p) => p.theme.container.spacing.large};
`;

export const HistoryEntry = styled.div`
  padding: ${(p) => p.theme.container.spacing.medium};
  border-bottom: 1px solid ${(p) => p.theme.container.border.colour.primary()};

  &:last-child {
    border-bottom: none;
  }
`;

export const HistoryMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${(p) => p.theme.text.size.small};
  color: ${(p) => p.theme.text.colour.light_grey()};
  margin-bottom: ${(p) => p.theme.container.spacing.small};
`;

export const HistoryCloseButton = styled.button`
  float: right;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${(p) => p.theme.text.colour.light_grey()};

  &:hover {
    color: ${(p) => p.theme.text.colour.primary()};
  }
`;

export const NoCommentsMessage = styled.p`
  color: ${(p) => p.theme.text.colour.light_grey()};
  font-style: italic;
  text-align: center;
  padding: ${(p) => p.theme.container.spacing.large} 0;
`;

export const LoadMoreButton = styled.button`
  display: block;
  margin: ${(p) => p.theme.container.spacing.small} auto;
  padding: 4px ${(p) => p.theme.container.spacing.medium};
  background: none;
  border: 1px solid ${(p) => p.theme.container.border.colour.primary()};
  border-radius: ${(p) => p.theme.container.border.radius};
  cursor: pointer;
  color: ${(p) => p.theme.text.colour.light_grey()};
  font-family: ${(p) => p.theme.text.font.roboto};
  font-size: ${(p) => p.theme.text.size.small};

  &:hover {
    border-color: ${(p) => p.theme.text.colour.header()};
    color: ${(p) => p.theme.text.colour.header()};
  }
`;

export const LoadMoreReplies = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${(p) => p.theme.text.colour.light_grey()};
  font-size: ${(p) => p.theme.text.size.small};
  padding: 2px 0;
  margin-left: 0.75rem;

  &:hover {
    color: ${(p) => p.theme.text.colour.anchor()};
  }
`;
