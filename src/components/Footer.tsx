import { Link } from 'react-router-dom';
import { FOOTER_COPY, NAV_LINKS } from '../content/site';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">DASHA<span>·</span>ASTRO</div>
      <nav aria-label="Footer" className="footer-links">
        {NAV_LINKS.map((link) => <a key={link.label} href={link.href}>{link.label}</a>)}
        <Link to="/app">Sanctuary</Link>
      </nav>
      <div className="footer-auth"><Link to="/login">Log In</Link><span>·</span><Link to="/signup">Begin Free</Link></div>
      <p className="footer-copy">{FOOTER_COPY}</p>
    </footer>
  );
}
