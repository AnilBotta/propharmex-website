import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumb } from "./Breadcrumb";

const meta: Meta<typeof Breadcrumb> = {
  title: "Components/Breadcrumb",
  component: Breadcrumb,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Breadcrumb>;

export const ServiceLeaf: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Services", href: "/services" },
      { label: "Regulatory Services", href: "/services/regulatory-services" },
      { label: "Health Canada DEL" },
    ],
  },
};

export const SingleLevel: Story = {
  args: {
    items: [{ label: "Home", href: "/" }, { label: "About" }],
  },
};
