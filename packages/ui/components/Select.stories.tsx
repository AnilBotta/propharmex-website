import type { Meta, StoryObj } from "@storybook/react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "./Select";

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Select>;

export const TargetMarket: Story = {
  render: () => (
    <div className="w-[320px]">
      <Select>
        <SelectTrigger aria-label="Target market">
          <SelectValue placeholder="Select a target market" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Regulated markets</SelectLabel>
            <SelectItem value="ca">Health Canada</SelectItem>
            <SelectItem value="us">US FDA</SelectItem>
            <SelectItem value="eu">EMA</SelectItem>
            <SelectItem value="au">TGA</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Procurement</SelectLabel>
            <SelectItem value="who">WHO prequalification</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
};
