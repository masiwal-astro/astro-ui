import { lazy, Suspense, useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DashaIntroduction } from './components/DashaIntroduction';
import { AstrologyTools } from './components/AstrologyTools';
import { HowItWorks } from './components/HowItWorks';
import { BenefitsSection } from './components/BenefitsSection';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { Loader } from './components/Loader';
import { StaticSky } from './components/StaticSky';
import { detectQuality, detectWebGL, motion, prefersReducedMotion } from './lib/store';
import { useScrollScenes } from './lib/useScrollScenes';

const SolarSystemScene = lazy(() => import('./scene/SolarSystemScene'));

export default function App() {
  const [webgl] = useState(detectWebGL);
  const [quality] = useState(detectQuality);
  const [ready, setReady] = useState(!webgl);
  const [hidden, setHidden] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => { motion.reduced = prefersReducedMotion(); document.documentElement.classList.toggle('reduced', motion.reduced); };
    apply(); mq.addEventListener('change', apply);
    const onMove = (e: PointerEvent) => { motion.pointer.x = (e.clientX / window.innerWidth) * 2 - 1; motion.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1); };
    const onVis = () => setHidden(document.hidden);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('visibilitychange', onVis);
    setMounted(true);
    const failSafe = window.setTimeout(() => setReady(true), 6000);
    return () => { mq.removeEventListener('change', apply); window.removeEventListener('pointermove', onMove); document.removeEventListener('visibilitychange', onVis); clearTimeout(failSafe); };
  }, []);

  useScrollScenes(mounted);

  return (
    <>
      <Loader done={ready} />
      <div className="scene-layer" aria-hidden>
        {webgl ? (
          <Suspense fallback={null}><SolarSystemScene quality={quality} onReady={() => setReady(true)} paused={hidden} /></Suspense>
        ) : <StaticSky />}
        <div className="vignette" />
      </div>
      <a className="skip" href="#dasha">Skip to content</a>
      <Navbar />
      <main id="top">
        <HeroSection />
        <DashaIntroduction />
        <AstrologyTools />
        <HowItWorks />
        <BenefitsSection />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
