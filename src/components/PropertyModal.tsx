import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { propertyDisclosure, propertyImageUrl } from "../data/properties";
import type { Property } from "../data/properties";
import { motion, useReducedMotion } from "framer-motion";
import "./PropertyModal.css";
import { trapDialogFocus } from "./dialogFocus";

type PropertyModalProps = {
  property: Property;
  onClose: () => void;
  onScheduleShowing: () => void;
};

const EASE = [0.22, 1, 0.36, 1] as const;

export function PropertyModal({
  property,
  onClose,
  onScheduleShowing,
}: PropertyModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const pointerStartedOnBackdrop = useRef(false);
  const [viewIndex, setViewIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const view = property.gallery[viewIndex] ?? property.gallery[0];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const trigger =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    closeRef.current?.focus({ preventScroll: true });

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="property-modal"
      aria-labelledby="property-modal-title"
      aria-describedby="property-modal-description property-modal-disclosure"
      onKeyDown={trapDialogFocus}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onPointerDown={(event) => {
        pointerStartedOnBackdrop.current = event.target === event.currentTarget;
      }}
      onClick={(event) => {
        if (
          event.target === event.currentTarget &&
          pointerStartedOnBackdrop.current
        )
          onClose();
        pointerStartedOnBackdrop.current = false;
      }}
    >
      <div className="property-modal__content">
        <button
          className="property-modal__close"
          type="button"
          onClick={onClose}
          aria-label="Close property details"
          ref={closeRef}
        >
          <X size={22} strokeWidth={1.15} aria-hidden="true" />
        </button>
        <div className="property-modal__gallery">
          <motion.img
            key={`${property.id}-${viewIndex}`}
            className="property-modal__image"
            src={propertyImageUrl(property, 1200)}
            srcSet={`${propertyImageUrl(property, 640)} 640w, ${propertyImageUrl(property, 1200)} 1200w`}
            sizes="(max-width: 900px) 100vw, 58vw"
            alt={view?.alt ?? property.imageAlt}
            style={{ objectPosition: view?.imagePosition ?? property.imagePosition }}
            width="1200"
            height="800"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, ease: EASE }}
          />
          <div
            className="property-modal__thumbs"
            role="tablist"
            aria-label={`${property.name} views`}
          >
            {property.gallery.map((item, index) => (
              <button
                key={item.caption}
                className={`property-modal__thumb${index === viewIndex ? " is-active" : ""}`}
                type="button"
                role="tab"
                aria-selected={index === viewIndex}
                onClick={() => setViewIndex(index)}
              >
                <img
                  src={propertyImageUrl(property, 640)}
                  alt=""
                  style={{ objectPosition: item.imagePosition }}
                  width="160"
                  height="100"
                />
                <span>{item.caption}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="property-modal__details">
          <p className="label">{property.location}</p>
          <div className="property-modal__title-row">
            <h2 id="property-modal-title">{property.name}</h2>
            <p className="property-modal__price">{property.price}</p>
          </div>
          <dl className="property-modal__specs">
            <div>
              <dt>Bedrooms</dt>
              <dd>{property.beds}</dd>
            </div>
            <div>
              <dt>Bathrooms</dt>
              <dd>{property.baths}</dd>
            </div>
            <div>
              <dt>Square feet</dt>
              <dd>{property.squareFeet}</dd>
            </div>
          </dl>
          <p
            className="property-modal__description"
            id="property-modal-description"
          >
            {property.detail}
          </p>
          <p className="label">Selected highlights</p>
          <ul className="property-modal__highlights">
            {property.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <button
            className="btn property-modal__schedule"
            type="button"
            onClick={onScheduleShowing}
          >
            Looking for something like this?
          </button>
          <p
            className="property-modal__disclosure"
            id="property-modal-disclosure"
          >
            {propertyDisclosure}
          </p>
        </div>
      </div>
    </dialog>
  );
}
