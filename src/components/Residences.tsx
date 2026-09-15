import { useState } from "react";
import {
  properties,
  propertyDisclosure,
  propertyImageUrl,
} from "../data/properties";
import type { Property } from "../data/properties";
import type { ContactInquiry } from "./Contact";
import { PropertyModal } from "./PropertyModal";
import "./Residences.css";

type Props = {
  onInquire: (interest: ContactInquiry["interest"], message?: string) => void;
};

export function Residences({ onInquire }: Props) {
  const [selected, setSelected] = useState<Property | null>(null);

  function scheduleShowing(property: Property) {
    setSelected(null);
    window.requestAnimationFrame(() => {
      onInquire(
        "Buying",
        `I would like to learn more about the ${property.name}.`,
      );
    });
  }

  return (
    <section
      className="residences"
      id="residences"
      aria-labelledby="residences-heading"
    >
      <div className="residences__intro">
        <h2 id="residences-heading">Selected Residences</h2>
        <p>
          Open a residence to see how Sebastian would walk you through it:
          the photograph, the story, and whether a home like this belongs on
          your list.
        </p>
      </div>

      <div className="residences__list">
        {properties.map((property, index) => (
          <article
            key={property.id}
            className={`residence${index % 2 ? " residence--reverse" : ""}`}
            aria-labelledby={`residence-${property.id}`}
          >
            <button
              className="residence__image"
              type="button"
              onClick={() => setSelected(property)}
              aria-label={`View ${property.name}`}
              aria-haspopup="dialog"
            >
              <img
                src={propertyImageUrl(property, 1200)}
                srcSet={`${propertyImageUrl(property, 640)} 640w, ${propertyImageUrl(property, 1200)} 1200w`}
                sizes="(max-width: 900px) 100vw, 68vw"
                alt={property.imageAlt}
                style={{ objectPosition: property.imagePosition }}
                width="1200"
                height="800"
                loading="lazy"
                decoding="async"
              />
            </button>
            <div className="residence__meta">
              <p className="label">0{index + 1}</p>
              <h3 id={`residence-${property.id}`}>{property.name}</h3>
              <p className="residence__place">{property.location}</p>
              <p className="residence__price">{property.price}</p>
              <p className="residence__specs">
                {property.beds} Beds
                <span aria-hidden="true"> · </span>
                {property.baths} Baths
                <span aria-hidden="true"> · </span>
                {property.squareFeet} Sq. Ft.
              </p>
              <p className="residence__sentence">{property.description}</p>
              <button
                className="text-link"
                type="button"
                onClick={() => setSelected(property)}
              >
                View Residence →
              </button>
            </div>
          </article>
        ))}
      </div>

      <p className="residences__disclosure">{propertyDisclosure}</p>

      {selected ? (
        <PropertyModal
          property={selected}
          onClose={() => setSelected(null)}
          onScheduleShowing={() => scheduleShowing(selected)}
        />
      ) : null}
    </section>
  );
}
