import { useState } from "react";
import { buyingStages } from "../data/journeys";
import { moveTablist } from "../lib/tablist";
import type { ContactInquiry } from "./Contact";
import { StageMedia } from "./StageMedia";
import "./Journey.css";

type Props = {
  onInquire: (interest: ContactInquiry["interest"], message?: string) => void;
};

export function Buying({ onInquire }: Props) {
  const [activeId, setActiveId] = useState(buyingStages[0].id);
  const stageIndex = buyingStages.findIndex((item) => item.id === activeId);
  const stage = buyingStages[stageIndex] ?? buyingStages[0];
  const nextStage = buyingStages[stageIndex + 1];

  return (
    <section
      className="journey journey--buy"
      id="buying"
      aria-labelledby="buying-heading"
    >
      <div className="journey__index">
        <p className="label">How the search becomes a home</p>
        <h2 id="buying-heading">Buying</h2>
        <p className="journey__lede">
          A buyer does not need more listings. They need a clear way through
          the decision. Move through the moments Sebastian stays with you.
        </p>
        <div
          className="journey__stages"
          role="tablist"
          aria-label="Buyer journey"
          aria-orientation="vertical"
        >
          {buyingStages.map((item) => (
            <button
              key={item.id}
              className={`journey__stage${item.id === stage.id ? " is-active" : ""}`}
              type="button"
              role="tab"
              id={`buying-tab-${item.id}`}
              aria-selected={item.id === stage.id}
              aria-controls={`buying-panel-${item.id}`}
              tabIndex={item.id === stage.id ? 0 : -1}
              onClick={() => setActiveId(item.id)}
              onKeyDown={(event) =>
                moveTablist(
                  event,
                  buyingStages,
                  stage.id,
                  setActiveId,
                  (id) => `buying-tab-${id}`,
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
            onInquire("Buying", "");
          }}
        >
          Explore Buying →
        </a>
      </div>
      <div
        className="journey__panel"
        role="tabpanel"
        id={`buying-panel-${stage.id}`}
        aria-labelledby={`buying-tab-${stage.id}`}
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
                onInquire("Buying", "");
              }}
            >
              Ready to start the search? →
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
