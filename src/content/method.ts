/**
 * The Rococo method, told in the language of construction.
 * Used by the home page scroll story (MethodScroller) and the services
 * page process section. Each phase maps a build stage to a marketing stage.
 */

export type MethodPhase = {
  index: string;
  /** Construction stage (the metaphor). */
  stage: string;
  /** Marketing work in this phase. */
  name: string;
  summary: string;
  activities: string[];
  /** What the client holds at the end of the phase. */
  deliverable: string;
  /** Typical duration. TODO: confirm against real engagements. */
  duration: string;
};

export const methodPhases: MethodPhase[] = [
  {
    index: "01",
    stage: "Survey",
    name: "Audit",
    summary:
      "Before anything is designed, we measure. We review how work actually comes in today: your reputation, your website, your search presence, and what happens to an inquiry after it arrives.",
    activities: ["Stakeholder interviews", "Website and search review", "Lead-handling walkthrough", "Competitor scan"],
    deliverable: "Findings report with priorities",
    duration: "2 to 3 weeks",
  },
  {
    index: "02",
    stage: "Foundation",
    name: "Strategy",
    summary:
      "We set the footings: the project types you should pursue, the clients who value your work, and the message that separates you from every other bid on the table.",
    activities: ["Ideal project profile", "Positioning and messaging", "Channel plan and budget", "Targets tied to bids"],
    deliverable: "Strategy brief and growth plan",
    duration: "2 to 4 weeks",
  },
  {
    index: "03",
    stage: "Frame",
    name: "Build",
    summary:
      "With the plan approved, we build the structure: brand system, website, CRM pipeline, and tracking. Everything is connected, so every inquiry is captured and measured.",
    activities: ["Brand identity system", "Website design and build", "CRM and automation setup", "Analytics and call tracking"],
    deliverable: "Launched brand, website, and lead system",
    duration: "6 to 12 weeks",
  },
  {
    index: "04",
    stage: "Finish",
    name: "Grow",
    summary:
      "Then the detail work that compounds: search, advertising, AI-assisted follow-up, and content, refined month by month against a scorecard you can read in five minutes.",
    activities: ["Local SEO and paid search", "AI-assisted follow-up", "Project stories and content", "Monthly scorecard review"],
    deliverable: "Monthly scorecard and plan updates",
    duration: "Ongoing",
  },
];
