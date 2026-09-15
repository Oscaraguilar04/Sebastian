import { useEffect, useId, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { CONSULTATION_HREF, NAV_LINKS, SITE } from "../../data/site";
import { trapDialogFocus } from "../dialogFocus";
import "./Navigation.css";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const destinationRef = useRef<string | null>(null);
  const reduceMotion = useReducedMotion();
  const menuId = useId();

  useEffect(() => {
    const onScroll = () => setHasScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1201px)");
    const onChange = () => {
      if (desktop.matches) setIsOpen(false);
    };
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    closeRef.current?.focus({ preventScroll: true });

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      const destination = destinationRef.current;
      destinationRef.current = null;

      if (destination) {
        window.requestAnimationFrame(() => {
          const section = document.getElementById(destination.slice(1));
          if (!section) return;
          const heading =
            section.querySelector<HTMLElement>("h1, h2, h3") ?? section;
          const oldTabIndex = heading.getAttribute("tabindex");
          heading.setAttribute("tabindex", "-1");
          heading.focus({ preventScroll: true });
          heading.addEventListener(
            "blur",
            () => {
              if (oldTabIndex === null) heading.removeAttribute("tabindex");
              else heading.setAttribute("tabindex", oldTabIndex);
            },
            { once: true },
          );
          if (window.location.hash !== destination) {
            window.history.pushState(null, "", destination);
          }
          section.scrollIntoView({
            behavior: reduceMotion ? "instant" : "smooth",
            block: "start",
          });
        });
      } else if (window.matchMedia("(max-width: 1200px)").matches) {
        toggleRef.current?.focus({ preventScroll: true });
      }
    };
  }, [isOpen, reduceMotion]);

  function selectDestination(
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) {
    event.preventDefault();
    destinationRef.current = href;
    setIsOpen(false);
  }

  return (
    <header className={`nav${hasScrolled ? " is-scrolled" : ""}`}>
      <div className="nav__bar">
        <a className="nav__brand" href="#top" aria-label={`${SITE.name}, home`}>
          {SITE.name}
        </a>
        <nav className="nav__links" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a key={link.href} className="nav__link" href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <a className="nav__cta" href={CONSULTATION_HREF}>
          Let's Talk
        </a>
        <button
          className="nav__toggle"
          ref={toggleRef}
          type="button"
          aria-label="Open navigation menu"
          aria-expanded={isOpen}
          aria-controls={menuId}
          aria-haspopup="dialog"
          onClick={() => setIsOpen(true)}
        >
          <Menu size={22} strokeWidth={1.15} aria-hidden="true" />
        </button>
      </div>

      <dialog
        ref={dialogRef}
        id={menuId}
        className="nav__dialog"
        aria-label="Navigation menu"
        onKeyDown={trapDialogFocus}
        onCancel={(event) => {
          event.preventDefault();
          setIsOpen(false);
        }}
      >
        {isOpen ? (
          <motion.div
            className="nav__panel"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="nav__panel-top">
              <a
                className="nav__brand"
                href="#top"
                onClick={(event) => selectDestination(event, "#top")}
              >
                {SITE.name}
              </a>
              <button
                className="nav__toggle"
                type="button"
                ref={closeRef}
                aria-label="Close navigation menu"
                onClick={() => setIsOpen(false)}
              >
                <X size={22} strokeWidth={1.15} aria-hidden="true" />
              </button>
            </div>
            <nav className="nav__panel-links" aria-label="Mobile navigation">
              {NAV_LINKS.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className="nav__panel-link"
                  onClick={(event) => selectDestination(event, link.href)}
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.05 * index,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
            <a
              className="btn"
              href={CONSULTATION_HREF}
              onClick={(event) => selectDestination(event, CONSULTATION_HREF)}
            >
              Let's Talk
            </a>
          </motion.div>
        ) : null}
      </dialog>
    </header>
  );
}
