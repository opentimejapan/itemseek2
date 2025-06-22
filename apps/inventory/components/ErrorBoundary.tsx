'use client';

import React, { Component, ReactNode } from 'react';
import { TouchButton, MobileCard } from '@itemseek2/ui-mobile';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
  errorCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      errorCount: 0
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log to error reporting service
    if (typeof window !== 'undefined' && (window as any).errorReporter) {
      (window as any).errorReporter.log({
        error,
        errorInfo,
        timestamp: new Date(),
        userAgent: navigator.userAgent,
        url: window.location.href
      });
    }

    this.setState(prevState => ({
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));

    // Store error in localStorage for debugging
    try {
      const errorLog = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        url: window.location.href
      };
      
      const existingLogs = JSON.parse(
        localStorage.getItem('error-logs') || '[]'
      );
      existingLogs.push(errorLog);
      
      // Keep only last 10 errors
      if (existingLogs.length > 10) {
        existingLogs.shift();
      }
      
      localStorage.setItem('error-logs', JSON.stringify(existingLogs));
    } catch (e) {
      // Ignore localStorage errors
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return <>{this.props.fallback}</>;
      }

      const isDevelopment = process.env.NODE_ENV === 'development';
      const isRecurringError = this.state.errorCount > 3;

      return (
        <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
          <MobileCard className="max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Oops! Something went wrong
              </h2>
              
              <p className="text-gray-600 mb-6">
                {isRecurringError
                  ? "We're having persistent issues. Please try reloading the page."
                  : "We encountered an unexpected error. Don't worry, your data is safe."}
              </p>

              {isDevelopment && this.state.error && (
                <div className="mb-6 text-left">
                  <details className="bg-gray-100 rounded-lg p-4">
                    <summary className="font-semibold cursor-pointer">
                      Error Details
                    </summary>
                    <pre className="mt-2 text-xs overflow-auto text-red-600">
                      {this.state.error.message}
                      {this.state.error.stack}
                    </pre>
                    {this.state.errorInfo && (
                      <pre className="mt-2 text-xs overflow-auto text-gray-600">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </details>
                </div>
              )}

              <div className="flex gap-3">
                <TouchButton
                  variant="secondary"
                  fullWidth
                  onClick={this.handleReset}
                  disabled={isRecurringError}
                >
                  Try Again
                </TouchButton>
                <TouchButton
                  variant="primary"
                  fullWidth
                  onClick={this.handleReload}
                >
                  Reload Page
                </TouchButton>
              </div>

              {isRecurringError && (
                <p className="mt-4 text-sm text-gray-500">
                  If this problem persists, please contact support.
                </p>
              )}
            </div>
          </MobileCard>
        </div>
      );
    }

    return this.props.children;
  }
}