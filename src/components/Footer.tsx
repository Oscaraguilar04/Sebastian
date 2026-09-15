import { NAV_LINKS, SITE } from "../data/site";
import "./Footer.css";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__brand">
        <p>{SITE.name}</p>
        <span>
          {SITE.practice}
          <br />
          {SITE.location}
        </span>
      </div>
      <nav className="footer__links" aria-label="Footer">
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
      <div className="footer__credit">
        <p>Acre & Signal Portfolio Concept</p>
        <p>
          This website is a fictional portfolio demonstration created by Acre
          & Signal.
        </p>
      </div>
    </footer>
  );
}
