import { useState } from "react";
import { EditorialImage } from "./EditorialImage";
import { moveTablist } from "../lib/tablist";
import { motion, useReducedMotion } from "framer-motion";
import "./Approach.css";

const PRINCIPLES = [
  {
    id: "listen",
    number: "01",
    title: "Listen First",
    copy: "The first meeting is not a pitch. Sebastian asks what the move is for, then stays with that answer before a house or a timeline is discussed.",
    image: "clients",
    alt: "Sebastian Alvarez greeting clients outside a home",
    objectPosition: "62% 30%",
  },
  {
    id: "prepare",
    number: "02",
    title: "Prepare Thoughtfully",
    copy: "You see the plan before the pressure. Timing, documents, and decisions are sequenced so nothing important is improvised in the moment it matters.",
    image: "filing",
    alt: "Sebastian Alvarez reviewing plans with clients at a table",
    objectPosition: "48% 28%",
  },
  {
    id: "communicate",
    number: "03",
    title: "Communicate Clearly",
    copy: "You hear the same story he is telling the other side of the table: what changed, what it means, and what happens next.",
    image: "showing",
    alt: "Sebastian Alvarez walking a client through a home",
    objectPosition: "68% 18%",
  },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

export function Approach() {
  const [activeId, setActiveId] = useState<(typeof PRINCIPLES)[number]["id"]>(
    "listen",
  );
  const principle =
    PRINCIPLES.find((item) => item.id === activeId) ?? PRINCIPLES[0];
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="approach"
      id="approach"
      aria-labelledby="approach-heading"
    >
      <div className="approach__copy">
        <p className="label">What it feels like to work together</p>
        <h2 id="approach-heading">
          Guidance built around
          <br />
          the person behind the move.
        </h2>
        <p className="approach__lede">
          The question is not whether Sebastian can run a transaction. It is
          whether the work would feel clear, human, and paced to you.
        </p>
        <div
          className="approach__list"
          role="tablist"
          aria-label="Personal approach"
          aria-orientation="vertical"
        >
          {PRINCIPLES.map((item) => (
            <button
              key={item.id}
              className={`approach__principle${item.id === principle.id ? " is-active" : ""}`}
              type="button"
              role="tab"
              id={`approach-tab-${item.id}`}
              aria-selected={item.id === principle.id}
              aria-controls="approach-panel"
              aria-label={`${item.number} ${item.title}`}
              tabIndex={item.id === principle.id ? 0 : -1}
              onClick={() => setActiveId(item.id)}
              onKeyDown={(event) =>
                moveTablist(
                  event,
                  PRINCIPLES,
                  principle.id,
                  (id) =>
                    setActiveId(id as (typeof PRINCIPLES)[number]["id"]),
                  (id) => `approach-tab-${id}`,
                )
              }
            >
              <span>{item.number}</span>
              <span>
                <strong>{item.title}</strong>
                {item.id === principle.id ? <em>{item.copy}</em> : null}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div
        className="approach__media"
        id="approach-panel"
        role="tabpanel"
        aria-labelledby={`approach-tab-${principle.id}`}
      >
        <motion.div
          key={principle.id}
          style={{ width: "100%", height: "100%" }}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <EditorialImage
            name={principle.image}
            alt={principle.alt}
            objectPosition={principle.objectPosition}
            sizes="(max-width: 900px) 100vw, 54vw"
          />
        </motion.div>
      </div>
    </section>
  );
}
