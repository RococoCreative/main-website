import type { ReactNode } from "react";

import type { CaseStudy } from "@/lib/types";

import styles from "./CaseStudyFacts.module.css";
import { TodoNote, TodoText } from "./Todo";

function hostname(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

/** Swiss facts table (dl): Client, Sector, Location, Services, Year, and Website when supplied. */
export function CaseStudyFacts({ study }: { study: CaseStudy }) {
  const services = study.services.filter(Boolean);
  const site = study.websiteUrl ? hostname(study.websiteUrl) : null;

  const facts: { label: string; value: ReactNode }[] = [
    { label: "Client", value: <TodoText value={study.clientName} fallbackNote="Client name" size="sm" /> },
    { label: "Sector", value: <TodoText value={study.sector} fallbackNote="Sector" size="sm" /> },
    { label: "Location", value: <TodoText value={study.location} fallbackNote="City, State" size="sm" /> },
    {
      label: "Services",
      value: services.length ? (
        <ul className={styles.list}>
          {services.map((service) => (
            <li key={service}>{service}</li>
          ))}
        </ul>
      ) : (
        <TodoNote note="Services delivered" size="sm" />
      ),
    },
    {
      label: "Year",
      value: study.year ? <span className={styles.numeral}>{study.year}</span> : <TodoNote note="Year completed" size="sm" />,
    },
  ];

  if (study.websiteUrl && site) {
    facts.push({
      label: "Website",
      value: (
        <a href={study.websiteUrl} className={styles.link} target="_blank" rel="noopener noreferrer">
          {site}
          <span className="visually-hidden"> (opens in a new tab)</span>
        </a>
      ),
    });
  }

  return (
    <dl className={styles.facts}>
      {facts.map((fact) => (
        <div key={fact.label} className={styles.fact}>
          <dt className={styles.label}>{fact.label}</dt>
          <dd className={styles.value}>{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}
