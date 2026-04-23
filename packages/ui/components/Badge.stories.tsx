import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  parameters: { layout: "centered" },
  argTypes: {
    variant: {
      control: "select",
      options: ["neutral", "primary", "accent", "success", "warn", "danger", "outline"],
    },
  },
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const Neutral: Story = { args: { children: "Phase 1", variant: "neutral" } };
export const Primary: Story = { args: { children: "DEL holder", variant: "primary" } };
export const Accent: Story = { args: { children: "WHO-GMP", variant: "accent" } };
export const Success: Story = { args: { children: "Inspection-ready", variant: "success" } };
export const Warn: Story = { args: { children: "Revision pending", variant: "warn" } };
export const Danger: Story = { args: { children: "Deficiency raised", variant: "danger" } };

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>Phase 1</Badge>
      <Badge variant="primary">DEL holder</Badge>
      <Badge variant="accent">WHO-GMP</Badge>
      <Badge variant="success">Inspection-ready</Badge>
      <Badge variant="warn">Revision pending</Badge>
      <Badge variant="danger">Deficiency raised</Badge>
      <Badge variant="outline">ICH Q2(R2)</Badge>
    </div>
  ),
};
