import { publicUrl } from "../lib/publicUrl";

type Props = {
  name: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  objectPosition?: string;
};

export function EditorialImage({
  name,
  alt,
  className = "",
  sizes = "(max-width: 700px) 100vw, 60vw",
  priority = false,
  objectPosition = "50% 30%",
}: Props) {
  const base = publicUrl(`images/sebastian/${name}`);
  const isHeroPng = name === "hero";

  return (
    <img
      className={className}
      src={isHeroPng ? `${base}.png` : `${base}-1200.webp`}
      srcSet={
        isHeroPng
          ? undefined
          : `${base}-640.webp 640w, ${base}-1200.webp 1200w, ${base}-1800.webp 1800w`
      }
      sizes={sizes}
      alt={alt}
      style={{ objectPosition }}
      width={1536}
      height={1024}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
    />
  );
}
