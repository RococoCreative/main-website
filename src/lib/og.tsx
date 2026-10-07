import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

/**
 * Shared Open Graph renderer (1200x630). Assets are read once at module scope,
 * as the Next.js docs recommend, so image routes stay statically optimizable.
 * Satori supports flexbox only and ttf/otf/woff fonts (not woff2).
 */

const root = process.cwd();
const [displayFont, sansFont, monoFont, logo, ornament] = await Promise.all([
  readFile(join(root, "src/assets/og/cormorant-garamond-300.woff")),
  readFile(join(root, "src/assets/og/instrument-sans-500.woff")),
  readFile(join(root, "src/assets/og/fragment-mono-400.woff")),
  readFile(join(root, "public/brand/rococo-horizontal.png"), "base64"),
  readFile(join(root, "public/brand/rococo-ornament.png"), "base64"),
]);

const logoSrc = `data:image/png;base64,${logo}`;
const ornamentSrc = `data:image/png;base64,${ornament}`;

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

// Brand tokens (mirrors src/styles/tokens.css; Satori cannot read CSS variables).
const PAPER = "#fdfdfd";
const SAND = "#e9e1d4";
const FOREST = "#39443c";
const GOLD = "#d6b563";
const INK = "#1f1f1f";
const MUTED = "#5a554f";
const HAIRLINE = "#e4dfd6";

type OgInput = {
  eyebrow: string;
  title: string;
  /** Optional supporting line (kept short). */
  subtitle?: string;
};

export function renderOgImage({ eyebrow, title, subtitle }: OgInput): ImageResponse {
  const titleSize = title.length > 70 ? 54 : title.length > 44 ? 64 : 76;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: PAPER,
          padding: "56px 72px",
          position: "relative",
          fontFamily: "Instrument Sans",
        }}
      >
        {/* Swiss column guides */}
        <div style={{ position: "absolute", inset: 0, display: "flex", padding: "0 72px", gap: 24 }}>
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              style={{ flex: 1, borderLeft: `1px solid ${HAIRLINE}`, borderRight: `1px solid ${HAIRLINE}`, opacity: 0.6 }}
            />
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 14, background: FOREST, display: "flex" }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
          {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
          <img src={logoSrc} width={264} height={64} style={{ objectFit: "contain" }} />
          <div style={{ display: "flex", fontFamily: "Fragment Mono", fontSize: 18, letterSpacing: 3, color: MUTED }}>
            ROCOCOCREATIVE.IO
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28, position: "relative", maxWidth: 900 }}>
          <div style={{ display: "flex", fontFamily: "Fragment Mono", fontSize: 22, letterSpacing: 4, color: MUTED }}>
            <span style={{ color: GOLD }}>[</span>
            <span style={{ margin: "0 14px" }}>{eyebrow.toUpperCase()}</span>
            <span style={{ color: GOLD }}>]</span>
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Cormorant Garamond",
              fontSize: titleSize,
              lineHeight: 1.08,
              letterSpacing: -1,
              color: FOREST,
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div style={{ display: "flex", fontSize: 26, lineHeight: 1.4, color: INK, maxWidth: 820 }}>{subtitle}</div>
          ) : null}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20, position: "relative", marginBottom: 14 }}>
          <div style={{ display: "flex", height: 1, width: 120, background: GOLD }} />
          {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
          <img src={ornamentSrc} width={36} height={40} />
          <div style={{ display: "flex", height: 1, width: 120, background: GOLD }} />
          <div style={{ display: "flex", marginLeft: 12, fontSize: 18, color: MUTED, background: SAND, padding: "6px 14px", borderRadius: 999 }}>
            Strategy · Design · AI-driven marketing
          </div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Cormorant Garamond", data: displayFont, style: "normal", weight: 300 },
        { name: "Instrument Sans", data: sansFont, style: "normal", weight: 500 },
        { name: "Fragment Mono", data: monoFont, style: "normal", weight: 400 },
      ],
    },
  );
}
