import type { ReactNode, SVGProps } from "react";

/**
 * Line glyphs for the lead-flow demo, drawn on the same 24px grid and 1.5px
 * stroke as src/components/ui/icons.tsx. Always decorative: the adjacent text
 * carries the meaning.
 */
function Glyph({ children, ...props }: SVGProps<SVGSVGElement> & { children: ReactNode }) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export function CheckGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <Glyph {...props}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </Glyph>
  );
}

export function CrossGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <Glyph {...props}>
      <path d="M7 7l10 10" />
      <path d="M17 7L7 17" />
    </Glyph>
  );
}

export function ClockGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </Glyph>
  );
}

export function PlayGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <Glyph {...props}>
      <path d="M8 5.5v13l10.5-6.5L8 5.5z" fill="currentColor" />
    </Glyph>
  );
}

export function SkipGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <Glyph {...props}>
      <path d="M6 6.5v11l8-5.5-8-5.5z" fill="currentColor" />
      <path d="M18 6.5v11" />
    </Glyph>
  );
}

export function ReplayGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <Glyph {...props}>
      <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" />
      <path d="M4.5 4.5v4h4" />
    </Glyph>
  );
}

export function OutcomeLostGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 9l6 6" />
      <path d="M15 9l-6 6" />
    </Glyph>
  );
}

export function OutcomeWonGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l2.75 2.75L16 10" />
    </Glyph>
  );
}
