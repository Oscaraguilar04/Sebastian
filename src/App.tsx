import { useCallback, useState } from "react";
import { MotionConfig } from "framer-motion";
import { Navigation } from "./components/Navigation/Navigation";
import { Hero } from "./components/Hero/Hero";
import { Statement } from "./components/Statement";
import { Residences } from "./components/Residences";
import { Neighborhoods } from "./components/Neighborhoods";
import { Buying } from "./components/Buying";
import { Selling } from "./components/Selling";
import { Approach } from "./components/Approach";
import { Contact } from "./components/Contact";
import type { ContactInquiry } from "./components/Contact";
import { Footer } from "./components/Footer";

export default function App() {
  const [inquiry, setInquiry] = useState<ContactInquiry>();

  const onInquire = useCallback(
    (interest: ContactInquiry["interest"], message?: string) => {
      setInquiry({ interest, message, key: Date.now() });
      requestAnimationFrame(() => {
        const contact = document.getElementById("contact");
        contact?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "instant"
            : "smooth",
        });
        const heading = document.getElementById("contact-heading");
        heading?.setAttribute("tabindex", "-1");
        heading?.focus({ preventScroll: true });
      });
    },
    [],
  );

  return (
    <MotionConfig reducedMotion="user">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Navigation />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <Statement />
        <Residences onInquire={onInquire} />
        <Neighborhoods />
        <Buying onInquire={onInquire} />
        <Selling onInquire={onInquire} />
        <Approach />
        <Contact inquiry={inquiry} />
      </main>
      <Footer />
    </MotionConfig>
  );
}
