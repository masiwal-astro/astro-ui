import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { clamp, motion } from './store';

gsap.registerPlugin(ScrollTrigger);

interface Stop { id: string; shape: number }

function sectionTop(id: string) {
  const el = document.getElementById(id);
  if (!el) return 0;
  return el.getBoundingClientRect().top + window.scrollY;
}

/** Morph over ~70% of a viewport as the next section arrives, then hold. */
export function computeMorph() {
  if (motion.reduced) return 0;
  const mobile = window.innerWidth < 760;
  const stops: Stop[] = mobile
    ? [
        { id: 'hero', shape: 0 },
        { id: 'dasha', shape: 0 },
        { id: 'sample', shape: 2 },
        { id: 'tools', shape: 2 },
        { id: 'pricing', shape: 2 },
        { id: 'faq', shape: 2 },
        { id: 'begin', shape: 5 },
      ]
    : [
        { id: 'hero', shape: 0 },
        { id: 'dasha', shape: 1 },
        { id: 'sample', shape: 2 },
        { id: 'tools', shape: 3 },
        { id: 'pricing', shape: 4 },
        { id: 'faq', shape: 4 },
        { id: 'begin', shape: 5 },
      ];
  const vh = window.innerHeight;
  const span = vh * 0.7;
  const focus = vh * 0.28;
  const y = window.scrollY;
  let morph = stops[0].shape;
  for (let i = 1; i < stops.length; i += 1) {
    const arrive = sectionTop(stops[i].id) - focus;
    const start = arrive - span;
    if (y < start) break;
    const t = clamp((y - start) / span);
    const ease = t * t * (3 - 2 * t);
    morph = stops[i - 1].shape + (stops[i].shape - stops[i - 1].shape) * ease;
    if (t < 1) break;
    morph = stops[i].shape;
  }
  if (!mobile && morph >= 4.92) {
    const begin = document.getElementById('begin');
    if (begin) {
      const into = clamp((vh * 0.72 - begin.getBoundingClientRect().top) / span);
      morph = 5 + into;
    }
  }
  return morph;
}

/** Wires smooth scrolling, section reveals, and the particle morph scrub. */
export function useScrollScenes(enabled: boolean) {
  useLayoutEffect(() => {
    if (!enabled) return;
    const reduced = motion.reduced;
    let lenis: Lenis | null = null;
    const tick = (t: number) => lenis?.raf(t * 1000);
    if (!reduced) {
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }
    const onAnchor = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute('href')!;
      const el = id === '#top' ? document.body : document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(id === '#top' ? 0 : (el as HTMLElement), { offset: 0, duration: 1.1 });
      else (el as HTMLElement).scrollIntoView();
      history.replaceState(null, '', id);
    };
    document.addEventListener('click', onAnchor);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((group) => {
        const items = group.querySelectorAll('[data-reveal]');
        gsap.fromTo(items, { y: 10, opacity: 0 }, {
          y: 0, opacity: 1, duration: reduced ? 0.01 : 0.4, ease: 'power2.out', stagger: 0.04,
          scrollTrigger: { trigger: group, start: 'top 84%', once: true },
        });
      });

      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: () => { motion.morph = computeMorph(); },
      });
      motion.morph = computeMorph();

      ScrollTrigger.create({ start: 80, end: 'max', onToggle: (st) => document.documentElement.classList.toggle('is-scrolled', st.isActive) });
    });

    const onResize = () => { motion.morph = computeMorph(); ScrollTrigger.refresh(); };
    window.addEventListener('resize', onResize);
    return () => {
      ctx.revert();
      document.removeEventListener('click', onAnchor);
      window.removeEventListener('resize', onResize);
      if (lenis) { gsap.ticker.remove(tick); lenis.destroy(); }
    };
  }, [enabled]);
}
