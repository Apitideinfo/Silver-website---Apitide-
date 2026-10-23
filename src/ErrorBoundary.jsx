import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Showroom Error Boundary caught an exception:", error, errorInfo);
    
    // Check if error is chunk load / stale deployment error
    const isChunkLoadError = 
      error?.message?.includes('Failed to fetch dynamically imported module') ||
      error?.message?.includes('Importing a module script failed') ||
      error?.name === 'ChunkLoadError' ||
      String(error).includes('dynamically imported module');

    if (isChunkLoadError) {
      const reloaded = sessionStorage.getItem('hrj_eb_chunk_reload');
      if (!reloaded) {
        sessionStorage.setItem('hrj_eb_chunk_reload', '1');
        window.location.reload();
      }
    }
  }

  handleReset = () => {
    try {
      localStorage.removeItem('hrj_cart');
      localStorage.removeItem('hrj_wishlist');
      sessionStorage.clear();
    } catch {
      // ignore
    }
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  handleReload = () => {
    try {
      sessionStorage.clear();
    } catch {
      // ignore
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const isChunkError =
        this.state.error?.message?.includes('Failed to fetch dynamically imported module') ||
        this.state.error?.message?.includes('Importing a module script failed') ||
        this.state.error?.name === 'ChunkLoadError' ||
        String(this.state.error).includes('dynamically imported module');

      return (
        <div className="min-h-screen bg-[#13071C] flex flex-col items-center justify-center p-6 text-center select-none text-white">
          <div className="absolute w-[400px] h-[400px] rounded-full bg-[#B09A82]/5 blur-[120px] pointer-events-none" />
          <div className="relative mb-6">
            <div className="w-16 h-16 rounded-full bg-[#B09A82]/20 flex items-center justify-center mx-auto text-[#B09A82] animate-pulse shadow-lg">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 3h12l4 6-10 12L2 9l4-6z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2 9h20M10 3l-2 6 4 12 4-12-2-6" />
              </svg>
            </div>
          </div>
          <h1 className="serif-luxury text-2xl sm:text-3xl font-extrabold tracking-wider gold-metallic-text uppercase mb-3">
            {isChunkError ? 'New Storefront Update Available' : 'Maison Care Required'}
          </h1>
          <p className="text-xs tracking-widest text-[#B09A82]/80 max-w-md mx-auto leading-relaxed mb-4 font-sans normal-case">
            {isChunkError 
              ? 'A fresh update has been deployed to MANISH & CO. Please refresh to load the latest collection and features.'
              : 'A boutique runtime exception has occurred. Our master artisans are already notified.'}
          </p>

          {this.state.error && !isChunkError && (
            <div className="bg-black/50 border border-pink-500/30 rounded-xl p-3 max-w-lg mx-auto mb-6 text-left overflow-auto max-h-40">
              <p className="text-pink-400 font-mono text-[11px] font-bold">{this.state.error?.toString()}</p>
              {this.state.error?.stack && (
                <pre className="text-zinc-400 font-mono text-[9px] mt-1 whitespace-pre-wrap leading-tight">{this.state.error.stack}</pre>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={this.handleReload}
              className="px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 border bg-[#B09A82] text-white hover:bg-white hover:text-black border-transparent cursor-pointer shadow-md font-bold"
            >
              Update &amp; Refresh Now
            </button>
            <button
              onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = '/'; }}
              className="px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 border border-white/30 text-white hover:bg-white/10 cursor-pointer shadow-md bg-transparent"
            >
              Return to Storefront
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
