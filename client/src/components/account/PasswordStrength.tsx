'use client';
import React from 'react';
import { PASSWORD_RULES } from '@derecksnotes/shared';

export function PasswordStrength({ password }: { password: string }) {
  const checks = [
    {
      label: `${PASSWORD_RULES.minLength}+ characters`,
      pass: password.length >= PASSWORD_RULES.minLength
    },
    { label: 'Uppercase letter', pass: /[A-Z]/.test(password) },
    { label: 'Lowercase letter', pass: /[a-z]/.test(password) },
    { label: 'Number', pass: /[0-9]/.test(password) }
  ];

  return (
    <div
      style={{
        fontSize: '0.75rem',
        margin: '0 0 0.5rem',
        display: 'flex',
        gap: '0.75rem',
        flexWrap: 'wrap'
      }}
    >
      {checks.map((c) => (
        <span key={c.label} style={{ color: c.pass ? '#0F9960' : '#999' }}>
          {c.pass ? '✓' : '✗'} {c.label}
        </span>
      ))}
    </div>
  );
}
