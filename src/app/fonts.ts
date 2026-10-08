import { Fragment_Mono } from "next/font/google";

/**
 * Brand typefaces.
 *
 * Goldenbook (display serif) and Halcom (headings and body) are licensed
 * through Adobe Fonts and served from Adobe's CDN by this web project kit.
 * No font files for them live in this repository: it is public, and the
 * license does not allow redistribution. The stacks in src/styles/tokens.css
 * name the families.
 */
export const adobeFontsKit = "https://use.typekit.net/jhb8wfa.css";

/**
 * Fragment Mono (bracketed eyebrows) is open source and self-hosted at build
 * time by next/font, so it needs no runtime request to Google.
 */
export const fragmentMono = Fragment_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-fragment",
  display: "swap",
});

export const fontVariables = fragmentMono.variable;
