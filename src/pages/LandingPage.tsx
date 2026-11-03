import { lazy, Suspense, useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { DashaIntroduction } from '../components/DashaIntroduction';
import { SampleSection } from '../components/SampleSection';
import { AstrologyTools } from '../components/AstrologyTools';
import { PricingSection } from '../components/PricingSection';
import { FaqSection } from '../components/FaqSection';
import { FinalCTA } from '../components/FinalCTA';
import { Footer } from '../components/Footer';
import { Loader } from '../components/Loader';
import { StaticSky } from '../components/StaticSky';
import { SceneBoundary } from '../components/SceneBoundary';
import { detectQuality, detectWebGL, motion, prefersReducedMotion } from '../lib/store';
import { useScrollScenes } from '../lib/useScrollScenes';

const SolarSystemScene = lazy(() => import('../scene/SolarSystemScene'));

export function LandingPage() {
  const [webgl] = useState(detectWebGL);
  const [quality] = useState(detectQuality);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(!webgl);
  const [hidden, setHidden] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    document.title = 'Dasha Astro — Discover Your Dasha';
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => {
      motion.reduced = prefersReducedMotion();
      document.documentElement.classList.toggle('reduced', motion.reduced);
    };
    apply();
    mq.addEventListener('change', apply);
    const onMove = (event: PointerEvent) => {
      motion.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      motion.pointer.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };
    const onVis = () => setHidden(document.hidden);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('visibilitychange', onVis);
    setMounted(true);
    const failSafe = window.setTimeout(() => setReady(true), 6000);
    return () => {
      mq.removeEventListener('change', apply);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVis);
      window.clearTimeout(failSafe);
    };
  }, []);

  useScrollScenes(mounted);

  useEffect(() => {
    if (!mounted || !window.location.hash) return;
    const el = document.querySelector(window.location.hash);
    if (el) window.setTimeout(() => el.scrollIntoView(), 60);
  }, [mounted]);

  const showScene = webgl && !failed;

  return (
    <>
      <Loader done={ready} />
      <div className="scene-layer" aria-hidden>
        {showScene ? (
          <SceneBoundary fallback={null} onFail={() => { setFailed(true); setReady(true); }}>
            <Suspense fallback={null}>
              <SolarSystemScene quality={quality} onReady={() => setReady(true)} paused={hidden} />
            </Suspense>
          </SceneBoundary>
        ) : <StaticSky />}
        <div className="vignette" />
      </div>
      <a className="skip" href="#dasha">Skip to content</a>
      <Navbar />
      <main id="top">
        <HeroSection />
        <DashaIntroduction />
        <SampleSection />
        <AstrologyTools />
        <PricingSection />
        <FaqSection />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
