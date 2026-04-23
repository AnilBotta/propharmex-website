import type { Meta, StoryObj } from "@storybook/react";
import { Marquee } from "./Marquee";

const meta: Meta<typeof Marquee> = {
  title: "Components/Marquee",
  component: Marquee,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Marquee>;

const CertBadge = ({ label }: { label: string }) => (
  <div className="inline-flex h-10 items-center rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm font-medium text-[var(--color-slate-700)]">
    {label}
  </div>
);

export const Certifications: Story = {
  render: () => (
    <div className="py-8 bg-[var(--color-bg)]">
      <Marquee durationSec={30}>
        <CertBadge label="Health Canada DEL" />
        <CertBadge label="ISO 9001" />
        <CertBadge label="WHO-GMP" />
        <CertBadge label="USFDA inspected" />
        <CertBadge label="TGA inspected" />
      </Marquee>
    </div>
  ),
};
