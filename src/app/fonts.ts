import { Cormorant_Garamond, Fragment_Mono, Instrument_Sans, Inter } from "next/font/google";

/**
 * Self-hosted at build time by next/font (no runtime requests to Google).
 * These are the brand system's documented fallbacks for the licensed faces:
 *   Goldenbook -> Cormorant Garamond (display serif, Light 300)
 *   Halcom     -> Instrument Sans   (headings, UI, CTAs)
 * Inter (body) and Fragment Mono (eyebrows) are the canonical faces.
 * The CSS variables are consumed by the font stacks in src/styles/tokens.css.
 */

export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const fragmentMono = Fragment_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-fragment",
  display: "swap",
});

export const fontVariables = [cormorant.variable, instrumentSans.variable, inter.variable, fragmentMono.variable].join(" ");
