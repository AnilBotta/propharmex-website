import type { Meta, StoryObj } from "@storybook/react";
import { Callout } from "./Callout";

const meta: Meta<typeof Callout> = {
  title: "Components/Callout",
  component: Callout,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Callout>;

export const Info: Story = {
  args: {
    title: "Health Canada DEL application timelines",
    children:
      "Review timelines depend on application completeness and current Health Canada capacity.",
  },
};

export const Regulatory: Story = {
  args: {
    tone: "regulatory",
    title: "Regulatory disclaimer",
    children:
      "Any timeline referenced is specific to the engagement and does not constitute a guarantee of review outcomes for other sponsors.",
  },
};

export const Warn: Story = {
  args: {
    tone: "warn",
    title: "Data integrity notice",
    children:
      "ALCOA+ principles apply to every GxP entry. See our audit-readiness documentation for details.",
  },
};

export const Danger: Story = {
  args: {
    tone: "danger",
    title: "Site access revoked",
    children: "Contact your account lead if you believe this is in error.",
  },
};
