'use client';
import React, { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div
            style={{
              padding: '2rem',
              textAlign: 'center',
              maxWidth: '500px',
              margin: '2rem auto'
            }}
          >
            <h2
              style={{
                color: 'hsla(22, 80%, 45%, 1)',
                fontFamily: 'Arial, Helvetica, sans-serif'
              }}
            >
              Something went wrong
            </h2>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              style={{
                padding: '0.4rem 1rem',
                background: 'hsla(22, 80%, 45%, 1)',
                color: 'white',
                border: 'none',
                borderRadius: '2px',
                cursor: 'pointer',
                fontFamily: 'Roboto, sans-serif',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em'
              }}
            >
              Try Again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
