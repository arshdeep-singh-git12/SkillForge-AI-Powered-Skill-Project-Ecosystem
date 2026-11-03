'use client';
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';

export default function VertexLandingPage() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  
  // Tech/coding themed images for SkillForge
  const SHOTS = [
    { url: '/images/code_editor.jpg', v: 'code', t: 'CODE ASSESSMENT' },
    { url: '/images/tech_dashboard.jpg', v: 'dashboard' },
    { url: '/images/ai_network.jpg', v: 'ai' },
    { url: '/images/team_collab.jpg', v: 'workspace' },
    { url: '/images/certificate_badge.jpg', v: 'cert' },
    { url: '/images/code_editor.jpg', v: 'plain', t: 'PYTHON · 60+' },
    { url: '/images/ai_network.jpg', v: 'ai' },
    { url: '/images/tech_dashboard.jpg', v: 'plain', t: 'TRACK SKILLS' },
    { url: '/images/team_collab.jpg', v: 'plain', t: 'DEV SETUP' },
    { url: '/images/certificate_badge.jpg', v: 'plain', t: 'GET CERTIFIED' },
  ];

  // Card creative generator
  const creative = (d: any) => {
    let html = '';
    const im = `<img alt="" src="${d.url}" onerror="this.parentElement.parentElement.classList.add('broken')">`;
    switch (d.v) {
      case 'code':
        html = `
          <div class="fill" style="background:#0d1117"></div>
          <div class="ph phf">${im}</div>
          <div class="fill" style="background:linear-gradient(180deg,rgba(2,2,4,0) 30%,rgba(2,2,4,.85) 68%)"></div>
          <div class="cv" style="top:12px;text-align:right;font-size:3.4px;letter-spacing:.15em;color:rgba(0,220,255,.7)">LIVE ASSESSMENT</div>
          <div class="cv t-big" style="top:130px;font-size:13px;color:#fff">Code</div>
          <div class="cv t-big" style="top:144px;font-size:13px;color:#3fe3ff">Challenge</div>
          <div class="cv" style="top:170px;font-size:5.2px;font-weight:700;color:rgba(255,255,255,.85);line-height:1.7">
            <div><b class="dot" style="background:#3fe3ff"></b>60+ LANGUAGES</div>
            <div style="margin-top:8px"><b class="dot sq" style="background:#3fe3ff"></b>AI GRADED<br><span style="margin-left:11px">INSTANTLY</span></div>
          </div>
        `;
        break;
      case 'dashboard':
        html = `
          <div class="fill" style="background:linear-gradient(180deg,#0a1628,#0d2040 50%,#061020)"></div>
          <div class="ph" style="top:0;bottom:0">${im}</div>
          <div class="fill" style="background:linear-gradient(180deg,rgba(10,22,40,.95),rgba(10,22,40,0) 30%)"></div>
          <div class="cv" style="top:12px;font-size:4.2px;line-height:1.7;color:rgba(63,227,255,.9);font-weight:600">SKILL ANALYTICS</div>
          <div class="cv t-big" style="top:24px;font-size:11px;color:#fff">Your</div>
          <div class="cv t-big" style="top:36px;font-size:11px;color:#3fe3ff">Progress</div>
          <div class="cv" style="top:60px;font-size:5.5px;color:rgba(255,255,255,.8)">
            <div>RADAR CHART: <b>ADVANCED</b></div>
            <div style="margin-top:4px">PROFILE COMPLETION: <b>85%</b></div>
          </div>
        `;
        break;
      case 'ai':
        html = `
          <div class="fill" style="background:linear-gradient(180deg,#0b0d1e,#101633 60%,#080a14)"></div>
          <div class="ph" style="top:0;bottom:0">${im}</div>
          <div class="fill" style="background:linear-gradient(180deg,rgba(11,13,30,0) 35%,rgba(11,13,30,.9) 70%)"></div>
          <div class="cv" style="top:14px;font-size:4.2px;letter-spacing:.12em;color:rgba(142,244,255,.8);font-weight:600">AI MATCHING</div>
          <div class="cv t-serif" style="top:140px;font-size:18px;color:#fff">Smart</div>
          <div class="cv t-big" style="top:160px;font-size:11px;color:#8ef4ff">Team Engine</div>
          <div class="cv" style="top:185px;font-size:5.2px;color:rgba(255,255,255,.75)">Complementary skills paired algorithmically</div>
        `;
        break;
      case 'workspace':
        html = `
          <div class="fill" style="background:linear-gradient(180deg,#120e24,#201438 55%,#0d081a)"></div>
          <div class="ph" style="top:0;bottom:0">${im}</div>
          <div class="fill" style="background:linear-gradient(180deg,rgba(18,14,36,0) 30%,rgba(18,14,36,.88) 65%)"></div>
          <div class="cv" style="top:12px;font-size:4.2px;color:rgba(255,255,255,.7)">COLLABORATIVE</div>
          <div class="cv t-big" style="top:132px;font-size:12px;color:#fff">Project</div>
          <div class="cv t-big" style="top:145px;font-size:12px;color:#d8b4fe">Ecosystem</div>
          <div class="cv" style="top:172px;font-size:5.2px;color:rgba(255,255,255,.75)">Real-time contract teams & live repositories</div>
        `;
        break;
      case 'cert':
        html = `
          <div class="fill" style="background:linear-gradient(180deg,#081c1c,#0a2e2a 55%,#041212)"></div>
          <div class="ph" style="top:0;bottom:0">${im}</div>
          <div class="fill" style="background:linear-gradient(180deg,rgba(8,28,28,0) 30%,rgba(8,28,28,.9) 68%)"></div>
          <div class="cv" style="top:12px;text-align:right;font-size:4px;color:rgba(46,200,102,.9);font-weight:600">VERIFIABLE</div>
          <div class="cv t-big" style="top:130px;font-size:12px;color:#fff">Proof of</div>
          <div class="cv t-big" style="top:143px;font-size:12px;color:#2ec866">Skill</div>
          <div class="cv" style="top:170px;font-size:5.2px;color:rgba(255,255,255,.75)">Cryptographic skill badges & certifications</div>
        `;
        break;
      default:
        html = `
          <div class="fill" style="background:#080b10">${im}</div>
          <div class="fill" style="background:linear-gradient(180deg,rgba(8,11,16,0) 40%,rgba(8,11,16,.85) 75%)"></div>
          <div class="cv t-big" style="bottom:16px;font-size:9.5px;color:rgba(255,255,255,.9);letter-spacing:.06em">${d.t || ''}</div>
        `;
    }
    return html + '<div class="edge"></div>';
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ring = ringRef.current;
    if (!canvas || !ring) return;

    // Starfield generator
    const starConfigs = [
      { id: 'stA', n: 160, size: 1, alpha: [0.2, 0.9], blur: 0 },
      { id: 'stB', n: 55, size: 2, alpha: [0.4, 1], blur: 1 }
    ];
    starConfigs.forEach(sf => {
      const el = document.getElementById(sf.id);
      if (el) {
        const shadows: string[] = [];
        for (let i = 0; i < sf.n; i++) {
          const x = Math.floor(Math.random() * 100);
          const y = Math.floor(Math.random() * 100);
          const a = sf.alpha[0] + Math.random() * (sf.alpha[1] - sf.alpha[0]);
          shadows.push(x + 'vw ' + y + 'vh ' + sf.blur + 'px 0 rgba(255,255,255,' + a.toFixed(3) + ')');
        }
        el.style.boxShadow = shadows.join(',');
      }
    });

    // Carousel setup
    const n = 37;
    const step = 360 / n;
    
    ring.innerHTML = '';
    const cards: HTMLElement[] = [];
    for (let i = 0; i < n; i++) {
      const c = document.createElement('div');
      c.className = 'card';
      c.innerHTML = creative(SHOTS[i % SHOTS.length]);
      ring.appendChild(c);
      cards.push(c);
    }

    let phase = -2;
    let last = performance.now();
    let rAF: number;
    const playing = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const tick = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.1);
      last = t;
      if (playing) phase -= 1.9 * dt;
      
      const isMobile = window.innerWidth <= 700;
      const R = isMobile ? 155 : 891;
      const maxAngle = isMobile ? 36 : 42;
      
      for (let i = 0; i < n; i++) {
        const a = ((i * step + phase) % 360 + 540) % 360 - 180;
        if (Math.abs(a) > maxAngle) {
          cards[i].style.visibility = 'hidden';
          continue;
        }
        cards[i].style.visibility = 'visible';
        const r = a * Math.PI / 180;
        const cos = Math.cos(r);
        cards[i].style.transform = 'translate3d(' + (R * Math.sin(r)) + 'px, 0, ' + (R * (1 - cos)) + 'px) rotateY(' + (-a) + 'deg)';
        cards[i].style.filter = 'brightness(' + (0.84 + 0.5 * (1 / cos - 1)) + ')';
      }
      rAF = requestAnimationFrame(tick);
    };
    
    rAF = requestAnimationFrame(tick);

    const handleVis = () => { if (!document.hidden) last = performance.now(); };
    document.addEventListener('visibilitychange', handleVis);

    // Responsive scaling resize
    const resize = () => {
      if (!canvas) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      
      if (vw <= 700) {
        canvas.style.transform = 'none';
        canvas.style.removeProperty('--k');
        canvas.style.removeProperty('--fill');
      } else if (vw <= 1080) {
        const W = 920 + (vw - 701) * (1172 - 920) / (1080 - 701);
        const k = Math.min(vw / W, vh / 560);
        const ramp = Math.min(1, (1080 - vw) / 120);
        let fill = Math.max(0, vh / k - 657);
        if (fill > 0) {
          const ss = Math.min(fill * 0.55, 420) * ramp;
          const rs = 1 + Math.min(fill / 1100, 0.75) * ramp;
          const slack = 219.5 - 125 * rs + ss;
          const st = Math.max(0, slack / 2 - 28) * ramp;
          fill -= ss;
          canvas.style.setProperty('--stshift', st + 'px');
          canvas.style.setProperty('--sshift', ss + 'px');
          canvas.style.setProperty('--rs', '' + rs);
        } else {
          canvas.style.setProperty('--stshift', '0px');
          canvas.style.setProperty('--sshift', '0px');
          canvas.style.setProperty('--rs', '1');
        }
        canvas.style.setProperty('--k', '' + k);
        canvas.style.setProperty('--fill', fill + 'px');
      } else {
        const k = Math.min(vw / 1172, vh / 560);
        canvas.style.setProperty('--stshift', '0px');
        canvas.style.setProperty('--sshift', '0px');
        canvas.style.setProperty('--rs', '1');
        canvas.style.setProperty('--k', '' + k);
        canvas.style.setProperty('--fill', '0px');
      }
    };
    
    window.addEventListener('resize', resize);
    resize();

    // Mobile Hamburger Menu logic
    const nav = document.querySelector('.nav');
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelectorAll('.navmenu a');
    
    const handleBurgerClick = (e: Event) => {
      e.stopPropagation();
      if (nav && burger) {
        nav.classList.toggle('open');
        burger.setAttribute('aria-expanded', nav.classList.contains('open') ? 'true' : 'false');
      }
    };

    const handleLinkClick = () => {
      if (nav && burger) {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    };

    const handleDocClick = (e: MouseEvent) => {
      if (nav && !nav.contains(e.target as Node)) {
        nav.classList.remove('open');
        if (burger) burger.setAttribute('aria-expanded', 'false');
      }
    };

    if (burger) burger.addEventListener('click', handleBurgerClick);
    navLinks.forEach(link => link.addEventListener('click', handleLinkClick));
    document.addEventListener('click', handleDocClick);

    return () => {
      cancelAnimationFrame(rAF);
      document.removeEventListener('visibilitychange', handleVis);
      window.removeEventListener('resize', resize);
      if (burger) burger.removeEventListener('click', handleBurgerClick);
      navLinks.forEach(link => link.removeEventListener('click', handleLinkClick));
      document.removeEventListener('click', handleDocClick);
    };
  }, []);

  return (
    <div className="stage bg-[#020204] text-white font-sans text-left">
      <style dangerouslySetInnerHTML={{__html: `
        /* Desktop base rules */
        @media (min-width: 701px) {
          html, body { overflow: hidden !important; height: 100vh !important; width: 100% !important; margin: 0; padding: 0; }
          .stage { position: fixed; inset: 0; overflow: hidden; }
          .canvas { position: absolute; left: 50%; top: 0; width: 1172px; height: 657px; transform: translateX(-50%) scale(var(--k, 1)); transform-origin: 50% 0; }
          .canvas > * { position: absolute; }
          .stack { position: absolute; inset: 0; z-index: 300; }
          .stack > * { position: absolute; }
          .nav { left: 136px; top: 3px; width: 900px; height: 64px; z-index: 400; }
          .badge { left: 440px; top: 95px; width: 292px; height: 39px; z-index: 300; }
          .h1 { font-family: "Playfair Display", serif; left: 586px; transform: translateX(-50%); white-space: nowrap; line-height: 1; font-weight: 900; font-size: 54px; letter-spacing: 0; color: #fff; text-shadow: 0 0 34px rgba(130,180,255,.22); z-index: 300; }
          #h1a { top: 178px; }
          #h1b { top: 230px; color: #3fe3ff; text-shadow: 0 0 40px rgba(63,227,255,.35); }
          .sub { left: 586px; transform: translateX(-50%); white-space: nowrap; line-height: 1; font-size: 13.2px; color: #a9aeb5; z-index: 300; }
          #sub1 { top: 290px; }
          #sub2 { top: 308px; }
          .hero-cta { position: absolute; left: 586px; transform: translateX(-50%); top: 340px; width: max-content; min-width: 240px; padding: 0 36px; height: 54.5px; border-radius: 14px; font-size: 17px; font-weight: 500; letter-spacing: -0.01em; z-index: 300; }
          .hero-cta:hover { transform: translateX(-50%) translateY(-1px); }
          .showcase { position: absolute; left: 0; top: 0; width: 1172px; height: 0; }
          .ring { position: absolute; left: 0; top: 0; width: 1172px; height: 657px; z-index: 5; perspective: 891px; perspective-origin: 586px 918px; transform-style: preserve-3d; pointer-events: none; }
          .card { position: absolute; left: 586px; top: 616px; width: 130px; height: 300px; margin: -150px 0 0 -65px; border-radius: 12px; overflow: hidden; background: #0d1117; box-shadow: 0 24px 46px rgba(0,0,0,.6), 0 3px 8px rgba(0,0,0,.5); backface-visibility: hidden; will-change: transform; }
          .navmenu { display: contents; }
          .burger { display: none; }
        }

        .stage * { box-sizing: border-box; }
        .bg { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(25,127,255,0) 38%, rgba(25,127,255,.042) 54%, rgba(25,127,255,.052) 68%, rgba(25,127,255,.030) 100%), #020204; }
        .stars { position: absolute; left: 0; top: 0; width: 1px; height: 1px; border-radius: 50%; background: #fff; }
        .card img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .card .edge { position: absolute; inset: 0; border-radius: inherit; box-shadow: inset 0 0 0 1px rgba(255,255,255,.15), inset 0 16px 30px rgba(255,255,255,.05); }
        .card.broken img { display: none; }
        
        .nav .mark { left: 21px; top: 19px; width: 24px; height: 24px; }
        .wm { position: absolute; left: 50px; top: 0; white-space: nowrap; }
        .wm .kick { position: absolute; left: 3px; top: 14px; font-size: 5.5px; font-weight: 600; letter-spacing: .14em; color: rgba(63,227,255,.9); line-height: 1; }
        .wm .name { position: absolute; left: 0; top: 22px; transform-origin: 0 50%; font-weight: 900; font-size: 20px; line-height: 1; letter-spacing: -.01em; color: #fff; }
        
        .links { position: absolute; left: 260px; top: 0; height: 62px; transform-origin: 0 50%; display: flex; align-items: center; gap: 24px; }
        .links a { font-size: 12.5px; font-weight: 400; color: rgba(255,255,255,.92); white-space: nowrap; transition: opacity .25s; text-decoration: none; }
        .links a:hover { opacity: .65; }
        .nav-actions { position: absolute; right: 14px; top: 10.5px; display: flex; gap: 12px; align-items: center; }
        .nav .v-btn { position: relative; width: max-content; padding: 0 24px; height: 39.5px; border-radius: 14px; font-size: 14px; font-weight: 500; letter-spacing: -.005em; }
        .nav .nav-btn-ghost { background: rgba(255,255,255,0.03); border-color: transparent; box-shadow: none; }
        .nav .nav-btn-ghost:hover { background: rgba(255,255,255,0.08); border-color: transparent; box-shadow: none; }

        .sub b { font-weight: 600; color: #fff; }
        .cv { position: absolute; left: 0; right: 0; padding: 0 10px; }
        .fill { position: absolute; inset: 0; }
        .ph { position: absolute; left: 0; right: 0; overflow: hidden; background: linear-gradient(155deg,#0d1926,#0a1220 60%,#141025); }
        .phf { top: 0; bottom: 0; }
        .ph img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .dot { display: inline-block; width: 4.5px; height: 4.5px; background: #3fe3ff; margin-right: 4px; transform: rotate(45deg) translateY(-1px); }
        .dot.sq { transform: none; width: 6.5px; height: 4.5px; border-radius: 1px; }
        .t-big { font-weight: 900; text-transform: uppercase; line-height: .96; letter-spacing: -.015em; white-space: nowrap; transform: scaleX(.875); transform-origin: left center; }
        .t-serif { font-family: "Playfair Display", serif; line-height: 1.02; letter-spacing: .01em; white-space: nowrap; }

        .wa { position: fixed; right: 16px; bottom: 24px; width: 56px; height: 56px; border-radius: 50%; background: #25d366; display: grid; place-items: center; z-index: 400; box-shadow: 0 8px 20px rgba(0,0,0,.5); }
        .wa svg { width: 31px; height: 31px; }
        .wa::after { content: ""; position: absolute; inset: 0; border-radius: 50%; border: 2px solid rgba(37,211,102,.5); animation: pulse 2.8s ease-out infinite; }
        @keyframes pulse { 0% { transform: scale(1); opacity: .75; } 70% { transform: scale(1.4); opacity: 0; } 100% { opacity: 0; } }

        @media (max-width: 1080px) and (min-width: 701px) {
          .nav { left: 286px; width: 620px; }
          .badge { left: 420px; width: 330px; }
          .stack { transform: translateY(var(--stshift, 0px)); }
          .showcase { transform: translateY(var(--sshift, 0px)); }
          .ring { transform: scale(var(--rs, 1)); transform-origin: 586px 595px; }
        }

        /* ─── FULL MOBILE OPTIMIZATION (<= 700px) ─── */
        @media (max-width: 700px) {
          html, body {
            overflow-y: auto !important;
            overflow-x: hidden !important;
            height: auto !important;
            min-height: 100% !important;
            width: 100% !important;
          }
          .stage {
            position: relative !important;
            height: auto !important;
            min-height: 100vh !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
            width: 100% !important;
          }
          .canvas {
            position: relative !important;
            left: auto !important;
            top: auto !important;
            width: 100% !important;
            max-width: 100vw !important;
            height: auto !important;
            min-height: 100vh !important;
            transform: none !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            padding: 12px 16px 40px !important;
          }
          .stack {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            position: static !important;
            width: 100% !important;
            max-width: 500px !important;
          }
          
          /* Nav bar */
          .nav {
            position: relative !important;
            left: auto !important;
            top: auto !important;
            width: 100% !important;
            max-width: 100% !important;
            height: 56px !important;
            margin-top: 4px !important;
            flex: 0 0 auto !important;
          }
          .nav .mark { left: 14px !important; top: 16px !important; width: 24px !important; height: 24px !important; }
          .wm { left: 45px !important; top: 0 !important; height: 100% !important; }
          .wm .kick { top: 15px !important; font-size: 5px !important; letter-spacing: .16em !important; }
          .wm .name { top: 23px !important; font-size: 16px !important; }
          
          /* Hamburger Menu */
          .burger {
            display: grid !important;
            place-content: center !important;
            gap: 4px !important;
            position: absolute !important;
            right: 8px !important;
            top: 7px !important;
            width: 42px !important;
            height: 42px !important;
            padding: 0 !important;
            border: 0 !important;
            border-radius: 12px !important;
            background: transparent !important;
            cursor: pointer !important;
            -webkit-tap-highlight-color: transparent !important;
          }
          .burger span {
            display: block !important;
            width: 18px !important;
            height: 1.6px !important;
            border-radius: 2px !important;
            background: rgba(255,255,255,.92) !important;
            transition: transform .28s cubic-bezier(.4,0,.2,1), opacity .18s !important;
          }
          .nav.open .burger span:nth-child(1) { transform: translateY(5.6px) rotate(45deg); }
          .nav.open .burger span:nth-child(2) { opacity: 0; }
          .nav.open .burger span:nth-child(3) { transform: translateY(-5.6px) rotate(-45deg); }
          
          .navmenu {
            display: block !important;
            position: absolute !important;
            left: 0 !important;
            right: 0 !important;
            top: 64px !important;
            padding: 14px !important;
            border-radius: 20px !important;
            border: 1px solid rgba(255,255,255,.12) !important;
            background: linear-gradient(180deg, rgba(11,15,22,.99), rgba(7,10,16,.99)) !important;
            -webkit-backdrop-filter: blur(20px) saturate(140%) !important;
            backdrop-filter: blur(20px) saturate(140%) !important;
            box-shadow: 0 24px 60px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.08) !important;
            opacity: 0 !important;
            visibility: hidden !important;
            transform: translateY(-8px) !important;
            transition: opacity .24s ease, transform .28s cubic-bezier(.4,0,.2,1), visibility .28s !important;
            z-index: 500 !important;
          }
          .nav.open .navmenu {
            opacity: 1 !important;
            visibility: visible !important;
            transform: none !important;
          }
          .links {
            position: static !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: stretch !important;
            height: auto !important;
            gap: 2px !important;
            transform: none !important;
          }
          .links a {
            font-size: 15px !important;
            padding: 10px 14px !important;
            border-radius: 10px !important;
            color: rgba(255,255,255,.9) !important;
          }
          .links a:hover { background: rgba(255,255,255,0.06); }
          .nav-actions {
            position: static !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 8px !important;
            margin-top: 10px !important;
            padding-top: 10px !important;
            border-top: 1px solid rgba(255,255,255,0.08) !important;
          }
          .nav .v-btn {
            position: static !important;
            width: 100% !important;
            height: 44px !important;
            font-size: 14px !important;
          }
          
          /* Hero Badge */
          .badge {
            position: relative !important;
            left: auto !important;
            top: auto !important;
            margin: 18px auto 0 !important;
            width: auto !important;
            max-width: 95% !important;
            height: 34px !important;
            flex: 0 0 auto !important;
            border-radius: 17px !important;
          }
          .badge b {
            position: relative !important;
            left: auto !important;
            top: auto !important;
            height: 34px !important;
            padding: 0 12px 0 38px !important;
            font-size: 11.5px !important;
            display: flex !important;
            align-items: center !important;
          }
          .badge i { top: 3px !important; left: 3px !important; width: 28px !important; height: 28px !important; }
          .badge i svg { width: 13px !important; height: 18px !important; }
          
          /* Typography */
          .h1 {
            position: relative !important;
            left: auto !important;
            top: auto !important;
            transform: none !important;
            white-space: normal !important;
            text-align: center !important;
            font-size: clamp(28px, 7.6vw, 36px) !important;
            line-height: 1.1 !important;
            letter-spacing: -0.01em !important;
            max-width: 100% !important;
            font-family: "Playfair Display", serif !important;
            font-weight: 900 !important;
          }
          #h1a { margin-top: 14px !important; }
          #h1b { margin-top: 4px !important; color: #3fe3ff !important; text-shadow: 0 0 30px rgba(63,227,255,0.35) !important; }
          
          .sub {
            position: relative !important;
            left: auto !important;
            top: auto !important;
            transform: none !important;
            white-space: normal !important;
            text-align: center !important;
            font-size: 13.5px !important;
            line-height: 1.5 !important;
            max-width: 320px !important;
            color: #a9aeb5 !important;
          }
          #sub1 { margin-top: 12px !important; }
          #sub2 { margin-top: 2px !important; }
          
          /* Hero CTA */
          .hero-cta {
            position: relative !important;
            left: auto !important;
            top: auto !important;
            transform: none !important;
            margin: 18px auto 0 !important;
            flex: 0 0 auto !important;
            width: 100% !important;
            max-width: 260px !important;
            height: 48px !important;
            padding: 0 24px !important;
            font-size: 15px !important;
          }
          
          /* 3D Showcase Carousel Mobile Fit */
          .showcase {
            position: relative !important;
            left: auto !important;
            top: auto !important;
            flex: 0 0 auto !important;
            width: 100% !important;
            max-width: 100vw !important;
            height: 250px !important;
            margin-top: 24px !important;
            overflow: hidden !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
          }
          .ring {
            position: absolute !important;
            left: 50% !important;
            top: 50% !important;
            margin: 0 !important;
            width: 340px !important;
            height: 230px !important;
            transform: translate(-50%, -50%) !important;
            perspective: 460px !important;
            perspective-origin: 50% 50% !important;
            pointer-events: none !important;
          }
          .card {
            position: absolute !important;
            left: 50% !important;
            top: 50% !important;
            width: 90px !important;
            height: 170px !important;
            margin: -85px 0 0 -45px !important;
            border-radius: 10px !important;
            overflow: hidden !important;
            background: #0d1117 !important;
            box-shadow: 0 12px 28px rgba(0,0,0,0.65) !important;
            backface-visibility: hidden !important;
            will-change: transform !important;
          }
          
          .wa {
            width: 48px !important;
            height: 48px !important;
            right: 14px !important;
            bottom: 18px !important;
          }
          .wa svg { width: 26px !important; height: 26px !important; }
        }
      `}} />
      
      <div className="bg"></div>
      <div id="stA" className="stars"></div>
      <div id="stB" className="stars"></div>
      
      <div ref={canvasRef} className="canvas">
        <div className="stack">
          {/* NAV PILL */}
          <div className="nav v-nav-pill">
            <svg className="mark absolute" viewBox="0 0 48 48" style={{ filter: 'drop-shadow(0 0 6px rgba(60,224,255,.75))' }}>
              <defs>
                <linearGradient id="sw" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#8ef4ff" />
                  <stop offset="0.5" stopColor="#35d8ff" />
                  <stop offset="1" stopColor="#0a86d8" />
                </linearGradient>
                <linearGradient id="sw2" x1="40" y1="10" x2="10" y2="40">
                  <stop offset="0" stopColor="#a6f7ff" stopOpacity="0.25" />
                  <stop offset="1" stopColor="#0f9ae0" stopOpacity="0.25" />
                </linearGradient>
              </defs>
              <g transform="rotate(-32 24 24)">
                <ellipse cx="24" cy="24" rx="18.5" ry="9.6" stroke="url(#sw2)" strokeWidth="3.1" strokeLinecap="round" strokeDasharray="58 30" strokeDashoffset="14" fill="none" />
                <circle cx="41.4" cy="20.6" r="3.1" fill="#bff6ff" />
              </g>
              <circle cx="24" cy="24" r="6.6" fill="url(#sw)" />
              <circle cx="24" cy="24" r="2.6" fill="#fff" />
            </svg>
            <div className="wm">
              <span className="kick">AI-POWERED ECOSYSTEM</span>
              <span className="name">SKILLFORGE</span>
            </div>
            <button type="button" className="burger" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="navmenu">
              <span></span><span></span><span></span>
            </button>
            <div className="navmenu" id="navmenu">
              <div className="links" id="links">
                <Link href="/">Home</Link>
                <Link href="/dashboard">Dashboard</Link>
                <Link href="/assessments">Assessments</Link>
                <Link href="/projects">Projects</Link>
                <Link href="/teams">Teams</Link>
              </div>
              <div className="nav-actions">
                <Link href="/login" className="v-btn nav-btn-ghost"><span>Login</span></Link>
                <Link href="/signup" className="v-btn"><span>Sign Up</span></Link>
              </div>
            </div>
          </div>

          {/* BADGE */}
          <div className="badge v-badge">
            <i className="v-badge-icon" style={{position:'absolute',left:'4px',top:'4px',width:'29px',height:'29px'}}>
              <svg viewBox="5 1 14 22" preserveAspectRatio="none" fill="rgba(16,112,152,.72)" stroke="rgba(190,236,255,.6)" strokeWidth="1.6" strokeLinejoin="round" style={{width:'14px',height:'16px',position:'relative',top:'-1px'}}>
                <path d="M13.9 1.6 5.5 13.6a.7.7 0 0 0 .6 1.1h4.2l-1 7.7a.7.7 0 0 0 1.25.55l8.3-12.1a.7.7 0 0 0-.6-1.1h-4.2l1-7.7a.7.7 0 0 0-1.25-.55Z" />
              </svg>
            </i>
            <b className="v-badge-text" style={{transformOrigin:'0 50%'}}>
              AI-Powered Skill & Project Ecosystem
            </b>
          </div>
          
          {/* HERO TEXT */}
          <div id="h1a" className="h1 l1">Forge Your Skills</div>
          <div id="h1b" className="h1">Build Projects</div>
          
          <div id="sub1" className="sub s1"><b>Rigorous coding assessments</b> with AI-powered evaluation across</div>
          <div id="sub2" className="sub">60+ languages, verifiable portfolios, and smart team matching.</div>
          
          {/* HERO CTA */}
          <Link href="/signup" className="v-btn hero-cta"><span style={{position:'relative',zIndex:2,display:'block',lineHeight:1}}>Forge Your Legacy →</span></Link>
        </div>
        
        <div className="showcase">
          <div ref={ringRef} className="ring"></div>
        </div>
      </div>
    </div>
  );
}
