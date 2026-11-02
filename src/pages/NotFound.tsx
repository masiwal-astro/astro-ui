import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export function NotFound() {
  useEffect(() => { document.title = 'Not found — Dasha Astro'; }, []);
  return (
    <main className="not-found">
      <p className="label label--gold">404</p>
      <h1 className="display display--md">This page is outside the chart.</h1>
      <Link className="btn btn--primary" to="/">Return home</Link>
    </main>
  );
}
