import React from 'react';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Frontend Error caught by Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
          <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-2xl border border-slate-100 text-center space-y-6">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto border border-red-100">
              <AlertCircle className="w-10 h-10 text-secondary" />
            </div>
            <h2 className="text-3xl font-black text-slate-900">Something went wrong</h2>
            <p className="text-slate-500 font-medium">An unexpected error occurred. Please try refreshing the page or contact support.</p>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => window.location.reload()}
                className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
              >
                <RefreshCcw className="w-5 h-5" />
                Refresh Page
              </button>
              <a 
                href="/"
                className="w-full bg-white text-slate-700 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 border border-slate-200"
              >
                <Home className="w-5 h-5" />
                Go to Home
              </a>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <details className="text-left bg-slate-100 p-4 rounded-xl mt-6">
                <summary className="text-xs font-black text-slate-400 cursor-pointer uppercase tracking-widest">Error Details</summary>
                <pre className="text-[10px] text-red-500 mt-2 overflow-auto whitespace-pre-wrap">
                  {this.state.error?.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
