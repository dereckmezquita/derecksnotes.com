'use client';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/utils/api';
import {
  Card,
  CardTitle,
  EmptyState,
  Button,
  ButtonRow
} from '@/components/ui/PageStyles';
import type { NotificationStats } from '@derecksnotes/shared';
import {
  StatGrid,
  StatCard,
  StatNumber,
  StatLabel,
  RankList,
  RankRow,
  RankNumber,
  BarValue
} from './_shared/styles';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '6px 8px',
  marginBottom: '0.5rem',
  border: '1px solid #ccc',
  borderRadius: 3,
  fontFamily: 'inherit'
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: 'vertical'
};

export function NotificationsTab() {
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [sendUsername, setSendUsername] = useState('');
  const [sendMessage, setSendMessage] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [broadcasting, setBroadcasting] = useState(false);

  const reload = async () => {
    try {
      const data = await api.get<NotificationStats>(
        '/admin/notifications/stats'
      );
      setStats(data);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    reload();
  }, []);

  const handleSend = async () => {
    if (!sendUsername.trim() || !sendMessage.trim()) {
      toast.error('Username and message required');
      return;
    }
    setSending(true);
    try {
      await api.post('/admin/notifications/send', {
        username: sendUsername.trim(),
        message: sendMessage.trim()
      });
      toast.success(`Notification sent to @${sendUsername.trim()}`);
      setSendUsername('');
      setSendMessage('');
      reload();
    } catch {
      // toast handled by api util
    } finally {
      setSending(false);
    }
  };

  const handleBroadcast = async () => {
    if (!broadcastMessage.trim()) {
      toast.error('Message required');
      return;
    }
    if (
      !confirm(
        'Broadcast this message to every active user? It cannot be unsent.'
      )
    )
      return;
    setBroadcasting(true);
    try {
      const result = await api.post<{ success: boolean; recipients: number }>(
        '/admin/notifications/broadcast',
        { message: broadcastMessage.trim() }
      );
      toast.success(`Broadcast sent to ${result.recipients} users`);
      setBroadcastMessage('');
      reload();
    } catch {
      // toast handled by api util
    } finally {
      setBroadcasting(false);
    }
  };

  return (
    <>
      <Card>
        <CardTitle>Volume</CardTitle>
        {!stats ? (
          <EmptyState>Loading…</EmptyState>
        ) : (
          <>
            <StatGrid>
              <StatCard>
                <StatNumber>{stats.total}</StatNumber>
                <StatLabel>Total</StatLabel>
              </StatCard>
              <StatCard>
                <StatNumber>{stats.unread}</StatNumber>
                <StatLabel>Unread</StatLabel>
              </StatCard>
              <StatCard>
                <StatNumber>{stats.last7Days}</StatNumber>
                <StatLabel>Last 7 days</StatLabel>
              </StatCard>
            </StatGrid>
            {stats.perType.length > 0 && (
              <RankList>
                {stats.perType.map((t) => (
                  <RankRow key={t.type}>
                    <RankNumber>·</RankNumber>
                    <div style={{ flex: 1 }}>{t.type}</div>
                    <BarValue>{t.count}</BarValue>
                  </RankRow>
                ))}
              </RankList>
            )}
          </>
        )}
      </Card>

      <Card>
        <CardTitle>Send to user</CardTitle>
        <p style={{ fontSize: '0.75rem', color: '#888', margin: '0 0 0.5rem' }}>
          Delivers a notification with type <code>admin.message</code> to the
          named user. Cannot be unsent.
        </p>
        <input
          type="text"
          placeholder="username"
          value={sendUsername}
          onChange={(e) => setSendUsername(e.target.value)}
          style={inputStyle}
        />
        <textarea
          placeholder="message"
          value={sendMessage}
          onChange={(e) => setSendMessage(e.target.value)}
          rows={3}
          maxLength={1000}
          style={textareaStyle}
        />
        <ButtonRow>
          <Button onClick={handleSend} disabled={sending}>
            {sending ? 'Sending…' : 'Send'}
          </Button>
        </ButtonRow>
      </Card>

      <Card>
        <CardTitle>Broadcast to all users</CardTitle>
        <p style={{ fontSize: '0.75rem', color: '#888', margin: '0 0 0.5rem' }}>
          Delivers <code>admin.broadcast</code> to every active user (one row
          per user, batched). Cannot be unsent — confirm before sending.
        </p>
        <textarea
          placeholder="announcement"
          value={broadcastMessage}
          onChange={(e) => setBroadcastMessage(e.target.value)}
          rows={3}
          maxLength={1000}
          style={textareaStyle}
        />
        <ButtonRow>
          <Button
            $variant="danger"
            onClick={handleBroadcast}
            disabled={broadcasting}
          >
            {broadcasting ? 'Broadcasting…' : 'Broadcast'}
          </Button>
        </ButtonRow>
      </Card>
    </>
  );
}
