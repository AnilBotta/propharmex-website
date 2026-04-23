import type { RegulatoryChipsSection } from "../../content/home";

type Props = { content: RegulatoryChipsSection };

export function RegulatoryChips({ content }: Props) {
  return (
    <section
      aria-label="Regulatory statements"
      className="bg-[var(--color-bg)] pb-10"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ul className="flex flex-col gap-2 border-t border-[var(--color-border)] pt-6 text-xs leading-relaxed text-[var(--color-muted)] sm:flex-row sm:flex-wrap sm:gap-x-6">
          <li>{content.registeredOffice}</li>
          <li>{content.delIdentifier}</li>
          <li className="sm:basis-full">{content.disclaimer}</li>
        </ul>
      </div>
    </section>
  );
}
