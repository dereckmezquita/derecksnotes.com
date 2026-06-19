'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import {
  Card,
  CardTitle,
  Label,
  Input,
  TextArea,
  Button,
  ButtonRow,
  SuccessMessage,
  ErrorMessage
} from '@/components/ui/PageStyles';
import type {
  SocialLink,
  UpdateProfileInput,
  User
} from '@derecksnotes/shared';

const SOCIAL_LINK_LIMIT = 8;

const blankLink = (): SocialLink => ({ label: '', url: '' });

/**
 * Small inline 'x' that lives flush with the row's vertical centre — the
 * previous control was a full Button with default padding, which made the
 * row taller than the inputs. Square so the hit-area scales with the input
 * height; visually a chip, not a button.
 */
const SocialRow = styled.div`
  display: flex;
  align-items: stretch;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
`;

const RemoveX = styled.button`
  flex: 0 0 auto;
  width: 28px;
  align-self: stretch;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid transparent;
  color: ${(p) => p.theme.text.colour.light_grey()};
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.1rem;
  line-height: 1;
  padding: 0;

  &:hover {
    color: #c62828;
    border-color: #e0bcbc;
    background: #fbeaea;
  }
`;

const ProfilePreviewLink = styled(Link)`
  font-size: 0.85rem;
  color: ${(p) => p.theme.text.colour.header()};
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
`;

export function ProfileTab({
  user,
  updateProfile,
  changeUsername
}: {
  user: User;
  updateProfile: (data: UpdateProfileInput) => Promise<void>;
  changeUsername: (username: string) => Promise<void>;
}) {
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [bio, setBio] = useState(user.bio || '');
  const [location, setLocation] = useState(user.location || '');
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
    user.socialLinks && user.socialLinks.length > 0
      ? user.socialLinks
      : [blankLink()]
  );
  const [newUsername, setNewUsername] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateLink = (idx: number, patch: Partial<SocialLink>) =>
    setSocialLinks((prev) =>
      prev.map((l, i) => (i === idx ? { ...l, ...patch } : l))
    );

  const addLink = () =>
    setSocialLinks((prev) =>
      prev.length < SOCIAL_LINK_LIMIT ? [...prev, blankLink()] : prev
    );

  const removeLink = (idx: number) =>
    setSocialLinks((prev) =>
      prev.length === 1 ? [blankLink()] : prev.filter((_, i) => i !== idx)
    );

  const handleSaveProfile = async () => {
    setSaving(true);
    setSuccess(null);
    setError(null);
    try {
      const cleaned = socialLinks
        .map((l) => ({ label: l.label.trim(), url: l.url.trim() }))
        .filter((l) => l.label && l.url);
      await updateProfile({
        displayName: displayName || undefined,
        bio: bio || undefined,
        location: location || null,
        socialLinks: cleaned.length > 0 ? cleaned : null
      });
      setSuccess('Profile updated');
    } catch {
      setError('Failed to update profile (HTTPS URLs only)');
    } finally {
      setSaving(false);
    }
  };

  const handleChangeUsername = async () => {
    if (!newUsername.trim()) return;
    setSaving(true);
    setSuccess(null);
    setError(null);
    try {
      await changeUsername(newUsername.trim());
      setNewUsername('');
      setSuccess('Username changed');
    } catch (err: any) {
      setError(err.data?.error || 'Failed to change username');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Card>
        <HeaderRow>
          <CardTitle style={{ margin: 0 }}>Edit Profile</CardTitle>
          <ProfilePreviewLink
            href={`/profile/${user.username}`}
            target="_blank"
          >
            View public profile →
          </ProfilePreviewLink>
        </HeaderRow>
        <Label>Display Name</Label>
        <Input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Your display name"
          maxLength={50}
        />
        <Label>Bio</Label>
        <TextArea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell us about yourself"
          maxLength={500}
        />
        <Label>Location</Label>
        <Input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="City, country (optional)"
          maxLength={100}
        />
        <Label>Social links (HTTPS only, up to {SOCIAL_LINK_LIMIT})</Label>
        {socialLinks.map((l, i) => (
          <SocialRow key={i}>
            <Input
              value={l.label}
              onChange={(e) => updateLink(i, { label: e.target.value })}
              placeholder="Label (e.g. GitHub)"
              maxLength={30}
              style={{ width: '140px' }}
            />
            <Input
              value={l.url}
              onChange={(e) => updateLink(i, { url: e.target.value })}
              placeholder="https://…"
              maxLength={500}
              style={{ flex: 1 }}
            />
            <RemoveX
              type="button"
              onClick={() => removeLink(i)}
              title="Remove link"
              aria-label="Remove link"
            >
              ×
            </RemoveX>
          </SocialRow>
        ))}
        {socialLinks.length < SOCIAL_LINK_LIMIT && (
          <ButtonRow>
            <Button
              type="button"
              $variant="secondary"
              onClick={addLink}
              style={{ padding: '4px 10px' }}
            >
              + Add link
            </Button>
          </ButtonRow>
        )}
        {success && <SuccessMessage>{success}</SuccessMessage>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <ButtonRow>
          <Button onClick={handleSaveProfile} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </ButtonRow>
      </Card>

      <Card>
        <CardTitle>Change Username</CardTitle>
        <Label>New Username</Label>
        <Input
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          placeholder="New username (3-30 chars)"
          maxLength={30}
        />
        <ButtonRow>
          <Button
            onClick={handleChangeUsername}
            disabled={saving || !newUsername.trim()}
          >
            Change Username
          </Button>
        </ButtonRow>
      </Card>
    </>
  );
}
