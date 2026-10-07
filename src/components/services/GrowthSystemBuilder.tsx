"use client";

import { useId, useState } from "react";

import { Button, ButtonLink } from "@/components/ui/Button";
import { Check, Plus } from "@/components/ui/icons";
import { pillars } from "@/content/services";

import styles from "./GrowthSystemBuilder.module.css";
import { SystemSchematic } from "./SystemSchematic";
import {
  TOTAL_OFFERINGS,
  contactHref,
  entriesFor,
  inCanonicalOrder,
  planFor,
  presets,
  sameSelection,
  startPhase,
} from "./system";

/**
 * "Build your growth system." Visitors choose offerings (real checkboxes in
 * fieldsets) or apply a goal preset; a schematic shows the system assembling
 * and a summary explains what it does and where the work would start.
 *
 * - Server HTML (and no-JS): every checkbox is visible, the summary shows its
 *   empty state, and the CTA links to /contact.
 * - The selection count is announced politely; the schematic is decorative
 *   because the form and summary carry the same information as text.
 * - React <Activity> keeps the selection when the visitor navigates away and
 *   back. That is intentional: it is work the visitor did on purpose.
 */
export function GrowthSystemBuilder({ className }: { className?: string }) {
  const uid = useId();
  const [selected, setSelected] = useState<string[]>([]);

  const entries = entriesFor(selected);
  const count = entries.length;
  const activePreset = presets.find((p) => sameSelection(p.offeringIds, selected)) ?? null;
  const plan = planFor(selected);

  function toggle(id: string, checked: boolean) {
    setSelected((prev) => inCanonicalOrder(checked ? [...prev, id] : prev.filter((x) => x !== id)));
  }

  function applyPreset(ids: string[]) {
    setSelected((prev) => (sameSelection(prev, ids) ? [] : inCanonicalOrder(ids)));
  }

  function clear() {
    if (count > 0) setSelected([]);
  }

  const status =
    count === 0
      ? `0 of ${TOTAL_OFFERINGS} services selected.`
      : `${count} of ${TOTAL_OFFERINGS} services selected${activePreset ? `: ${activePreset.label}` : ""}.`;

  return (
    <div className={[styles.builder, className].filter(Boolean).join(" ")}>
      <div className={styles.workspace}>
        {/* Controls ---------------------------------------------------- */}
        <div className={styles.controls}>
          <div className={styles.presets} role="group" aria-labelledby={`${uid}-presets`}>
            <p id={`${uid}-presets`} className={styles.kicker}>
              Start from a goal
            </p>
            <div className={styles.presetRow}>
              {presets.map((preset) => {
                const pressed = activePreset?.id === preset.id;
                return (
                  <Button
                    key={preset.id}
                    variant="secondary"
                    className={styles.preset}
                    aria-pressed={pressed}
                    onClick={() => applyPreset(preset.offeringIds)}
                  >
                    <span className={styles.presetInner}>
                      {pressed ? (
                        <Check className={styles.presetIcon} />
                      ) : (
                        <Plus className={styles.presetIcon} />
                      )}
                      {preset.label}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>

          <div className={styles.statusBar}>
            <p className={styles.status} role="status" aria-live="polite" aria-atomic="true">
              {status}
            </p>
            <Button
              variant="ghost"
              aria-disabled={count === 0 ? true : undefined}
              onClick={clear}
            >
              Clear selection
            </Button>
          </div>

          <p className={styles.kicker}>Or choose services</p>
          <div className={styles.groups}>
            {pillars.map((pillar) => (
              <fieldset key={pillar.id} className={styles.group}>
                <legend className={styles.legend}>
                  <span className={styles.legendIndex}>{pillar.index}</span>
                  <span>{pillar.name}</span>
                </legend>
                <ul className={styles.options}>
                  {pillar.offerings.map((offering, i) => {
                    const inputId = `${uid}-${offering.id}`;
                    const checked = selected.includes(offering.id);
                    return (
                      <li key={offering.id}>
                        <label htmlFor={inputId} className={styles.option} data-checked={checked ? "true" : "false"}>
                          <input
                            id={inputId}
                            type="checkbox"
                            name="services"
                            value={offering.id}
                            checked={checked}
                            onChange={(event) => toggle(offering.id, event.currentTarget.checked)}
                            className={styles.checkbox}
                          />
                          <span className={styles.optionName}>{offering.name}</span>
                          <span className={styles.optionCode} aria-hidden="true">
                            {pillar.index}.{i + 1}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </fieldset>
            ))}
          </div>
        </div>

        {/* Schematic --------------------------------------------------- */}
        <div className={styles.stage}>
          <SystemSchematic selected={selected} />
        </div>
      </div>

      {/* Summary ------------------------------------------------------- */}
      <div className={styles.summary} data-theme="forest">
        <div className={styles.does}>
          <h3 className={styles.summaryTitle}>What this system does</h3>
          {count === 0 ? (
            <p className={styles.empty}>
              Choose services, or start from a goal, to see what the system would do for your business.
            </p>
          ) : (
            <ul className={styles.outcomes}>
              {entries.map((entry) => (
                <li key={entry.id} className={styles.outcome}>
                  <span className={styles.outcomeName}>
                    <span className={styles.outcomeCode}>{entry.code}</span>
                    {entry.name}
                  </span>
                  <span className={styles.outcomeText}>{entry.outcome}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.start}>
          <h3 className={styles.summaryTitle}>Where we would start</h3>
          <p className={styles.startPhase}>
            <span className={styles.startIndex}>{startPhase.index}</span>
            <span>
              {startPhase.stage}: {startPhase.name}
            </span>
          </p>
          <p className={styles.reason}>
            {plan
              ? plan.reason
              : "Every engagement begins here, with an audit of how work comes in today. Choose services to see the full sequence."}
          </p>
          <dl className={styles.facts}>
            <div>
              <dt>Typical duration</dt>
              <dd>{startPhase.duration}</dd>
            </div>
            <div>
              <dt>You receive</dt>
              <dd>{startPhase.deliverable}</dd>
            </div>
          </dl>

          {plan && plan.steps.length > 0 ? (
            <div className={styles.then}>
              <p className={styles.kicker} id={`${uid}-then`}>
                Then
              </p>
              <ol className={styles.steps} aria-labelledby={`${uid}-then`}>
                {plan.steps.map((step) => (
                  <li key={step.phase.index} className={styles.step}>
                    <span className={styles.stepIndex}>{step.phase.index}</span>
                    <span>
                      <span className={styles.stepStage}>{step.phase.stage}:</span> {step.names.join(", ")}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          <div className={styles.cta}>
            <ButtonLink href={contactHref(selected)} variant="primary" size="lg" arrow>
              Discuss this system
            </ButtonLink>
            <p className={styles.ctaNote}>
              {count > 0
                ? "Your selections carry over to the contact form."
                : "Or tell us what you are building in your own words."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
