"use client";

import { useId, useMemo, useRef, useState, type ReactNode } from "react";

import { Check, Plus } from "@/components/ui/icons";

import styles from "./WorkFilter.module.css";

export type WorkFilterItem = {
  slug: string;
  /** Null when the sector is unknown or a placeholder; such items only match "all sectors". */
  sector: string | null;
  services: string[];
  /** Server-rendered card. */
  card: ReactNode;
};

type WorkFilterProps = {
  items: WorkFilterItem[];
  /** Heading for the list (it must carry id={headingId}); rendered in the toolbar beside the count. */
  heading: ReactNode;
  /** id of that heading. Labels the list and prefixes the list id. */
  headingId: string;
};

const collator = new Intl.Collator("en", { sensitivity: "base" });

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort(collator.compare);
}

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

/** Any selected sector AND any selected service. An empty selection does not filter. */
export function filterProjects<T extends Pick<WorkFilterItem, "sector" | "services">>(
  items: readonly T[],
  sectors: readonly string[],
  services: readonly string[],
): T[] {
  return items.filter(
    (item) =>
      (sectors.length === 0 || (item.sector !== null && sectors.includes(item.sector))) &&
      (services.length === 0 || item.services.some((s) => services.includes(s))),
  );
}

export function countLabel(shown: number, total: number): string {
  const noun = (n: number) => (n === 1 ? "project" : "projects");
  return shown === total ? `Showing ${total} ${noun(total)}` : `Showing ${shown} of ${total} ${noun(total)}`;
}

/**
 * Filters the project grid by sector and by service.
 * - Toggle buttons expose state with aria-pressed (and a check icon, so state never relies on color).
 * - Within a group, selections widen the result (any of); across groups they narrow it (all of).
 * - The result count is announced politely as it changes.
 * - Server-rendered with nothing selected, so every project is in the HTML without JavaScript.
 */
export function WorkFilter({ items, heading, headingId }: WorkFilterProps) {
  const sectors = useMemo(() => uniqueSorted(items.flatMap((i) => (i.sector ? [i.sector] : []))), [items]);
  const services = useMemo(() => uniqueSorted(items.flatMap((i) => i.services)), [items]);
  const [activeSectors, setActiveSectors] = useState<string[]>([]);
  const [activeServices, setActiveServices] = useState<string[]>([]);
  const [interacted, setInteracted] = useState(false);
  const resetRef = useRef<HTMLButtonElement>(null);
  const sectorLabelId = useId();
  const serviceLabelId = useId();
  const listId = `${headingId}-list`;

  const showSectors = sectors.length > 1;
  const showServices = services.length > 1;
  const hasControls = showSectors || showServices;
  const filtering = activeSectors.length > 0 || activeServices.length > 0;

  const visible = filterProjects(items, activeSectors, activeServices);

  const reset = (moveFocus = false) => {
    setActiveSectors([]);
    setActiveServices([]);
    if (moveFocus) resetRef.current?.focus();
  };

  const group = (
    label: string,
    labelId: string,
    options: string[],
    active: string[],
    setActive: (next: string[]) => void,
  ) => (
    <div className={styles.group} role="group" aria-labelledby={labelId}>
      <p id={labelId} className={styles.groupLabel}>
        {label}
      </p>
      <ul className={styles.options}>
        {options.map((option) => {
          const pressed = active.includes(option);
          return (
            <li key={option}>
              <button
                type="button"
                className={styles.option}
                aria-pressed={pressed}
                aria-controls={listId}
                onClick={() => {
                  setInteracted(true);
                  setActive(toggle(active, option));
                }}
              >
                {pressed ? <Check className={styles.optionIcon} /> : <Plus className={styles.optionIcon} />}
                <span>{option}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <div className={styles.root}>
      <div className={styles.toolbar}>
        <div className={styles.head}>
          <div className={styles.heading}>{heading}</div>
          {hasControls ? (
            <p className={styles.count} aria-live="polite" aria-atomic="true">
              {countLabel(visible.length, items.length)}
            </p>
          ) : null}
        </div>

        {hasControls ? (
          <div className={styles.filters} role="group" aria-label="Filter projects">
            {showSectors ? group("Sector", sectorLabelId, sectors, activeSectors, setActiveSectors) : null}
            {showServices ? group("Service", serviceLabelId, services, activeServices, setActiveServices) : null}
            <div className={styles.resetRow}>
              <button
                ref={resetRef}
                type="button"
                className={styles.reset}
                onClick={() => reset()}
                aria-disabled={!filtering}
              >
                Show all
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {visible.length > 0 ? (
        <ul id={listId} className={styles.grid} data-animate={interacted ? "true" : undefined} aria-labelledby={headingId}>
          {visible.map((item) => (
            <li key={item.slug} className={styles.item}>
              {item.card}
            </li>
          ))}
        </ul>
      ) : (
        <div id={listId} className={styles.none}>
          <p className={styles.noneTitle}>No projects match these filters.</p>
          <p className={styles.noneBody}>Try fewer filters, or show the full index.</p>
          <button type="button" className={styles.reset} onClick={() => reset(true)}>
            Show all projects
          </button>
        </div>
      )}
    </div>
  );
}
