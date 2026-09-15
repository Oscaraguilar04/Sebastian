import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CONSULTATION_HREF, RESIDENCES_HREF, SITE } from "../../data/site";
import { EditorialImage } from "../EditorialImage";
import "./Hero.css";

const EASE = [0.22, 1, 0.36, 1] as const;

function RevealLine({
  text,
  startDelay,
  stagger,
  reduceMotion,
}: {
  text: string;
  startDelay: number;
  stagger: number;
  reduceMotion: boolean | null;
}) {
  return (
    <span className="hero__line" aria-hidden="true">
      {text.split("").map((character, index) => (
        <motion.span
          key={`${text}-${index}`}
          className="hero__char"
          initial={reduceMotion ? false : { opacity: 0, y: 11 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: startDelay + index * stagger,
            ease: EASE,
          }}
        >
          {character}
        </motion.span>
      ))}
    </span>
  );
}

export function Hero() {
  const reduceMotion = useReducedMotion();
  const [compact] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 900px)").matches,
  );

  const firstDelay = compact ? 0.2 : 0.25;
  const firstStagger = compact ? 0.055 : 0.07;
  const secondDelay = compact ? 0.72 : 0.9;
  const secondStagger = compact ? 0.06 : 0.075;

  return (
    <section className="hero" id="top" aria-labelledby="hero-name">
      <div className="hero__copy">
        <motion.p
          className="label"
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15, ease: EASE }}
        >
          {SITE.location}
        </motion.p>
        <div className="hero__identity">
          <h1 id="hero-name" className="hero__name">
            <span className="hero__sr">{SITE.name}</span>
            <RevealLine
              text="SEBASTIAN"
              startDelay={firstDelay}
              stagger={firstStagger}
              reduceMotion={reduceMotion}
            />
            <RevealLine
              text="ALVAREZ"
              startDelay={secondDelay}
              stagger={secondStagger}
              reduceMotion={reduceMotion}
            />
          </h1>
          <motion.p
            className="hero__practice"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 1.6, ease: EASE }}
          >
            {SITE.practice}
          </motion.p>
        </div>
        <div className="hero__close">
          <motion.p
            className="hero__statement"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.75, ease: EASE }}
          >
            Thoughtful representation for buyers and sellers making their next
            move.
          </motion.p>
          <motion.a
            className="btn"
            href={CONSULTATION_HREF}
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 1.9, ease: EASE }}
          >
            Let's Talk About Your Move
          </motion.a>
          <motion.a
            className="text-link"
            href={RESIDENCES_HREF}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 1.9, ease: EASE }}
          >
            View Selected Residences →
          </motion.a>
        </div>
      </div>
      <div className="hero__media">
        <motion.div
          className="hero__frame"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0, ease: EASE }}
        >
          <EditorialImage
            name="hero"
            alt="Sebastian Alvarez outside a modern home, holding a portfolio"
            className="hero__image"
            priority
            objectPosition="54% 18%"
            sizes="(max-width: 900px) 100vw, 62vw"
          />
        </motion.div>
      </div>
    </section>
  );
}
