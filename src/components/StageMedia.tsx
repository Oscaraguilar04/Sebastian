import { motion, useReducedMotion } from "framer-motion";
import { EditorialImage } from "./EditorialImage";
import { propertyImageUrl } from "../data/properties";
import type { JourneyStage } from "../data/journeys";

const EASE = [0.22, 1, 0.36, 1] as const;

export function StageMedia({
  media,
  className = "",
}: {
  media: JourneyStage["media"];
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      style={{ width: "100%", height: "100%" }}
      key={`${media.kind}-${media.name}-${media.objectPosition}`}
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {media.kind === "sebastian" ? (
        <EditorialImage
          name={media.name}
          alt={media.alt}
          objectPosition={media.objectPosition}
          sizes="(max-width: 900px) 100vw, 56vw"
        />
      ) : (
        <img
          src={propertyImageUrl(media.name, 1200)}
          srcSet={`${propertyImageUrl(media.name, 640)} 640w, ${propertyImageUrl(media.name, 1200)} 1200w`}
          sizes="(max-width: 900px) 100vw, 56vw"
          alt={media.alt}
          style={{ objectPosition: media.objectPosition }}
          width="1200"
          height="800"
          loading="lazy"
          decoding="async"
        />
      )}
    </motion.div>
  );
}
