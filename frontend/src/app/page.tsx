'use client';

import { useEffect, useState } from 'react';

interface HealthResponse {
  status: string;
  timestamp: string;
  service: string;
  version: string;
}

const features = [
  {
    number: '01',
    icon: '◈',
    title: 'Skill Profiling',
    desc: 'Track your technical growth with measurable skill intelligence and verified milestones.',
  },
  {
    number: '02',
    icon: '◇',
    title: 'Verified Portfolios',
    desc: 'Showcase real projects with transparent technical evidence and commit provenance.',
  },
  {
    number: '03',
    icon: '⌘',
    title: 'Smart Assessments',
    desc: 'Test coding ability through isolated execution environments and real-time evaluation.',
  },
  {
    number: '04',
    icon: '✦',
    title: 'Digital Certifications',
    desc: 'Build a verifiable record of your engineering achievements and credentials.',
  },
  {
    number: '05',
    icon: '◎',
    title: 'Peer Reviews',
    desc: 'Get structured technical feedback and improve through collaborative evaluation.',
  },
  {
    number: '06',
    icon: '⌁',
    title: 'Team Matcher',
    desc: 'Find compatible teammates using skills, project requirements and capacity.',
  },
];

export default function HomePage() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

        const res = await fetch(`${apiUrl}/api/health`);
        const data = await res.json();

        setHealth(data);
      } catch (err) {
        setError(
          'Could not connect to the API. Make sure the backend is running on port 5000.',
        );

        console.error('Health check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-[#070b14] text-white">

      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[140px]" />
        <div className="absolute right-[-10%] top-[20%] h-[450px] w-[450px] rounded-full bg-violet-600/10 blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[30%] h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-[130px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-xl text-cyan-300">
            ⚡
          </div>

          <div>
            <div className="text-lg font-black tracking-tight">
              SKILL<span className="text-cyan-400">FORGE</span>
            </div>
            <div className="text-[9px] uppercase tracking-[0.25em] text-slate-500">
              Engineering Intelligence
            </div>
          </div>
        </div>

        <div className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
          <a href="/" className="text-white transition hover:text-cyan-400">
            Home
          </a>
          <a
            href="/assessments"
            className="transition hover:text-cyan-400"
          >
            Assessments
          </a>
          <a href="/projects" className="transition hover:text-cyan-400">
            Projects
          </a>
          <a href="/teams" className="transition hover:text-cyan-400">
            Teams
          </a>
        </div>

        <a
          href="/login"
          className="rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-5 py-2.5 text-sm font-semibold text-cyan-300 transition hover:border-cyan-300 hover:bg-cyan-400/20"
        >
          Sign in
        </a>
      </nav>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-20 pt-16 md:pb-28 md:pt-24">

        <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">

          {/* Hero text */}
          <div>

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-xs font-medium text-cyan-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
              AI-POWERED ENGINEERING ECOSYSTEM
            </div>

            <h1 className="text-5xl font-black leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              BUILD
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                PROVE
              </span>
              <br />
              GROW.
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-slate-400 md:text-lg">
              A modern engineering platform for building skills, proving
              technical ability, creating verified portfolios and finding the
              right project teams.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">

              <a
                href="/login"
                className="group rounded-xl bg-cyan-400 px-7 py-3.5 font-bold text-slate-950 shadow-[0_0_35px_rgba(34,211,238,0.18)] transition hover:-translate-y-1 hover:bg-cyan-300"
              >
                Launch Console
                <span className="ml-2 transition group-hover:translate-x-1">
                  →
                </span>
              </a>

              <a
                href="/assessments"
                className="rounded-xl border border-white/10 bg-white/[0.04] px-7 py-3.5 font-semibold text-white backdrop-blur transition hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-white/[0.07]"
              >
                Explore Platform
              </a>

            </div>

            <div className="mt-8 flex items-center gap-3 text-xs text-slate-500">
              <span className="h-px w-10 bg-slate-700" />
              BUILT FOR THE NEXT GENERATION OF ENGINEERS
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative">

            <div className="absolute inset-0 rounded-3xl bg-cyan-400/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl backdrop-blur-xl">

              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Skill Intelligence
                  </p>
                  <p className="mt-1 text-lg font-bold">
                    Engineering Profile
                  </p>
                </div>

                <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-300">
                  ● VERIFIED
                </div>
              </div>

              <div className="mb-6 rounded-2xl border border-white/10 bg-[#0a101b] p-5">

                <div className="mb-4 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-slate-500">OVERALL PROFICIENCY</p>
                    <p className="mt-1 text-4xl font-black text-cyan-300">
                      82%
                    </p>
                  </div>

                  <span className="text-xs text-emerald-300">
                    +14.8% growth
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
                </div>
              </div>

              <div className="space-y-4">

                {[
                  ['Frontend Engineering', '91%'],
                  ['Backend Development', '78%'],
                  ['Problem Solving', '86%'],
                  ['System Design', '64%'],
                ].map(([skill, value]) => (
                  <div key={skill}>
                    <div className="mb-2 flex justify-between text-xs">
                      <span className="text-slate-400">{skill}</span>
                      <span className="text-cyan-300">{value}</span>
                    </div>

                    <div className="h-1.5 rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500"
                        style={{ width: value }}
                      />
                    </div>
                  </div>
                ))}

              </div>

              <div className="mt-7 grid grid-cols-2 gap-3">

                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">
                    Projects
                  </p>
                  <p className="mt-1 text-xl font-bold">24</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">
                    Certifications
                  </p>
                  <p className="mt-1 text-xl font-bold">08</p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-20">

        <div className="mb-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-white/10" />
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">
            Platform Metrics
          </span>
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {[
            ['60+', 'Language Engines', 'Isolated execution environments'],
            ['99.9%', 'System Availability', 'Real-time cluster SLA'],
            ['<150ms', 'Sandbox Runtime', 'Piston kernel latency'],
            ['±0.001%', 'Pass Tolerance', 'Automated test bounds'],
          ].map(([value, title, desc]) => (
            <div
              key={title}
              className="group rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-cyan-400/[0.04]"
            >
              <p className="text-3xl font-black text-cyan-300">{value}</p>
              <p className="mt-2 font-semibold text-white">{title}</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">{desc}</p>
            </div>
          ))}

        </div>
      </section>

      {/* API Status */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-20">

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] backdrop-blur-xl">

          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                System Diagnostics
              </p>
              <p className="mt-1 font-semibold">API Health Monitor</p>
            </div>

            <span className="font-mono text-xs text-cyan-300">
              SYS_DIAG
            </span>
          </div>

          <div className="p-6">

            {loading && (
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
                Connecting to SkillForge API...
              </div>
            )}

            {health && (
              <div className="grid gap-5 md:grid-cols-[auto_1fr] md:items-center">

                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.7)]" />

                  <div>
                    <p className="font-semibold text-emerald-300">
                      SYSTEM OPERATIONAL
                    </p>
                    <p className="text-xs text-slate-500">
                      API responded successfully
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">

                  <div className="rounded-xl border border-white/10 bg-[#080d17] p-4">
                    <p className="text-[10px] uppercase text-slate-500">
                      Service
                    </p>
                    <p className="mt-1 font-mono text-sm text-cyan-300">
                      {health.service}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-[#080d17] p-4">
                    <p className="text-[10px] uppercase text-slate-500">
                      Version
                    </p>
                    <p className="mt-1 font-mono text-sm text-cyan-300">
                      {health.version}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-[#080d17] p-4">
                    <p className="text-[10px] uppercase text-slate-500">
                      Response
                    </p>
                    <p className="mt-1 font-mono text-sm text-emerald-300">
                      200 OK
                    </p>
                  </div>

                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-3 text-amber-300">
                <span className="h-3 w-3 rounded-full bg-amber-400" />
                <div>
                  <p className="font-semibold">SYSTEM OFFLINE</p>
                  <p className="mt-1 text-xs text-slate-500">{error}</p>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24">

        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
            The SkillForge Stack
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
            Everything you need to
            <span className="text-cyan-400"> engineer your future.</span>
          </h2>

          <p className="mt-4 text-sm leading-6 text-slate-500">
            A connected ecosystem designed around measurable engineering
            growth, verified work and meaningful collaboration.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

          {features.map((feature) => (
            <div
              key={feature.number}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-cyan-400/[0.035]"
            >

              <div className="mb-7 flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-xl text-cyan-300 transition group-hover:scale-110">
                  {feature.icon}
                </div>

                <span className="font-mono text-xs text-slate-600">
                  FEAT-{feature.number}
                </span>
              </div>

              <h3 className="text-lg font-bold">{feature.title}</h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {feature.desc}
              </p>

              <div className="mt-6 flex items-center text-xs font-semibold text-cyan-400 opacity-0 transition group-hover:opacity-100">
                Explore feature →
              </div>

            </div>
          ))}

        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24">

        <div className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 via-blue-500/5 to-violet-500/10 p-8 text-center md:p-14">

          <div className="absolute left-1/2 top-0 h-40 w-80 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">
              Ready to build?
            </p>

            <h2 className="mt-4 text-3xl font-black md:text-5xl">
              Turn your skills into
              <br />
              <span className="text-cyan-300">proof.</span>
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-slate-400">
              Start building your engineering profile, complete assessments,
              showcase projects and connect with the right people.
            </p>

            <a
              href="/login"
              className="mt-8 inline-block rounded-xl bg-cyan-400 px-8 py-3.5 font-bold text-slate-950 shadow-[0_0_35px_rgba(34,211,238,0.2)] transition hover:-translate-y-1 hover:bg-cyan-300"
            >
              Enter SkillForge →
            </a>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 px-6 py-8">

        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 text-xs text-slate-600 md:flex-row">

          <div>
            © 2026 SkillForge · Engineering Intelligence Platform
          </div>

          <div className="font-mono uppercase tracking-wider">
            Built for engineers · v1.0.0
          </div>

        </div>

      </footer>

    </main>
  );
}