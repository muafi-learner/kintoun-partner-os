import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      // Clear localStorage items that might have corrupted the app
      const keysToClear = [
        'kintoun_main_news_v2',
        'kintoun_specific_news_v2',
        'kintoun_subcategories_v2'
      ];
      keysToClear.forEach(k => {
        try {
          const item = localStorage.getItem(k);
          if (item && item.length > 500000) {
            localStorage.removeItem(k);
          }
        } catch {}
      });
    } catch {}
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f7f5ed] flex items-center justify-center p-4 font-sans">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-xl border border-slate-200 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">Terjadi Kendala Tampilan</h2>
            <p className="text-sm text-slate-600 mb-6">
              Aplikasi mendeteksi kendala pada memori lokal saat memproses data. Anda dapat memuat ulang aplikasi dengan aman.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-[#00263f] text-white hover:bg-[#00375b] transition shadow-sm cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Muat Ulang Aplikasi</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
