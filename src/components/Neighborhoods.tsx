import { useState } from "react";
import {
  neighborhoodDisclosure,
  neighborhoods,
} from "../data/neighborhoods";
import { moveTablist } from "../lib/tablist";
import { StageMedia } from "./StageMedia";
import "./Neighborhoods.css";

export function Neighborhoods() {
  const [activeId, setActiveId] = useState(neighborhoods[0].id);
  const place =
    neighborhoods.find((item) => item.id === activeId) ?? neighborhoods[0];

  return (
    <section
      className="neighborhoods"
      id="bakersfield"
      aria-labelledby="bakersfield-heading"
    >
      <div className="neighborhoods__index">
        <p className="label">Local expertise</p>
        <h2 id="bakersfield-heading">
          Find your side
          <br />
          of Bakersfield.
        </h2>
        <p className="neighborhoods__lede">
          The useful question is not “which neighborhood is best.” It is which
          side of town matches the way you already live. Choose a place to see
          how Sebastian would open that conversation.
        </p>
        <div
          className="neighborhoods__list"
          role="tablist"
          aria-label="Bakersfield areas"
          aria-orientation="vertical"
        >
          {neighborhoods.map((item) => (
            <button
              key={item.id}
              className={`neighborhoods__place${item.id === place.id ? " is-active" : ""}`}
              type="button"
              role="tab"
              id={`bakersfield-tab-${item.id}`}
              aria-selected={item.id === place.id}
              aria-controls="bakersfield-panel"
              tabIndex={item.id === place.id ? 0 : -1}
              onClick={() => setActiveId(item.id)}
              onKeyDown={(event) =>
                moveTablist(
                  event,
                  neighborhoods,
                  place.id,
                  setActiveId,
                  (id) => `bakersfield-tab-${id}`,
                )
              }
            >
              {item.name}
            </button>
          ))}
        </div>
        <p className="neighborhoods__disclosure">{neighborhoodDisclosure}</p>
      </div>
      <div
        className="neighborhoods__panel"
        id="bakersfield-panel"
        role="tabpanel"
        aria-labelledby={`bakersfield-tab-${place.id}`}
      >
        <div className="neighborhoods__media">
          <StageMedia media={place.media} />
        </div>
        <div className="neighborhoods__copy">
          <p className="label">{place.name}</p>
          <h3>{place.question}</h3>
          <p>{place.copy}</p>
          <p>{place.discuss}</p>
        </div>
      </div>
    </section>
  );
}
