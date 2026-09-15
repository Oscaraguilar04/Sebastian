import { useState } from "react";
import { sellingStages } from "../data/journeys";
import { moveTablist } from "../lib/tablist";
import type { ContactInquiry } from "./Contact";
import { StageMedia } from "./StageMedia";
import "./Journey.css";

type Props = {
  onInquire: (interest: ContactInquiry["interest"], message?: string) => void;
};

export function Selling({ onInquire }: Props) {
  const [activeId, setActiveId] = useState(sellingStages[0].id);
  const stageIndex = sellingStages.findIndex((item) => item.id === activeId);
  const stage = sellingStages[stageIndex] ?? sellingStages[0];
  const nextStage = sellingStages[stageIndex + 1];

  return (
    <section
      className="journey journey--sell"
      id="selling"
      aria-labelledby="selling-heading"
    >
      <div className="journey__index">
        <p className="label">A strategy, not a listing appointment</p>
        <h2 id="selling-heading">Selling</h2>
        <p className="journey__lede">
          Selling well is a sequence. Each step exists so the home is
          understood, prepared, and presented before it is asked to compete.
        </p>
        <div
          className="journey__stages"
          role="tablist"
          aria-label="Seller strategy"
          aria-orientation="vertical"
        >
          {sellingStages.map((item) => (
            <button
              key={item.id}
              className={`journey__stage${item.id === stage.id ? " is-active" : ""}`}
              type="button"
              role="tab"
              id={`selling-tab-${item.id}`}
              aria-selected={item.id === stage.id}
              aria-controls={`selling-panel-${item.id}`}
              tabIndex={item.id === stage.id ? 0 : -1}
              onClick={() => setActiveId(item.id)}
              onKeyDown={(event) =>
                moveTablist(
                  event,
                  sellingStages,
                  stage.id,
                  setActiveId,
                  (id) => `selling-tab-${id}`,
                )
              }
            >
              <span>{item.number}</span>
              <span>{item.title}</span>
            </button>
          ))}
        </div>
        <a
          className="text-link"
          href="#contact"
          onClick={(event) => {
            event.preventDefault();
            onInquire("Selling", "");
          }}
        >
          Plan Your Sale →
        </a>
      </div>
      <div
        className="journey__panel"
        role="tabpanel"
        id={`selling-panel-${stage.id}`}
        aria-labelledby={`selling-tab-${stage.id}`}
      >
        <div className="journey__media">
          <StageMedia media={stage.media} />
        </div>
        <div className="journey__copy">
          <p className="journey__number" aria-hidden="true">
            {stage.number}
          </p>
          <h3>{stage.title}</h3>
          <p>{stage.support}</p>
          {nextStage ? (
            <button
              className="text-link journey__next"
              type="button"
              onClick={() => setActiveId(nextStage.id)}
            >
              Next: {nextStage.title} →
            </button>
          ) : (
            <a
              className="text-link journey__next"
              href="#contact"
              onClick={(event) => {
                event.preventDefault();
                onInquire("Selling", "");
              }}
            >
              Ready to plan the sale? →
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
