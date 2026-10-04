'use client';

import { useEffect, useState } from 'react';

interface Certificate {
  _id?: string;
  name: string;
  organization: string;
  date: string;
  verificationLink?: string;
  isSystemBadge?: boolean;
}

export default function CertificationsPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const [form, setForm] = useState({
    name: '',
    organization: '',
    date: '',
    verificationLink: '',
  });

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const userId =
        typeof window !== 'undefined'
          ? localStorage.getItem('userId')
          : null;

      if (!userId) {
        setLoading(false);
        return;
      }

      const res = await fetch(
        `${apiUrl}/api/certifications/user/${userId}`
      );

      if (!res.ok) throw new Error('Failed');

      const data = await res.json();

      setCertificates(data.certifications || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addCertificate = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!form.name || !form.organization || !form.date) {
      alert('Please fill the required fields.');
      return;
    }

    try {
      setAdding(true);

      const userId =
        typeof window !== 'undefined'
          ? localStorage.getItem('userId')
          : null;

      if (!userId) {
        alert('Please login first.');
        return;
      }

      const res = await fetch(`${apiUrl}/api/certifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          name: form.name,
          organization: form.organization,
          date: form.date,
          verificationLink: form.verificationLink,
        }),
      });

      if (!res.ok) throw new Error('Failed');

      setForm({
        name: '',
        organization: '',
        date: '',
        verificationLink: '',
      });

      await fetchCertificates();
    } catch (error) {
      console.error(error);
      alert('Could not add certificate.');
    } finally {
      setAdding(false);
    }
  };

  const badges = certificates.filter(
    (c) => c.isSystemBadge
  );

  const external = certificates.filter(
    (c) => !c.isSystemBadge
  );

  return (
    <main className="min-h-screen bg-[#050816] text-white overflow-hidden">

      {/* BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none">

        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)',
            backgroundSize: '55px 55px',
          }}
        />

        <div className="absolute top-[-250px] left-[-150px] w-[600px] h-[600px] rounded-full bg-cyan-500/15 blur-[150px]" />

        <div className="absolute top-[35%] right-[-250px] w-[600px] h-[600px] rounded-full bg-purple-600/15 blur-[170px]" />

        <div className="absolute bottom-[-300px] left-[35%] w-[500px] h-[500px] rounded-full bg-pink-500/10 blur-[160px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-10">

        {/* TOP NAV */}
        <div className="flex items-center justify-between mb-14">

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-black shadow-[0_0_30px_rgba(34,211,238,.25)]">
              SF
            </div>

            <div>
              <p className="font-bold tracking-wide">
                SKILL<span className="text-cyan-400">FORGE</span>
              </p>

              <p className="text-[10px] text-slate-500 uppercase tracking-[.25em]">
                Achievement Vault
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-400/20 bg-emerald-400/5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
            <span className="text-xs text-emerald-300">
              Profile Verified
            </span>
          </div>

        </div>

        {/* HERO */}
        <section className="grid lg:grid-cols-[1.4fr_.6fr] gap-8 items-center mb-16">

          <div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/5 text-cyan-300 text-xs mb-6">
              <span>✦</span>
              YOUR ACHIEVEMENT SPACE
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[.95] tracking-tight">
              Skills that
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                speak for you.
              </span>
            </h1>

            <p className="text-slate-400 max-w-xl mt-6 text-base leading-7">
              Your certifications, badges and verified achievements —
              beautifully organized in one professional profile.
            </p>

          </div>

          {/* STAT ORB */}
          <div className="flex justify-center lg:justify-end">

            <div className="relative w-56 h-56">

              <div className="absolute inset-0 rounded-full border border-cyan-400/20 animate-[spin_12s_linear_infinite]" />

              <div className="absolute inset-5 rounded-full border border-purple-400/20 animate-[spin_8s_linear_infinite_reverse]" />

              <div className="absolute inset-10 rounded-full bg-gradient-to-br from-cyan-400/20 to-purple-500/20 border border-white/10 backdrop-blur-xl flex flex-col items-center justify-center shadow-[0_0_80px_rgba(34,211,238,.12)]">

                <span className="text-5xl font-black">
                  {certificates.length}
                </span>

                <span className="text-xs uppercase tracking-[.2em] text-slate-400 mt-1">
                  Credentials
                </span>

              </div>

              <span className="absolute top-5 right-3 text-cyan-400 text-xs">
                ✦
              </span>

              <span className="absolute bottom-8 left-3 text-purple-400 text-xs">
                ✦
              </span>

            </div>

          </div>

        </section>

        {/* BADGES */}
        {badges.length > 0 && (
          <section className="mb-16">

            <div className="flex items-end justify-between mb-6">

              <div>
                <p className="text-cyan-400 text-xs font-bold uppercase tracking-[.2em]">
                  Level unlocked
                </p>

                <h2 className="text-2xl font-bold mt-2">
                  Your Badges
                </h2>
              </div>

              <span className="text-xs text-slate-500">
                {badges.length} unlocked
              </span>

            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">

              {badges.map((badge, index) => (

                <div
                  key={badge._id || index}
                  className="group relative rounded-3xl border border-white/10 bg-white/[.035] p-6 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-cyan-400/40 hover:bg-cyan-400/[.04]"
                >

                  <div className="absolute -top-16 -right-16 w-40 h-40 bg-cyan-400/10 rounded-full blur-3xl group-hover:bg-cyan-400/20" />

                  <div className="relative">

                    <div className="w-20 h-20 rounded-full mx-auto bg-gradient-to-br from-yellow-300 to-orange-500 p-[2px] shadow-[0_0_35px_rgba(250,204,21,.18)]">

                      <div className="w-full h-full rounded-full bg-[#0b1020] flex items-center justify-center text-4xl">
                        🏆
                      </div>

                    </div>

                    <div className="text-center mt-5">

                      <span className="text-[10px] text-yellow-400 uppercase tracking-[.2em] font-bold">
                        Achievement
                      </span>

                      <h3 className="font-bold text-lg mt-2">
                        {badge.name}
                      </h3>

                      <p className="text-xs text-slate-500 mt-2">
                        {badge.organization}
                      </p>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </section>
        )}

        {/* ADD CERTIFICATE */}
        <section className="mb-16">

          <div className="rounded-[2rem] border border-white/10 bg-white/[.035] backdrop-blur-xl overflow-hidden">

            <div className="grid lg:grid-cols-[.75fr_1.25fr]">

              {/* INFO */}
              <div className="p-8 lg:p-10 bg-gradient-to-br from-cyan-400/[.08] to-purple-500/[.04] border-b lg:border-b-0 lg:border-r border-white/10">

                <div className="text-4xl mb-6">
                  ✨
                </div>

                <p className="text-cyan-400 text-xs font-bold uppercase tracking-[.2em]">
                  Add new credential
                </p>

                <h2 className="text-3xl font-black mt-3">
                  Expand your
                  <br />
                  <span className="text-cyan-400">
                    achievement vault.
                  </span>
                </h2>

                <p className="text-slate-400 text-sm leading-6 mt-5 max-w-sm">
                  Add certificates from courses, competitions,
                  cloud platforms or professional organizations.
                </p>

                <div className="mt-8 space-y-3">

                  {[
                    'Course certificates',
                    'Industry credentials',
                    'Competition achievements',
                    'Professional certifications',
                  ].map((item) => (

                    <div
                      key={item}
                      className="flex items-center gap-3 text-sm text-slate-300"
                    >
                      <span className="w-6 h-6 rounded-full bg-cyan-400/10 text-cyan-400 flex items-center justify-center text-xs">
                        ✓
                      </span>

                      {item}
                    </div>

                  ))}

                </div>

              </div>

              {/* FORM */}
              <form
                onSubmit={addCertificate}
                className="p-8 lg:p-10"
              >

                <div className="flex justify-between items-center mb-7">

                  <div>
                    <h3 className="text-xl font-bold">
                      Certificate Details
                    </h3>

                    <p className="text-xs text-slate-500 mt-1">
                      Create a new credential
                    </p>
                  </div>

                  <div className="text-2xl">
                    📜
                  </div>

                </div>

                <div className="grid sm:grid-cols-2 gap-5">

                  <div className="sm:col-span-2">

                    <label className="text-xs text-slate-400 uppercase tracking-wider">
                      Certificate name *
                    </label>

                    <input
                      value={form.name}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          name: e.target.value,
                        })
                      }
                      placeholder="AWS Cloud Practitioner"
                      className="mt-2 w-full h-12 rounded-xl border border-white/10 bg-black/20 px-4 text-sm outline-none placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10 transition"
                    />

                  </div>

                  <div>

                    <label className="text-xs text-slate-400 uppercase tracking-wider">
                      Organization *
                    </label>

                    <input
                      value={form.organization}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          organization: e.target.value,
                        })
                      }
                      placeholder="Amazon Web Services"
                      className="mt-2 w-full h-12 rounded-xl border border-white/10 bg-black/20 px-4 text-sm outline-none placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10 transition"
                    />

                  </div>

                  <div>

                    <label className="text-xs text-slate-400 uppercase tracking-wider">
                      Issue date *
                    </label>

                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          date: e.target.value,
                        })
                      }
                      className="mt-2 w-full h-12 rounded-xl border border-white/10 bg-black/20 px-4 text-sm outline-none focus:border-cyan-400/50 transition"
                    />

                  </div>

                  <div className="sm:col-span-2">

                    <label className="text-xs text-slate-400 uppercase tracking-wider">
                      Verification URL
                    </label>

                    <input
                      type="url"
                      value={form.verificationLink}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          verificationLink: e.target.value,
                        })
                      }
                      placeholder="https://..."
                      className="mt-2 w-full h-12 rounded-xl border border-white/10 bg-black/20 px-4 text-sm outline-none placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10 transition"
                    />

                  </div>

                </div>

                <button
                  type="submit"
                  disabled={adding}
                  className="mt-6 w-full h-12 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-[#031018] font-black text-sm hover:shadow-[0_0_35px_rgba(34,211,238,.2)] hover:-translate-y-0.5 transition-all disabled:opacity-50"
                >
                  {adding
                    ? 'ADDING...'
                    : '＋ ADD CERTIFICATE'}
                </button>

              </form>

            </div>

          </div>

        </section>

        {/* CERTIFICATES */}
        <section>

          <div className="flex items-end justify-between mb-7">

            <div>
              <p className="text-purple-400 text-xs uppercase tracking-[.2em] font-bold">
                Credential collection
              </p>

              <h2 className="text-3xl font-black mt-2">
                All Certificates
              </h2>
            </div>

            <span className="text-xs text-slate-500">
              {external.length} total
            </span>

          </div>

          {loading ? (

            <div className="py-20 text-center text-slate-500">
              Loading your credentials...
            </div>

          ) : external.length === 0 ? (

            <div className="rounded-3xl border border-dashed border-white/10 py-20 text-center">

              <div className="text-5xl mb-5">
                📭
              </div>

              <h3 className="font-bold text-lg">
                Your vault is empty
              </h3>

              <p className="text-sm text-slate-500 mt-2">
                Add your first certificate above.
              </p>

            </div>

          ) : (

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

              {external.map((certificate, index) => (

                <article
                  key={certificate._id || index}
                  className="group relative rounded-3xl border border-white/10 bg-white/[.035] p-6 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-purple-400/30 hover:shadow-[0_20px_60px_rgba(139,92,246,.08)]"
                >

                  {/* card glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full" />

                  <div className="relative">

                    <div className="flex justify-between items-start">

                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/10 border border-white/10 flex items-center justify-center text-xl">
                        🎓
                      </div>

                      {certificate.verificationLink && (
                        <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                          Verified
                        </span>
                      )}

                    </div>

                    <h3 className="text-xl font-bold mt-6 group-hover:text-cyan-300 transition">
                      {certificate.name}
                    </h3>

                    <p className="text-sm text-slate-400 mt-2">
                      {certificate.organization}
                    </p>

                    <div className="mt-7 pt-5 border-t border-white/10 flex items-center justify-between">

                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-600">
                          Issued
                        </p>

                        <p className="text-sm text-slate-300 mt-1">
                          {certificate.date}
                        </p>
                      </div>

                      {certificate.verificationLink ? (

                        <a
                          href={certificate.verificationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-lg bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 text-xs font-bold hover:bg-cyan-400/20 transition"
                        >
                          VERIFY ↗
                        </a>

                      ) : (

                        <span className="text-xs text-slate-600">
                          No link
                        </span>

                      )}

                    </div>

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>

        {/* FOOTER */}
        <footer className="mt-20 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-3 text-xs text-slate-600">
          <span>SKILLFORGE © 2026</span>
          <span>VERIFIED • SECURE • PROFESSIONAL</span>
        </footer>

      </div>

    </main>
  );
}