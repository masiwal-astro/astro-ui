# Dasha Astro

A cinematic interface for [Dasha Astro](https://www.dashaastro.com): a scroll-linked solar system on the landing page, and a sanctuary for the product’s real surfaces — consultation chat, birth details, D1/D9/D10 charts, Vimshottari timing, Family Vault, birth-time rectification, credit packs, FAQ, and phone sign-in.

The visual system is near-black `#030303`, silver, and champagne gold, with Instrument Serif for headlines and Space Grotesk for UI.

## Run locally

```bash
npm install
npm run dev
```

The dev server binds to [http://127.0.0.1:4327](http://127.0.0.1:4327). `npm run build` typechecks and writes `dist/`. `npm run preview` serves that build on the same port.

## Routes

| Path | Screen |
| --- | --- |
| `/` | Landing: particle Shani sun, eight orbiting Navagrahas, scroll descent, sample reading, reports, pricing, FAQ |
| `/login` | Phone verification. Any 6-digit code is accepted. No SMS is sent. |
| `/signup` | The same verification, then a birth profile. New accounts receive 10 credits that do not expire. |
| `/app` | Sanctuary. `?panel=` is `consult`, `chart`, `dasha`, `vault`, `rectify`, `credits`, or `traditions`. |

Opening `/app` without an account shows the published fictional chart so the chart and dasha screens are visible. It is labeled example data.

## What is real, and what is not

Copy, prices (₹99 / ₹249 / ₹499), the 10 complimentary credits, the seven languages, and the Aarav Verma sample are taken from the public site. That sample is a **fictional subject**. This app quotes it and marks it as example data.

Nothing here calls the Swiss Ephemeris. A question that is not the published example gets an explicit notice, not a generated prediction. There are no testimonials and no invented statistics.

## Wiring a real API

Screens talk to three interfaces in `src/services/types.ts`:

- `AuthService` — code request, verification, profile vault
- `AstrologyService` — `chart`, `dasha`, `consult`, `rectify`
- `LedgerService` — pack purchase and daily check-in

`src/services/index.ts` binds the in-browser placeholders (`mockAuth.ts`, `mockAstrology.ts`, `mockLedger.ts`). Accounts live in `localStorage` under `dasha-astro.accounts.v1`. Replace those three exports with clients that implement the same interfaces; the screens do not need to change.

Birth details typed on the landing search are kept in `sessionStorage` only until signup or the vault form consumes them.

## Motion and fallbacks

The landing scene uses Three.js, React Three Fiber, and GSAP ScrollTrigger, with Lenis for smooth scrolling. If WebGL is missing or the scene throws, an SVG sky is shown instead. `prefers-reduced-motion: reduce` cuts animation short and disables smooth scrolling. The sanctuary itself is DOM, so it does not depend on WebGL.
