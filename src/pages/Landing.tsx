import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import Lenis from 'lenis';
import { Link as RouterLink } from 'react-router-dom';
import { CONTENT } from '@/content';
import { ScrollMarquee } from '@/components/landing/ScrollMarquee';
import { ChevronDown, ArrowRight, Github, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Custom hook for animated counting
function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTimestamp: number | null = null;
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };
          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return { count, ref };
}

function AnimatedStat({ value, label }: { value: string, label: string }) {
  const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
  const prefix = value.includes('<') ? '<' : '';
  const suffix = value.replace(/[0-9<]/g, '');
  const { count, ref } = useCountUp(numericValue);

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20%" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="text-center"
    >
      <div className="text-5xl md:text-7xl font-black text-green-700 mb-2">
        {prefix}{count}{suffix}
      </div>
      <div className="text-slate-600 font-medium max-w-xs mx-auto">{label}</div>
    </motion.div>
  );
}

export default function Landing() {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  
  // Setup Lenis
  useEffect(() => {
    if (prefersReducedMotion) return;
    
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, [prefersReducedMotion]);

  // Hero Image Crossfade
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % CONTENT.hero.images.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Parallax calculations for hero
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(heroScroll, [0, 1], [1, 0]);
  const heroScale = useTransform(heroScroll, [0, 1], [1, 0.9]);
  const heroY = useTransform(heroScroll, [0, 1], [0, 100]);

  // Harvest Cycle Parallax
  const harvestRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: harvestScroll } = useScroll({ target: harvestRef, offset: ["start end", "end start"] });

  return (
    <div className="bg-[#FAF9F6] text-slate-900 font-sans selection:bg-green-200">
      
      {/* Sticky Navbar */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl bg-white/80 backdrop-blur-md shadow-sm border border-slate-200 rounded-full px-6 py-3 flex items-center justify-between">
        <div className="font-black text-green-700 tracking-tight text-lg">AGRIMITRA</div>
        <div className="hidden md:flex gap-6 text-sm font-semibold text-slate-600">
          <a href="#problem" className="hover:text-green-700 transition-colors">The Problem</a>
          <a href="#solution" className="hover:text-green-700 transition-colors">How It Works</a>
          <a href="#demo" className="hover:text-green-700 transition-colors">Demo</a>
          <a href="#faq" className="hover:text-green-700 transition-colors">FAQ</a>
        </div>
        <div className="flex gap-3">
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-sm font-semibold transition-colors">
            <Github size={16} /> GitHub
          </a>
          <RouterLink to="/app" className="bg-green-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-green-700 transition-colors shadow-sm">
            View Live Demo
          </RouterLink>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden bg-slate-900">
        {/* Crossfading Backgrounds */}
        {CONTENT.hero.images.map((src, i) => (
          <img 
            key={src}
            src={src}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ease-in-out ${i === heroImageIndex ? 'opacity-60' : 'opacity-0'}`}
            alt="Hero Background"
            loading={i === 0 ? "eager" : "lazy"}
          />
        ))}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
        <div className="absolute inset-0 bg-black/20" />

        <motion.div 
          style={{ opacity: prefersReducedMotion ? 1 : heroOpacity, scale: prefersReducedMotion ? 1 : heroScale, y: prefersReducedMotion ? 0 : heroY }}
          className="relative z-10 text-center px-4 max-w-5xl mx-auto"
        >
          <h1 className="text-6xl md:text-[8rem] lg:text-[10rem] font-black text-white leading-none tracking-tighter mb-6" style={{ textShadow: "0 10px 30px rgba(0,0,0,0.5), 0 1px 1px rgba(0,0,0,0.8)" }}>
            {CONTENT.hero.title}
          </h1>
          <p className="text-xl md:text-3xl text-green-50 font-medium tracking-wide mb-10 max-w-2xl mx-auto drop-shadow-md">
            {CONTENT.hero.subtitle}
          </p>
          <RouterLink to="/app" className="inline-flex items-center gap-2 bg-green-500 text-slate-900 px-8 py-4 rounded-full text-lg font-bold hover:bg-green-400 hover:scale-105 transition-all shadow-[0_0_40px_rgba(34,197,94,0.4)]">
            See It In Action <ArrowRight size={20} />
          </RouterLink>
        </motion.div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 animate-bounce">
          <ChevronDown size={32} />
        </div>
      </section>

      {/* The Problem (Stats) */}
      <section id="problem" className="py-32 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-sm font-bold text-green-600 tracking-widest uppercase mb-4">The Challenge</h2>
          <p className="text-3xl md:text-5xl font-bold tracking-tight text-slate-800 max-w-3xl mx-auto leading-tight">
            Information asymmetry leaves farmers vulnerable to volatile markets.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {CONTENT.stats.map((stat, i) => (
            <AnimatedStat key={i} value={stat.value} label={stat.label} />
          ))}
        </div>
        <p className="text-center text-xs text-slate-400 mt-16 max-w-2xl mx-auto">
          * Illustrative figures for demo purposes. See research notes in repository.
        </p>
      </section>

      {/* The Solution (Harvest Cycle Radial Parallax) */}
      <section id="solution" ref={harvestRef} className="py-32 bg-slate-900 text-white overflow-hidden relative min-h-[800px] flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-slate-900 to-slate-900"></div>
        
        <div className="relative z-10 text-center w-full max-w-6xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-48 h-48 mx-auto bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_80px_rgba(34,197,94,0.2)] mb-8 z-20 relative"
          >
            <span className="text-2xl font-black text-slate-900">AGRIMITRA</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">The Harvest Cycle</h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Bringing market, weather, and advisory data into one unified ecosystem.
          </p>
        </div>

        {/* Floating parallax elements */}
        {!prefersReducedMotion && CONTENT.harvest_cycle_images.map((src, i) => {
          // Calculate random spread
          const angle = (i / CONTENT.harvest_cycle_images.length) * Math.PI * 2;
          const radius = 200 + Math.random() * 200;
          const left = `calc(50% + ${Math.cos(angle) * radius}px)`;
          const top = `calc(50% + ${Math.sin(angle) * radius}px)`;
          
          // Use index to vary speed
          const speed = 50 + (i % 3) * 100;
          const y = useTransform(harvestScroll, [0, 1], [-speed, speed]);
          const rotate = useTransform(harvestScroll, [0, 1], [-20, 20]);

          return (
            <motion.img 
              key={i}
              src={src}
              style={{ y, rotate, left, top }}
              className="absolute w-24 h-24 object-contain opacity-60 z-0 pointer-events-none"
              alt="floating"
            />
          );
        })}
      </section>

      {/* How It Works (Alternating with Marquees) */}
      <section className="py-24 bg-[#FAF9F6] overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 mb-16">
          <h2 className="text-4xl font-bold tracking-tight">How It Works</h2>
        </div>
        
        {/* Marquee Band 1 */}
        <ScrollMarquee images={CONTENT.marquee_bands.band1} direction="left" speed={300} className="mb-24" />

        <div className="max-w-6xl mx-auto px-6 space-y-32">
          {CONTENT.how_it_works.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8 }}
              className={`flex flex-col ${i % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 items-center`}
            >
              <div className="flex-1 space-y-6">
                <div className="text-green-500 font-bold text-xl">0{i + 1}</div>
                <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-800">{item.title}</h3>
                <p className="text-xl text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
              <div className="flex-1 w-full bg-white rounded-3xl shadow-xl aspect-video border border-slate-100 flex items-center justify-center p-8 overflow-hidden relative">
                {/* Placeholder for screenshots */}
                <div className="absolute inset-0 bg-slate-50 flex items-center justify-center">
                  <span className="text-slate-300 font-mono text-sm">[ UI Component Illustration ]</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Marquee Band 2 - Floating Icons */}
        <ScrollMarquee images={CONTENT.marquee_bands.band2} direction="right" speed={400} className="mt-32 h-32" />
      </section>

      {/* Features Grid */}
      <section className="py-32 bg-white px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold tracking-tight mb-16 text-center">Built for scale.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CONTENT.features.map((feat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-slate-50 border border-slate-100 rounded-2xl p-8 hover:bg-green-50 transition-colors"
              >
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                  <CheckCircleIcon />
                </div>
                <h4 className="text-xl font-bold text-slate-800">{feat}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Demo Embed */}
      <section id="demo" className="py-32 bg-slate-900 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Experience AgriMitra</h2>
          <p className="text-slate-400 mb-12 text-lg">Interact with the live dashboard and advisory bot.</p>
          
          <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl shadow-green-900/20 aspect-[16/9] md:aspect-[21/9] bg-slate-800 flex items-center justify-center mb-12 group">
             {/* Instead of a real iframe which can be heavy, we'll link to it, or show a mocked frame */}
             <div className="absolute inset-0 bg-[url('/assets/hero/farmland-aerial-1.webp')] bg-cover opacity-20 group-hover:opacity-10 transition-opacity"></div>
             <RouterLink to="/app" className="relative z-10 bg-white text-slate-900 px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform">
                Open Full Demo <ExternalLink size={18} />
             </RouterLink>
          </div>
        </div>
      </section>

      {/* FAQ & Footer */}
      <section id="faq" className="py-32 bg-[#FAF9F6] px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold tracking-tight mb-16 text-center">FAQ</h2>
          <div className="space-y-4">
            {CONTENT.faq.map((item, i) => (
              <details key={i} className="group bg-white border border-slate-200 rounded-2xl p-6 cursor-pointer">
                <summary className="font-bold text-lg text-slate-800 flex justify-between items-center list-none outline-none">
                  {item.q}
                  <span className="text-green-500 group-open:rotate-180 transition-transform"><ChevronDown /></span>
                </summary>
                <div className="mt-4 text-slate-600 leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-32 bg-emerald-900 text-center px-6">
        <h2 className="text-4xl md:text-6xl font-black text-white mb-10 tracking-tighter max-w-4xl mx-auto">
          Built for the field,<br/>not just the dashboard.
        </h2>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <RouterLink to="/app" className="bg-white text-emerald-900 px-8 py-4 rounded-full font-bold hover:bg-green-50 transition-colors">
            View Live Demo
          </RouterLink>
          <a href="https://github.com" className="bg-emerald-800 text-white px-8 py-4 rounded-full font-bold hover:bg-emerald-700 transition-colors border border-emerald-700">
            View GitHub
          </a>
        </div>
      </section>

      <footer className="py-8 bg-slate-950 text-center text-slate-500 text-sm">
        <div className="font-black text-lg text-slate-700 mb-2">AGRIMITRA</div>
        <p>Built by Tejas Chintawar — PICT</p>
      </footer>
    </div>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  )
}
