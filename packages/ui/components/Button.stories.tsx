import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  parameters: { layout: "centered" },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost", "outline", "danger", "link"],
    },
    size: { control: "select", options: ["sm", "md", "lg", "icon"] },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { children: "Request a scoping call", variant: "primary", size: "md" },
};

export const Secondary: Story = {
  args: { children: "Download whitepaper", variant: "secondary" },
};

export const Outline: Story = {
  args: { children: "View case studies", variant: "outline" },
};

export const Ghost: Story = { args: { children: "Read more", variant: "ghost" } };

export const Danger: Story = {
  args: { children: "Revoke access", variant: "danger" },
};

export const Link: Story = {
  args: { children: "Health Canada DEL guidance", variant: "link" },
};

export const Disabled: Story = {
  args: { children: "Unavailable", disabled: true },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};
