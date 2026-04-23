import type { Meta, StoryObj } from "@storybook/react";
import { Stat } from "./Stat";

const meta: Meta<typeof Stat> = {
  title: "Components/Stat",
  component: Stat,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Stat>;

export const Single: Story = {
  args: {
    label: "DEL applications filed",
    value: "11",
    suffix: "weeks to decision",
    footnote: "Engagement-specific; not a Health Canada timeline guarantee.",
  },
};

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-8 max-w-3xl">
      <Stat label="Facility sites" value="2" suffix="CA + IN" />
      <Stat label="Method RSD" value="< 2%" footnote="Across 3-site transfer" />
      <Stat label="ICH stability zones" value="II / IVa / IVb" />
    </div>
  ),
};
