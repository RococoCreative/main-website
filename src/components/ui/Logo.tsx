import Image from "next/image";

import logoDark from "../../../public/brand/rococo-horizontal.png";
import logoLight from "../../../public/brand/rococo-horizontal-light.png";

type LogoProps = {
  /** "dark" (ink wordmark) for light grounds, "light" (cream wordmark) for dark grounds. */
  variant?: "dark" | "light";
  /** Intrinsic render height in px; width follows the artwork's aspect ratio. */
  height?: number;
  /** Load immediately (above the fold). Next 16 deprecates `priority` in favour of loading="eager". */
  eager?: boolean;
  /** Accessible name. Pass "" when an adjacent link already names the destination. */
  alt?: string;
  className?: string;
};

/**
 * Rococo horizontal lockup (Rococo_Horizontal@2x.png). Never stretched,
 * recolored, or cropped; the artwork already includes its clear space.
 */
export function Logo({ variant = "dark", height = 40, eager = false, alt = "Rococo Creative", className }: LogoProps) {
  const src = variant === "light" ? logoLight : logoDark;
  const width = Math.round((src.width / src.height) * height);
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={eager ? "eager" : "lazy"}
      className={className}
      sizes={`${width}px`}
    />
  );
}
