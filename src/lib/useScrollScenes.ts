import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { motion } from './store';

gsap.registerPlugin(ScrollTrigger);

/** Wires smooth scrolling + every scroll-linked timeline. Returns nothing; cleans up on unmount. */
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
      if (lenis) lenis.scrollTo(id === '#top' ? 0 : (el as HTMLElement), { offset: 0, duration: 1.6 });
      else (el as HTMLElement).scrollIntoView();
      history.replaceState(null, '', id);
    };
    document.addEventListener('click', onAnchor);

    const ctx = gsap.context(() => {
      // 1 — SHANI DESCENDS: pin hero, drive the 3D composition by progress.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#hero', start: 'top top', end: '+=90%', pin: true, scrub: reduced ? true : 0.8,
          onUpdate: (st) => { motion.descent = st.progress; },
          onLeave: () => { motion.descent = 1; },
          onEnterBack: () => {},
        },
      });
      tl.to('.hero-copy', { y: -60, opacity: 0, ease: 'power1.in', duration: 0.45 }, 0)
        .to('.hero-edge', { opacity: 0, duration: 0.3 }, 0)
        .to('.scroll-cue', { opacity: 0, duration: 0.15 }, 0)
        .to({}, { duration: 0.55 });

      // 2 — section reveals (staggered)
      gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((group) => {
        const items = group.querySelectorAll('[data-reveal]');
        gsap.fromTo(items, { y: 28, opacity: 0, filter: 'blur(6px)' }, {
          y: 0, opacity: 1, filter: 'blur(0px)', duration: reduced ? 0.01 : 1.1, ease: 'power3.out', stagger: 0.09,
          scrollTrigger: { trigger: group, start: 'top 78%', once: true },
        });
      });

      // 3 — Dasha section: delicate halo rings around the settled Sun
      gsap.fromTo('.intro-halo', { scale: 0.6, opacity: 0 }, {
        scale: 1, opacity: 1, ease: 'none',
        scrollTrigger: { trigger: '#dasha', start: 'top 85%', end: 'center center', scrub: true },
      });

      // 4 — horizon rise for the final section
      ScrollTrigger.create({
        trigger: '#begin', start: 'top bottom', end: 'center center', scrub: true,
        onUpdate: (st) => { motion.horizon = st.progress; },
      });

      // 5 — navbar state
      ScrollTrigger.create({ start: 80, end: 'max', onToggle: (st) => document.documentElement.classList.toggle('is-scrolled', st.isActive) });
    });

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('load', onResize);
    return () => {
      ctx.revert();
      document.removeEventListener('click', onAnchor);
      window.removeEventListener('load', onResize);
      if (lenis) { gsap.ticker.remove(tick); lenis.destroy(); }
    };
  }, [enabled]);
}
