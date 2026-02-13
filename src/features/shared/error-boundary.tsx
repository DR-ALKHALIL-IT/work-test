'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ApiError } from '@/lib/api';

interface ErrorBoundaryContentProps {
  error: Error;
  reset: () => void;
}

export function ErrorBoundaryContent({ error, reset }: ErrorBoundaryContentProps) {
  return (
    <div className="flex min-h-[200px] items-center justify-center p-4">
      <Card className="max-w-md p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Something went wrong
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {error instanceof ApiError
                ? error.message
                : error.message || 'An unexpected error occurred'}
            </p>
            {error instanceof ApiError && (
              <p className="mt-1 text-xs text-muted-foreground">
                Status: {error.status}
              </p>
            )}
          </div>
          <Button onClick={reset} variant="default" className="w-full">
            Try again
          </Button>
        </div>
      </Card>
    </div>
  );
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: (error: Error, reset: () => void) => React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[v0] ErrorBoundary caught error:', error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.reset);
      }

      return (
        <div className="flex min-h-screen items-center justify-center p-4">
          <Card className="max-w-md p-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Something went wrong
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {this.state.error instanceof ApiError
                    ? this.state.error.message
                    : this.state.error.message || 'An unexpected error occurred'}
                </p>
                {this.state.error instanceof ApiError && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Status: {this.state.error.status}
                  </p>
                )}
              </div>
              <Button onClick={this.reset} variant="default" className="w-full">
                Try again
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
