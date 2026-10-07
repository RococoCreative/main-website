import { LeadFlowDemo } from "@/components/story/LeadFlowDemo";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";

/** Speed to lead on a forest canvas, with the interactive (illustrative) lead flow. */
export function HomeSpeedToLead() {
  return (
    <Section theme="forest" aria-labelledby="speed-title">
      <SectionHeader
        eyebrow="Speed to lead"
        title="Every inquiry answered in minutes, not days."
        titleId="speed-title"
        intro={
          <p>
            Owners rarely wait on a slow reply. AI-assisted first response, routing, and follow-up give every inquiry a
            fast, considered answer, and bring your team in when a conversation is worth their time. Step through an
            illustrative inquiry below.
          </p>
        }
      />
      <LeadFlowDemo />
    </Section>
  );
}
