import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS } from '../content/site';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="nav" data-open={open}>
      <a href="#top" className="nav-brand" aria-label="Dasha Astro — home">DASHA<span>·</span>ASTRO</a>
      <nav aria-label="Primary" className="nav-links" id="nav-links">
        {NAV_LINKS.map((link) => (
          <a key={link.label} href={link.href} onClick={close}><span>{link.label}</span></a>
        ))}
        <Link className="nav-signin nav-signin--mobile" to="/app" onClick={close}>Sanctuary</Link>
        <Link className="nav-signin nav-signin--mobile" to="/signup" onClick={close}>Begin Free</Link>
        <Link className="nav-signin nav-signin--mobile" to="/login" onClick={close}>Sign In</Link>
      </nav>
      <div className="nav-end">
        <Link className="nav-textlink" to="/app">Sanctuary</Link>
        <Link className="nav-signin" to="/signup">Begin Free</Link>
        <Link className="nav-signin" to="/login">Sign In</Link>
      </div>
      <button className="nav-toggle" aria-expanded={open} aria-controls="nav-links" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((value) => !value)}>
        {open ? <X size={18} strokeWidth={1.4} /> : <Menu size={18} strokeWidth={1.4} />}
      </button>
    </header>
  );
}
