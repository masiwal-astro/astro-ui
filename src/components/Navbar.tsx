import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { LOGIN_URL, NAV_LINKS } from '../content/site';

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="nav" data-open={open}>
      <a href="#top" className="nav-brand" aria-label="Dasha Astro — home">DASHA<span>·</span>ASTRO</a>
      <nav aria-label="Primary" className="nav-links" id="nav-links">
        {NAV_LINKS.map((l) => (
          <a key={l.label} href={l.href} onClick={() => setOpen(false)}><span>{l.label}</span></a>
        ))}
        <a className="nav-signin nav-signin--mobile" href={LOGIN_URL}>Sign In</a>
      </nav>
      <a className="nav-signin" href={LOGIN_URL}>Sign In</a>
      <button className="nav-toggle" aria-expanded={open} aria-controls="nav-links" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((o) => !o)}>
        {open ? <X size={18} strokeWidth={1.4} /> : <Menu size={18} strokeWidth={1.4} />}
      </button>
    </header>
  );
}
