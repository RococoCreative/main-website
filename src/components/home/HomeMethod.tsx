import { MethodScroller } from "@/components/story/MethodScroller";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { methodPhases } from "@/content/method";

/** How we work. Anchor target for the hero's "See how we work" link. */
export function HomeMethod() {
  return (
    <Section id="method" aria-labelledby="method-title">
      <SectionHeader
        eyebrow="How we work"
        title="Survey, foundation, frame, finish."
        titleId="method-title"
        intro={
          <p>
            Our method follows the sequence you already trust on a jobsite. Each phase ends with something you can
            review and approve before the next one begins.
          </p>
        }
      />
      <MethodScroller phases={methodPhases} />
    </Section>
  );
}
