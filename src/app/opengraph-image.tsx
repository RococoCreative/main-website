import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "Rococo Creative: strategy, design, and AI-driven marketing for construction companies";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    eyebrow: "Rococo Creative",
    title: "Marketing built the way you build: on a sound foundation.",
    subtitle: "Strategy, design, and AI-driven marketing for construction companies.",
  });
}
