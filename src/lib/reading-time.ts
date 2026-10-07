const WORDS_PER_MINUTE = 225;

export function minutesFromWords(words: number): number {
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export function estimateReadingMinutes(markdown: string): number {
  return minutesFromWords(markdown.split(/\s+/).filter(Boolean).length);
}
