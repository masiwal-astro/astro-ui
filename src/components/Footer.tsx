import { FOOTER_COPY, LOGIN_URL, NAV_LINKS } from '../content/site';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">DASHA<span>·</span>ASTRO</div>
      <nav aria-label="Footer" className="footer-links">
        {NAV_LINKS.map((l) => <a key={l.label} href={l.href}>{l.label}</a>)}
      </nav>
      <div className="footer-auth"><a href={LOGIN_URL}>Log In</a><span>·</span><a href={LOGIN_URL}>Begin Free</a></div>
      <p className="footer-copy">{FOOTER_COPY}</p>
    </footer>
  );
}
