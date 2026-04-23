import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = { args: { placeholder: "Work email" } };
export const WithValue: Story = { args: { defaultValue: "cmc@example.com" } };
export const Invalid: Story = {
  args: { defaultValue: "not-an-email", invalid: true, "aria-describedby": "err" },
};
export const Disabled: Story = {
  args: { placeholder: "Not editable", disabled: true },
};

export const Labelled: Story = {
  render: () => (
    <label className="flex w-[360px] flex-col gap-1.5">
      <span className="text-sm font-medium">Work email</span>
      <Input type="email" placeholder="you@sponsor.com" />
    </label>
  ),
};
