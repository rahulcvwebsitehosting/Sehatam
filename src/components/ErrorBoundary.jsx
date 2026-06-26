import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    try {
      const parsedError = JSON.parse(error.message);
      this.setState({ errorInfo: parsedError });
    } catch (e) {
      this.setState({ errorInfo: { error: error.message } });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-[480px] mx-auto px-[24px] py-[64px] bg-white text-center min-h-screen flex flex-col items-center justify-center">
          <div className="mb-8">
            <span className="material-symbols-outlined text-6xl text-error/20">error</span>
          </div>
          <h2 className="text-2xl font-black text-primary mb-4 font-headline">Something went wrong</h2>
          <p className="text-on-surface-variant/80 mb-8 font-medium">
            {this.state.errorInfo?.error || "An unexpected error occurred."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full h-[56px] bg-primary text-on-primary rounded-[12px] font-bold border-none cursor-pointer shadow-lg shadow-primary/20"
          >
            Reload Application
          </button>
          {this.state.errorInfo?.path && (
            <p className="mt-8 text-xs text-on-surface-variant/40">
              Path: {this.state.errorInfo.path} | Op: {this.state.errorInfo.operationType}
            </p>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
