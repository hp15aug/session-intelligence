import Link from 'next/link';
import { ArrowRight, Brain, Video, Activity, Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">

      {/* Navbar */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-gray-900">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Activity size={18} />
            </div>
            SessionIntel
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/log-in"
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-all shadow-sm hover:shadow-md active:scale-95"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <div className="relative pt-20 pb-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wide">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                Now with Gemini 2.5 Flash
              </div>

              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1]">
                Understand your users, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                  one session at a time.
                </span>
              </h1>

              <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                Capture pixel-perfect session replays and get instant, AI-powered UX audits.
                Stop guessing why users drop off and start fixing it.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link
                  href="/dashboard"
                  className="h-12 px-8 rounded-full bg-indigo-600 text-white font-medium flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-xl active:scale-95"
                >
                  Dashboard
                  <ArrowRight size={18} />
                </Link>
                <a
                  href="https://github.com/hp15aug/session-intelligence"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-12 px-8 rounded-full bg-white border border-gray-200 text-gray-700 font-medium flex items-center gap-2 hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                  View on GitHub
                </a>
              </div>
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-20 right-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="bg-gray-50 py-24 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                  <Video size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">HD Session Replay</h3>
                <p className="text-gray-500 leading-relaxed">
                  Watch exactly what your users see. Every click, scroll, and mouse movement is captured with high fidelity using rrweb.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                  <Brain size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Heuristic Analysis</h3>
                <p className="text-gray-500 leading-relaxed">
                  Don't just watch—understand. Our Gemini-powered AI analyzes sessions to detect friction points, user intent, and confusion.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-6">
                  <Shield size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Privacy First</h3>
                <p className="text-gray-500 leading-relaxed">
                  Built with privacy in mind. Sensitive data is sanitized, and you own your data completely on your own Supabase instance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 font-bold text-gray-900">
            <div className="w-6 h-6 bg-gray-900 rounded-md flex items-center justify-center text-white">
              <Activity size={14} />
            </div>
            SessionIntel
          </div>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Session Intelligence. Open Source.
          </p>
        </div>
      </footer>
    </div>
  );
}