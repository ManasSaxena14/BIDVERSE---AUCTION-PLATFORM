import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Don't show error boundary for HMR-related context errors
    if (error.message?.includes('must be used within')) {
      console.warn('HMR Context error detected - this is normal during development');
      // Reset state to allow retry
      setTimeout(() => {
        this.setState({ hasError: false, error: null });
      }, 100);
      return;
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-bg-deep p-8">
          <div className="glass-card p-8 max-w-md text-center">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Something went wrong</h2>
            <p className="text-text-secondary mb-6">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="btn-gold"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
