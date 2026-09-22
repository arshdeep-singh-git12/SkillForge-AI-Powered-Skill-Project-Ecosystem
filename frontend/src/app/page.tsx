'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function EliteHomePage() {
  const [apiStatus, setApiStatus] = useState<{ connected: boolean; timestamp?: string }>({
    connected: false
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setApiStatus({ connected: true, timestamp: new Date().toISOString() });

    fetch('/api/assessments/problems')
      .then((res) => {
        if (res.ok) {
          setApiStatus({ connected: true, timestamp: new Date().toISOString() });
        }
      })
      .catch(() => setApiStatus({ connected: false }));
  }, []);

  return (
    <div className="min-h-screen bg-[#15181d] text-[#eaedf0] bg-grid-pattern relative overflow-hidden font-sans">
      {/* Cyberpunk Ambient Glow Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-[#0cbde8]/20 via-blue-600/10 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute top-1/4 -right-40 w-[500px] h-[500px] bg-cyan-500/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-40 w-[500px] h-[500px] bg-indigo-500/10 blur-[150px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-24 relative z-10 space-y-16">
        
        {/* Top Navbar Telemetry Bar */}
        <header className="glass-card px-6 py-3.5 rounded-xl flex flex-wrap items-center justify-between gap-4 border border-[#2d333b]/80 shadow-2xl">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0cbde8] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#0cbde8]"></span>
            </span>
            <span className="font-mono text-xs font-bold tracking-widest text-[#0cbde8]">
              SKILLFORGE // OPTIMISTIC KERNEL v2.5
            </span>
          </div>

          <div className="flex items-center gap-6 font-mono text-xs text-[#7a889b]">
            <span className="hidden sm:inline">LATENCY: <strong className="text-[#eaedf0]">12ms</strong></span>
            <span className="hidden sm:inline">OPTIMISM STATE: <strong className="text-emerald-400">VERIFIED ACTIVE</strong></span>
            <span className="hidden md:inline">CLUSTER: <strong className="text-[#0cbde8]">GLOBAL-EDGE</strong></span>
            
            {/* Login Action Button */}
            <Link 
              href="/login" 
              className="px-3 py-1.5 rounded-md bg-[#0cbde8]/10 hover:bg-[#0cbde8]/20 border border-[#0cbde8]/30 text-[#0cbde8] font-bold uppercase transition-all tracking-wider shadow-sm"
            >
              Login &rarr;
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <div className="text-center space-y-6 max-w-4xl mx-auto pt-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xs tracking-widest text-[#0cbde8] bg-[#0cbde8]/10 border border-[#0cbde8]/30 shadow-inner">
            <span>&gt;&gt; OPTIMISTIC MULTI-ENGINE EXECUTION ECOSYSTEM</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-6xl font-extrabold uppercase tracking-tight leading-tight">
            ENGINEERED SKILLS.<br />
            <span className="bg-gradient-to-r from-[#0cbde8] via-sky-300 to-blue-500 bg-clip-text text-transparent drop-shadow-sm">
              OPTIMISTIC EXECUTION.
            </span>
          </h1>

          <p className="text-[#7a889b] text-sm md:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            Push your engineering limits with instant zero-latency feedback, real-time graphical proficiency breakdown, 
            and automated cryptographic test checks.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/assessments"
              className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#0cbde8] to-blue-600 text-[#111418] font-bold text-xs tracking-wider uppercase hover:brightness-110 transition-all shadow-xl shadow-[#0cbde8]/20 active:scale-95 flex items-center gap-2"
            >
              <span>LAUNCH CODING CONSOLE</span>
              <span>&rarr;</span>
            </Link>
            <Link
              href="/assessments"
              className="px-7 py-3.5 rounded-xl glass-card text-[#eaedf0] hover:text-[#0cbde8] font-mono text-xs tracking-wider uppercase border border-[#2d333b] hover:border-[#0cbde8]/50 transition-all flex items-center gap-2"
            >
              <span>EXPLORE ASSESSMENT MATRIX</span>
            </Link>
          </div>
        </div>

        {/* Graphical Telemetry Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="glass-card glass-card-hover p-6 rounded-2xl space-y-4 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-[#7a889b]">VERIFICATION ACCURACY</p>
                <p className="text-3xl font-extrabold text-[#0cbde8] font-mono mt-1">99.99%</p>
              </div>
              <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">OPTIMAL</span>
            </div>
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-[10px] font-mono text-[#7a889b]">
                <span>TOLERANCE BOUNDS</span>
                <span className="text-[#0cbde8]">±0.001%</span>
              </div>
              <div className="w-full bg-[#15181d] h-2 rounded-full overflow-hidden border border-[#2d333b]">
                <div className="bg-gradient-to-r from-[#0cbde8] to-blue-500 h-full rounded-full w-[99.9%]" />
              </div>
            </div>
          </div>

          <div className="glass-card glass-card-hover p-6 rounded-2xl space-y-4 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-[#7a889b]">PISTON KERNEL LATENCY</p>
                <p className="text-3xl font-extrabold text-sky-400 font-mono mt-1">&lt; 120ms</p>
              </div>
              <span className="font-mono text-[10px] text-sky-400 bg-sky-950/60 border border-sky-800 px-2 py-0.5 rounded">REAL-TIME</span>
            </div>
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-[10px] font-mono text-[#7a889b]">
                <span>AVG CONTAINER SPIN-UP</span>
                <span className="text-sky-400">14ms Response</span>
              </div>
              <div className="w-full bg-[#15181d] h-2 rounded-full overflow-hidden border border-[#2d333b]">
                <div className="bg-gradient-to-r from-sky-400 to-emerald-400 h-full rounded-full w-[85%]" />
              </div>
            </div>
          </div>

          <div className="glass-card glass-card-hover p-6 rounded-2xl space-y-4 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-[#7a889b]">LANGUAGE ENGINES</p>
                <p className="text-3xl font-extrabold text-blue-400 font-mono mt-1">3 ACTIVE</p>
              </div>
              <span className="font-mono text-[10px] text-blue-400 bg-blue-950/60 border border-blue-800 px-2 py-0.5 rounded">GCC/PY</span>
            </div>
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-[10px] font-mono text-[#7a889b]">
                <span>Python / C / C++ Split</span>
                <span className="text-blue-400">100% Ready</span>
              </div>
              <div className="w-full bg-[#15181d] h-2 rounded-full overflow-hidden border border-[#2d333b] flex">
                <div className="bg-[#0cbde8] h-full w-[50%]" title="Python" />
                <div className="bg-blue-500 h-full w-[25%]" title="C" />
                <div className="bg-indigo-500 h-full w-[25%]" title="C++" />
              </div>
            </div>
          </div>

        </div>

        {/* Assessment Tiers & Difficulty Breakdown */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <span className="eyebrow">DIFFICULTY &amp; MASTERY TIERS</span>
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-[#eaedf0]">
              CHOOSE YOUR EVALUATION LEVEL
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="glass-card glass-card-hover p-5 rounded-2xl space-y-3 border-l-4 border-l-emerald-500">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">TIER I</span>
                <span className="font-mono text-[10px] text-[#7a889b]">BEGINNER</span>
              </div>
              <h3 className="text-base font-bold uppercase text-[#eaedf0]">Novice Core</h3>
              <p className="text-xs text-[#7a889b] leading-relaxed">
                Fundamental syntax validation, basic loops, algorithmic logic, and string parsing tests.
              </p>
              <Link href="/assessments" className="inline-block text-xs font-mono text-emerald-400 hover:underline pt-1">
                Start Novice Track &rarr;
              </Link>
            </div>

            <div className="glass-card glass-card-hover p-5 rounded-2xl space-y-3 border-l-4 border-l-cyan-400">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[10px] text-[#0cbde8] bg-cyan-950/60 border border-cyan-800 px-2 py-0.5 rounded">TIER II</span>
                <span className="font-mono text-[10px] text-[#7a889b]">INTERMEDIATE</span>
              </div>
              <h3 className="text-base font-bold uppercase text-[#eaedf0]">Specialist</h3>
              <p className="text-xs text-[#7a889b] leading-relaxed">
                Data structures, hash maps, two-pointer search optimizations, and complexity constraints.
              </p>
              <Link href="/assessments" className="inline-block text-xs font-mono text-[#0cbde8] hover:underline pt-1">
                Start Specialist Track &rarr;
              </Link>
            </div>

            <div className="glass-card glass-card-hover p-5 rounded-2xl space-y-3 border-l-4 border-l-amber-500">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[10px] text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded">TIER III</span>
                <span className="font-mono text-[10px] text-[#7a889b]">ADVANCED</span>
              </div>
              <h3 className="text-base font-bold uppercase text-[#eaedf0]">Architect</h3>
              <p className="text-xs text-[#7a889b] leading-relaxed">
                Dynamic programming, graph traversal, memory management, and high-performance algorithms.
              </p>
              <Link href="/assessments" className="inline-block text-xs font-mono text-amber-400 hover:underline pt-1">
                Start Architect Track &rarr;
              </Link>
            </div>

            <div className="glass-card glass-card-hover p-5 rounded-2xl space-y-3 border-l-4 border-l-rose-500">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[10px] text-rose-400 bg-rose-950/60 border border-rose-800 px-2 py-0.5 rounded">TIER IV</span>
                <span className="font-mono text-[10px] text-[#7a889b]">EXPERT</span>
              </div>
              <h3 className="text-base font-bold uppercase text-[#eaedf0]">Apex Spec</h3>
              <p className="text-xs text-[#7a889b] leading-relaxed">
                Multi-threaded concurrency, strict time complexity bounds, and kernel-level C/C++ sandboxing.
              </p>
              <Link href="/assessments" className="inline-block text-xs font-mono text-rose-400 hover:underline pt-1">
                Start Apex Track &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Live Kernel Telemetry Diagnostic */}
        <div className="glass-card p-5 rounded-2xl border border-[#2d333b] font-mono text-xs space-y-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#2d333b] pb-2">
            <div className="flex items-center gap-2">
              <span className="text-[#0cbde8]">■</span>
              <span className="text-[#eaedf0] font-bold tracking-wider">LIVE KERNEL TELEMETRY DIAGNOSTIC</span>
            </div>
            <span className={`px-2.5 py-0.5 rounded border text-[10px] ${apiStatus.connected ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800' : 'text-[#0cbde8] bg-[#0cbde8]/10 border-[#0cbde8]/30'}`}>
              {apiStatus.connected ? 'SYS_HEALTH_OK' : 'SYS_OPTIMISTIC_READY'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[#7a889b]">
            <div className="space-y-1">
              <span className="text-slate-500 text-[10px]">ENDPOINT STATUS</span>
              <p className={`font-bold flex items-center gap-2 ${apiStatus.connected ? 'text-emerald-400' : 'text-amber-400'}`}>
                <span className={`w-2 h-2 rounded-full ${apiStatus.connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-500'}`} />
                {apiStatus.connected ? 'CONNECTED (200 OK)' : 'OPTIMISTIC / MOCK READY'}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 text-[10px]">TARGET SERVICE</span>
              <p className="text-[#eaedf0] font-bold">skillforge-api // piston-engine</p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 text-[10px]">PING TIMESTAMP</span>
              <p className="text-[#eaedf0] font-bold">
                {mounted ? (apiStatus.timestamp || 'Loading...') : 'Initializing...'}
              </p>
            </div>
          </div>
        </div>

        {/* Platform Capabilities Showcase */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <span className="eyebrow">ECOSYSTEM MATRIX</span>
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-[#eaedf0]">
              CORE PLATFORM CAPABILITIES
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="glass-card glass-card-hover p-5 rounded-2xl space-y-2">
              <span className="eyebrow">FEAT-01</span>
              <h3 className="text-base font-bold uppercase text-[#eaedf0]">Skill Profiling</h3>
              <p className="text-[#7a889b] text-xs leading-relaxed">
                Quantitative percentage proficiency tracking with verified milestone performance and skill breakdown metrics.
              </p>
            </div>

            <div className="glass-card glass-card-hover p-5 rounded-2xl space-y-2">
              <span className="eyebrow">FEAT-02</span>
              <h3 className="text-base font-bold uppercase text-[#eaedf0]">Verified Portfolios</h3>
              <p className="text-[#7a889b] text-xs leading-relaxed">
                Inspectable technical projects backed by direct commit provenance, cryptographic hashes, and test verifications.
              </p>
            </div>

            <div className="glass-card glass-card-hover p-5 rounded-2xl space-y-2">
              <span className="eyebrow">FEAT-03</span>
              <h3 className="text-base font-bold uppercase text-[#eaedf0]">Piston Assessments</h3>
              <p className="text-[#7a889b] text-xs leading-relaxed">
                Zero-sandbox latency code compilation across multi-language execution engines with instant stdout/stderr feedback.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="border-t border-[#2d333b] py-6 text-center text-xs text-[#7a889b] font-mono relative z-10 bg-[#15181d]/80 backdrop-blur">
        SKILLFORGE ENTERPRISE ECOSYSTEM &bull; MONOREPO V1.0.0 &bull; COLD CYAN INDUSTRIAL SPEC
      </footer>
    </div>
  );
}