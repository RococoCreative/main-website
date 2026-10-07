import type { ReactNode } from "react";

import { isTodo } from "@/lib/format";

import styles from "./Todo.module.css";

/**
 * Visible markers for case study facts Rococo Creative has not supplied yet.
 * A placeholder value (anything beginning with "TODO") never renders as if it
 * were a real name, number, or sentence: it becomes a dashed mono TODO chip
 * followed by the note that explains what is needed.
 */

type TodoSize = "sm" | "md" | "lead";

/** "TODO: Client name" becomes "Client name". */
export function stripTodo(value: string): string {
  return value.replace(/^\s*TODO\b\s*[:.,-]?\s*/i, "").trim();
}

/** True when a value is missing or still a TODO placeholder. */
export function needsContent(value: string | null | undefined): boolean {
  return value == null || value.trim() === "" || isTodo(value);
}

/** The dashed chip on its own, e.g. in place of a metric numeral. */
export function TodoChip({ size = "md", className }: { size?: TodoSize | "numeral"; className?: string }) {
  return <span className={[styles.chip, styles[`chip-${size}`], className].filter(Boolean).join(" ")}>TODO</span>;
}

type TodoNoteProps = {
  /** What Rococo Creative needs to supply. */
  note?: string | null;
  size?: TodoSize;
  className?: string;
};

/** Chip plus note, inline. */
export function TodoNote({ note, size = "md", className }: TodoNoteProps) {
  return (
    <span className={[styles.todo, styles[size], className].filter(Boolean).join(" ")}>
      <TodoChip size={size} />
      {note ? <span className={styles.note}>{note}</span> : null}
    </span>
  );
}

type TodoTextProps = {
  value: string | null | undefined;
  /** Note shown when the value is missing, or when the TODO carries no note of its own. */
  fallbackNote: string;
  size?: TodoSize;
  /** Custom rendering for a real value. Defaults to the value itself. */
  children?: ReactNode;
};

/** Renders a real value as-is, or a TODO marker when it is missing or a placeholder. */
export function TodoText({ value, fallbackNote, size, children }: TodoTextProps) {
  if (needsContent(value)) {
    const note = value ? stripTodo(value) : "";
    return <TodoNote note={note || fallbackNote} size={size} />;
  }
  return <>{children ?? value}</>;
}

type TodoAwareTextProps = {
  value: string;
  /** True when something next to this text already shows a TODO chip (e.g. the metric value). */
  alreadyMarked?: boolean;
};

/**
 * Supporting text that may itself be a placeholder, such as a metric note.
 * The "TODO:" prefix is replaced by a chip, or dropped when a neighbouring
 * chip already marks the item, so a pending figure never shows two chips.
 */
export function TodoAwareText({ value, alreadyMarked = false }: TodoAwareTextProps) {
  if (!isTodo(value)) return <>{value}</>;
  const text = stripTodo(value);
  if (alreadyMarked) return <>{text}</>;
  return (
    <>
      <TodoChip size="sm" /> {text}
    </>
  );
}
