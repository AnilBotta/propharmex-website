import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "./Textarea";

const meta: Meta<typeof Textarea> = {
  title: "Components/Textarea",
  component: Textarea,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: { placeholder: "Tell us about your CMC scope…", rows: 5 },
};
export const Invalid: Story = {
  args: { defaultValue: "A", invalid: true, rows: 4 },
};
export const Disabled: Story = {
  args: { disabled: true, defaultValue: "Read-only" },
};
