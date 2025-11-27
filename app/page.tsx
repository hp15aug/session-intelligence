"use client"
import React, { useState } from 'react';

const App = () => {
  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center relative overflow-x-hidden font-sans text-slate-900">

      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-slate-100 blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-slate-50 blur-3xl"></div>
      </div>

      {/* Main Hero Content */}
      <main className="relative z-10 max-w-3xl px-6 mx-auto text-center space-y-10 pt-32 pb-16">

        {/* Badge */}
        <div className="inline-flex items-center px-3 py-1 rounded-full border border-slate-200 bg-slate-50 text-slate-600 text-xs font-medium tracking-wide uppercase mb-2">
          v2.0 Now Available
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter leading-[1.1]">
          Design with <br className="hidden md:block" />
          <span className="text-slate-400">absolute</span> clarity.
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-slate-500 font-light max-w-lg mx-auto leading-relaxed">
          Eliminate the noise. Focus on the essential. A workspace built for those who value precision over complexity.
        </p>

        {/* CTA Button */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-white transition-all duration-200 bg-slate-900 rounded-full hover:bg-slate-800 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
          >
            Go to Dashboard
            <svg
              className="w-4 h-4 ml-2 -mr-1 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>

          <button className="inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-slate-600 transition-all duration-200 bg-transparent rounded-full hover:text-slate-900 hover:bg-slate-50">
            Read Documentation
          </button>
        </div>
      </main>

      {/* Content Section / Quick Actions */}
      <section className="relative z-10 w-full max-w-4xl px-6 mx-auto mb-24 text-center">
        <div className="h-px w-24 bg-slate-200 mx-auto mb-16"></div>

        <h2 className="text-2xl font-semibold text-slate-800 mb-10 tracking-tight">Quick Actions</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-8 bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all duration-300">
            <div className="h-10 w-10 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <h3 className="font-medium text-slate-900 mb-2">Analytics</h3>
            <p className="text-sm text-slate-500 mb-6">View performance metrics.</p>
            <button className="w-full py-2.5 px-4 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 hover:text-slate-900 transition-colors">
              View Data
            </button>
          </div>

          {/* Card 2 */}
          <div className="p-8 bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all duration-300">
            <div className="h-10 w-10 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            </div>
            <h3 className="font-medium text-slate-900 mb-2">Exports</h3>
            <p className="text-sm text-slate-500 mb-6">Download your reports.</p>
            <button className="w-full py-2.5 px-4 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 hover:text-slate-900 transition-colors">
              Download
            </button>
          </div>

          {/* Card 3 */}
          <div className="p-8 bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all duration-300">
            <div className="h-10 w-10 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <h3 className="font-medium text-slate-900 mb-2">Settings</h3>
            <p className="text-sm text-slate-500 mb-6">Manage preferences.</p>
            <button className="w-full py-2.5 px-4 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 hover:text-slate-900 transition-colors">
              Configure
            </button>
          </div>
        </div>
      </section>

      {/* Footer / Simple refined footer for context */}
      <footer className="w-full text-center text-slate-400 text-sm font-light pb-6">
        <p>&copy; 2025 Minimalist Inc.</p>
      </footer>

    </div>
  );
};

export default App;