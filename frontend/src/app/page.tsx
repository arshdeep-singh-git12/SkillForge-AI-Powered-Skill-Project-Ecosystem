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
        `;
        break;
      case 'ai':
        html = `
          <div class="ph phf">${im}</div>
          <div class="fill" style="background:linear-gradient(180deg,rgba(2,2,4,0) 34%,rgba(2,2,4,.7) 52%,rgba(2,2,4,.95) 72%)"></div>
          <div class="cv t-big" style="top:126px;font-size:12px;color:#fff">AI-Powered</div>
          <div class="cv t-big" style="top:140px;font-size:12px;color:#3fe3ff">Matching</div>
          <div class="cv" style="top:165px;font-size:4.4px;letter-spacing:.07em;color:rgba(255,255,255,.85)">smart team formation</div>
        `;
        break;
      case 'workspace':
        html = `
          <div class="ph phf">${im}</div>
          <div class="fill" style="background:linear-gradient(180deg,rgba(3,9,20,0) 30%,rgba(3,9,20,.75) 55%,rgba(3,9,20,.97) 75%)"></div>
          <div class="cv t-big" style="top:126px;font-size:10px;color:#fff;opacity:.9">Build · Ship</div>
          <div class="cv t-big" style="top:140px;font-size:20px;color:#3fe3ff;text-shadow:0 0 16px rgba(63,227,255,.5)">Portfolio</div>
        `;
        break;
      case 'cert':
        html = `
          <div class="fill" style="background:linear-gradient(158deg,#0a1e3d 0%,#0d2850 40%,#143a6b 66%,#0a1e3d 100%)"></div>
          <div class="ph" style="top:0;bottom:0;opacity:.85">${im}</div>
          <div class="fill" style="background:linear-gradient(180deg,rgba(10,30,61,.9),rgba(10,30,61,0) 40%)"></div>
          <div class="cv" style="top:12px;font-size:4px;letter-spacing:.15em;color:rgba(63,227,255,.8);font-weight:600">VERIFIED CREDENTIAL</div>
          <div class="cv t-big" style="top:130px;font-size:18px;color:#fff;text-shadow:0 2px 0 rgba(10,30,61,.8)">Certified</div>
          <div class="cv t-big" style="top:152px;font-size:14px;color:#3fe3ff">Developer</div>
        `;
        break;
      case 'plain':
      default:
        html = `
          <div class="ph phf">${im}</div>
          <div class="fill" style="background:linear-gradient(180deg,rgba(2,2,4,0) 38%,rgba(2,2,4,.88) 68%)"></div>
          <div class="cv" style="top:150px;font-size:5.4px;font-weight:600;letter-spacing:.2em;color:#fff">${d.t || ''}</div>
        `;
        break;
    }
    return html + '<div class="edge"></div>';
  };

  useEffect(() => {
    document.body.classList.add('no-scroll');
    
    const canvas = canvasRef.current;
    const ring = ringRef.current;
    if (!canvas || !ring) return;

    // Generate Stars
    [
      { id: 'stA', count: 150, blur: 0, alpha: [0.05, 0.30] },
      { id: 'stB', count: 18, blur: 1.2, alpha: [0.35, 0.70] },
    ].forEach(sf => {
      const el = document.getElementById(sf.id);
      if (el) {
        const shadows: string[] = [];
        for (let i = 0; i < sf.count; i++) {
          const x = Math.random() * 100;
          const y = Math.random() * 100;
          const a = sf.alpha[0] + Math.random() * (sf.alpha[1] - sf.alpha[0]);
          shadows.push(x + 'vw ' + y + 'vh ' + sf.blur + 'px 0 rgba(255,255,255,' + a.toFixed(3) + ')');
        }
        el.style.boxShadow = shadows.join(',');
      }
    });

    // Carousel
    const n = 37;
    const R = 891;
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
      
      for (let i = 0; i < n; i++) {
        const a = ((i * step + phase) % 360 + 540) % 360 - 180;
        if (Math.abs(a) > 42) {
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

    // Resize
    const resize = () => {
      if (!canvas) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let k = Math.min(vw / 1172, vh / 560);
      let fill = 0;
      let _tboost = 1;
      
      if (vw <= 700) {
        k = 1;
        canvas.style.transform = 'none';
        canvas.style.removeProperty('--k');
        canvas.style.removeProperty('--fill');
      } else if (vw <= 1080) {
        const W = 920 + (vw - 701) * (1172 - 920) / (1080 - 701);
        k = Math.min(vw / W, vh / 560);
        const ramp = Math.min(1, (1080 - vw) / 120);
        _tboost = 1 + 0.14 * ramp;
        fill = Math.max(0, vh / k - 657);
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
      } else {
        canvas.style.setProperty('--stshift', '0px');
        canvas.style.setProperty('--sshift', '0px');
        canvas.style.setProperty('--rs', '1');
      }

      if (vw > 700) {
        canvas.style.setProperty('--k', '' + k);
        canvas.style.setProperty('--fill', fill + 'px');
      }
    };
    
    window.addEventListener('resize', resize);
    resize();

    // Menu logic
    const nav = document.querySelector('.nav');
    const burger = document.querySelector('.burger');
    if (burger && nav) {
      burger.addEventListener('click', () => {
        nav.classList.toggle('open');
        burger.setAttribute('aria-expanded', nav.classList.contains('open') ? 'true' : 'false');
      });
    }

    return () => {
      document.body.classList.remove('no-scroll');
      cancelAnimationFrame(rAF);
      document.removeEventListener('visibilitychange', handleVis);
      window.removeEventListener('resize', resize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="stage fixed inset-0 overflow-hidden bg-[#020204] z-50 text-white font-sans text-left">
      <style dangerouslySetInnerHTML={{__html: `
        html, body { overflow: hidden !important; height: 100vh !important; width: 100% !important; margin: 0; padding: 0; }
        .stage *{box-sizing:border-box}
        .canvas{position:absolute;left:50%;top:0;width:1172px;height:657px;transform:translateX(-50%) scale(var(--k,1));transform-origin:50% 0}
        .canvas>*{position:absolute}
        .stack{position:absolute;inset:0;z-index:300}
        .stack>*{position:absolute}
        .navmenu{display:contents}
        .burger{display:none}
        .bg{position:absolute;inset:0;background:linear-gradient(180deg, rgba(25,127,255,0) 38%, rgba(25,127,255,.042) 54%,rgba(25,127,255,.052) 68%, rgba(25,127,255,.030) 100%),#020204}
        .stars{position:absolute;left:0;top:0;width:1px;height:1px;border-radius:50%;background:#fff}
        
        .nav{left:136px;top:3px;width:900px;height:64px;z-index:400}
        .nav .mark{left:21px;top:19px;width:24px;height:24px}
        .wm{position:absolute;left:50px;top:0;white-space:nowrap}
        .wm .kick{position:absolute;left:3px;top:14px;font-size:5.5px;font-weight:600;letter-spacing:.14em;color:rgba(63,227,255,.9);line-height:1}
        .wm .name{position:absolute;left:0;top:22px;transform-origin:0 50%;font-weight:900;font-size:20px;line-height:1;letter-spacing:-.01em;color:#fff}
        .links{position:absolute;left:260px;top:0;height:62px;transform-origin:0 50%;display:flex;align-items:center;gap:24px}
        .links a{font-size:12.5px;font-weight:400;color:rgba(255,255,255,.92);white-space:nowrap;transition:opacity .25s;text-decoration:none}
        .links a:hover{opacity:.65}
        .nav-actions{position:absolute;right:14px;top:10.5px;display:flex;gap:12px;align-items:center}
        .nav .v-btn{position:relative;width:max-content;padding:0 24px;height:39.5px;border-radius:14px;font-size:14px;font-weight:500;letter-spacing:-.005em}
        .nav .nav-btn-ghost{background:rgba(255,255,255,0.03);border-color:transparent;box-shadow:none}
        .nav .nav-btn-ghost:hover{background:rgba(255,255,255,0.08);border-color:transparent;box-shadow:none}
        
        .badge{left:440px;top:95px;width:292px;height:39px;z-index:300}
        
        .h1{font-family:"Playfair Display",serif;left:586px;transform:translateX(-50%);white-space:nowrap;line-height:1;font-weight:900;font-size:54px;letter-spacing:0;color:#fff;text-shadow:0 0 34px rgba(130,180,255,.22);z-index:300}
        #h1a{top:178px}
        #h1b{top:230px;color:#3fe3ff;text-shadow:0 0 40px rgba(63,227,255,.35)}
        
        .sub{left:586px;transform:translateX(-50%);white-space:nowrap;line-height:1;font-size:13.2px;color:#a9aeb5;z-index:300}
        .sub b{font-weight:600;color:#fff}
        #sub1{top:290px}
        #sub2{top:308px}
        
        .hero-cta{position:absolute;left:586px;transform:translateX(-50%);top:340px;width:max-content;min-width:240px;padding:0 36px;height:54.5px;border-radius:14px;font-size:17px;font-weight:500;letter-spacing:-.01em;z-index:300;}
        .hero-cta:hover{transform:translateX(-50%) translateY(-1px);}
        
        .showcase{position:absolute;left:0;top:0;width:1172px;height:0}
        .ring{position:absolute;left:0;top:0;width:1172px;height:657px;z-index:5;perspective:891px;perspective-origin:586px 918px;transform-style:preserve-3d;pointer-events:none}
        .card{position:absolute;left:586px;top:616px;width:130px;height:300px;margin:-150px 0 0 -65px;border-radius:12px;overflow:hidden;background:#0d1117;box-shadow:0 24px 46px rgba(0,0,0,.6),0 3px 8px rgba(0,0,0,.5);backface-visibility:hidden;will-change:transform}
        .card img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
        .card .edge{position:absolute;inset:0;border-radius:12px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.15),inset 0 16px 30px rgba(255,255,255,.05)}
        .card.broken img{display:none}
        
        .cv{position:absolute;left:0;right:0;padding:0 10px}
        .fill{position:absolute;inset:0}
        .ph{position:absolute;left:0;right:0;overflow:hidden;background:linear-gradient(155deg,#0d1926,#0a1220 60%,#141025)}
        .phf{top:0;bottom:0}
        .ph img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
        .dot{display:inline-block;width:4.5px;height:4.5px;background:#3fe3ff;margin-right:4px;transform:rotate(45deg) translateY(-1px)}
        .dot.sq{transform:none;width:6.5px;height:4.5px;border-radius:1px}
        .t-big{font-weight:900;text-transform:uppercase;line-height:.96;letter-spacing:-.015em;white-space:nowrap;transform:scaleX(.875);transform-origin:left center}
        .t-serif{font-family:"Playfair Display",serif;line-height:1.02;letter-spacing:.01em;white-space:nowrap}
        

        
        .wa{position:absolute;right:16px;bottom:24px;width:56px;height:56px;border-radius:50%;background:#25d366;display:grid;place-items:center;z-index:300;box-shadow:0 8px 20px rgba(0,0,0,.5)}
        .wa svg{width:31px;height:31px}
        .wa::after{content:"";position:absolute;inset:0;border-radius:50%;border:2px solid rgba(37,211,102,.5);animation:pulse 2.8s ease-out infinite}
        @keyframes pulse{0%{transform:scale(1);opacity:.75}70%{transform:scale(1.4);opacity:0}100%{opacity:0}}
        
        @media (max-width: 1080px) {
          .nav{left:286px;width:620px}
          .badge{left:420px;width:330px}
          .stack{transform:translateY(var(--stshift,0px))}
          .showcase{transform:translateY(var(--sshift,0px))}
          .ring{transform:scale(var(--rs,1));transform-origin:586px 595px}
          .wa{width:58px;height:58px;right:22px;bottom:26px}
          .wa svg{width:32px;height:32px}
          .burger{display:grid;place-content:center;gap:4px;position:absolute;right:12px;top:11px;width:42px;height:42px;padding:0;border:0;border-radius:14px;background:transparent;cursor:pointer;-webkit-tap-highlight-color:transparent}
          .burger span{display:block;width:19px;height:1.6px;border-radius:2px;background:rgba(255,255,255,.92);transition:transform .28s cubic-bezier(.4,0,.2,1),opacity .18s}
          .v-badge{left:301px;top:237px;width:378px;height:39px;border-radius:12px;background:linear-gradient(90deg, rgba(60,224,255,0.08) 0%, rgba(10,134,216,0.08) 100%);border:1px solid rgba(60,224,255,0.25);backdrop-filter:blur(10px);box-shadow:inset 0 0 20px rgba(60,224,255,0.05),0 8px 24px rgba(0,0,0,.4), 0 0 15px rgba(60,224,255,0.1)}
          .navmenu{display:block;position:absolute;left:0;right:0;top:74px;padding:12px;border-radius:22px;border:1px solid rgba(255,255,255,.10);background:linear-gradient(180deg,rgba(11,15,22,.985),rgba(7,10,16,.99));-webkit-backdrop-filter:blur(18px) saturate(140%);backdrop-filter:blur(18px) saturate(140%);box-shadow:0 26px 60px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.05);opacity:0;visibility:hidden;transform:translateY(-8px);transition:opacity .24s ease,transform .28s cubic-bezier(.4,0,.2,1),visibility .28s}
          .links{position:static;display:flex;flex-direction:column;align-items:stretch;height:auto;gap:2px;transform:none!important}
          .links a{font-size:15px;padding:11px 14px;border-radius:12px;color:rgba(255,255,255,.9);transition:background .2s,color .2s}
          .nav .v-btn{position:static;width:100%;height:46px;margin-top:10px;font-size:15px}
          .nav.open .navmenu{opacity:1;visibility:visible;transform:none}
        }
        
        @media (max-width: 700px) {
          .canvas{position:relative;left:auto;top:auto;width:100%;height:100%;transform:none!important;display:flex;flex-direction:column;align-items:center;padding:0 20px}
          .canvas>*{position:static}
          .stack{display:contents}
          .nav{position:relative;left:auto;top:auto;width:100%;max-width:500px;height:58px;margin-top:clamp(10px,1.5vh,15px);flex:0 0 auto}
          .nav .mark{left:16px;top:calc(50% - 13px);width:26px;height:26px}
          .wm{left:49px;top:0;height:100%}
          .wm .kick{top:calc(50% - 16px);font-size:5.5px;letter-spacing:.2em}
          .wm .name{top:calc(50% - 9px);font-size:17px;transform:scaleX(.88);transform-origin:left center}
          .burger{right:8px;top:7px;width:44px;height:44px}
          .navmenu{top:68px;padding:12px}
          .links a{font-size:16px;padding:12px 15px;border-radius:12px}
          .nav .v-btn{height:48px;margin-top:10px;font-size:16px}
          
          .badge{position:relative;left:auto;top:auto;margin-top:clamp(16px,2.6vh,26px);width:auto;max-width:100%;height:36px;flex:0 0 auto;border-radius:18px}
          .badge b{position:relative;left:auto;top:auto;height:36px;padding:0 15px 0 42px;font-size:12.5px}
          .badge i{top:4px;left:4px;width:28px;height:28px}
          .badge i svg{width:13px;height:19px}
          
          .h1{position:relative;left:auto;top:auto!important;transform:none!important;white-space:normal;text-align:center;font-size:clamp(29px,8.4vw,36px);line-height:1.06;letter-spacing:-.01em;max-width:7.4em}
          .h1.l1{margin-top:clamp(12px,2.2vh,20px)}
          .sub{position:relative;left:auto;top:auto!important;transform:none!important;white-space:normal;text-align:center;font-size:clamp(14px,3.9vw,15.5px);line-height:1.5;max-width:340px}
          .sub.s1{margin-top:clamp(10px,1.8vh,16px)}
          
          .hero-cta{position:relative;left:auto;top:auto;margin-top:clamp(16px,2.6vh,26px);flex:0 0 auto;width:auto;min-width:158px;height:52px;padding:0 26px;font-size:16px}
          
          .showcase{position:relative;left:auto;top:auto;flex:1 1 auto;width:100%;height:auto;min-height:224px;transform:none!important}
          .ring{position:absolute;left:50%;margin-left:-586px;top:-446px;bottom:auto;width:1172px;height:657px;transform-origin:586px 466px;transform:scale(1.02)!important}
          

          .pghero{margin:0 12px;height:90px;border-radius:8px}
          .pghero .copy{left:14px}
          .pghero .copy u{font-size:6px;letter-spacing:.2em}
          .pghero .copy em{font-size:16px;margin-top:4px}
          .pghero .copy i{font-size:7px;padding:5px 10px;margin-top:6px}
          
          .sf-stats{margin:8px 12px 0;gap:6px}
          .sf-stat{padding:5px 6px}
          .sf-stat b{font-size:10px}
          .sf-stat span{font-size:5px}
          
          .pgsec{margin:8px 12px 6px}
          .pgsec b{font-size:10px}
          .pgsec u{font-size:6px}
          .pggrid{grid-template-columns:repeat(2,1fr);gap:8px;margin:0 12px}
          .pgcard{padding:6px;border-radius:6px}
          .pgcard .ph{border-radius:6px}
          .pgcard .tag{font-size:5px;padding:2px 5px}
          .pgcard b{font-size:8px;margin-top:5px}
          .pgcard i{font-size:6px}
          .pgcard s{font-size:7px;margin-top:3px}
          
          .pgstrip{margin:8px 12px 0;flex-wrap:wrap;gap:4px 12px}
          .pgstrip span{font-size:6px}
          
          .wa{width:54px;height:54px;right:14px;bottom:16px}
          .wa svg{width:29px;height:29px}
        }
      `}} />
      
      <div className="bg"></div>
      <div id="stA" className="stars"></div>
      <div id="stB" className="stars"></div>
      
      <div ref={canvasRef} className="canvas">
        <div className="stack">
          {/* NAV PILL */}
          <div className="nav absolute v-nav-pill">
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
            <button type="button" className="burger" aria-label="Opens menu" aria-expanded="false" aria-controls="navmenu">
              <span></span><span></span><span></span>
            </button>
            <div className="navmenu" id="navmenu">
              <div className="links" id="links">
                <Link href="/">Home</Link>
                <Link href="/login">Dashboard</Link>
                <Link href="/login">Assessments</Link>
                <Link href="/login">Projects</Link>
                <Link href="/login">Teams</Link>
              </div>
              <div className="nav-actions">
                <Link href="/login" className="v-btn nav-btn-ghost"><span>Login</span></Link>
                <Link href="/signup" className="v-btn"><span>Sign Up</span></Link>
              </div>
            </div>
          </div>

          {/* BADGE */}
          <div className="badge absolute v-badge">
            <i className="v-badge-icon" style={{position:'absolute',left:'4px',top:'4px',width:'29px',height:'29px'}}>
              <svg viewBox="5 1 14 22" preserveAspectRatio="none" fill="rgba(16,112,152,.72)" stroke="rgba(190,236,255,.6)" strokeWidth="1.6" strokeLinejoin="round" style={{width:'14px',height:'16px',position:'relative',top:'-1px'}}>
                <path d="M13.9 1.6 5.5 13.6a.7.7 0 0 0 .6 1.1h4.2l-1 7.7a.7.7 0 0 0 1.25.55l8.3-12.1a.7.7 0 0 0-.6-1.1h-4.2l1-7.7a.7.7 0 0 0-1.25-.55Z" />
              </svg>
            </i>
            <b className="v-badge-text" style={{position:'absolute',left:'45px',top:'0',height:'39px',transformOrigin:'0 50%'}}>
              AI-Powered Skill & Project Ecosystem
            </b>
          </div>
          
          {/* HERO TEXT */}
          <div id="h1a" className="h1 absolute l1">Forge Your Skills</div>
          <div id="h1b" className="h1 absolute">Build Projects</div>
          
          <div id="sub1" className="sub absolute s1"><b>Rigorous coding assessments</b> with AI-powered evaluation across</div>
          <div id="sub2" className="sub absolute">60+ languages, verifiable portfolios, and smart team matching.</div>
          
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
