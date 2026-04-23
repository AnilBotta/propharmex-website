import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "./Skeleton";

const meta: Meta<typeof Skeleton> = {
  title: "Components/Skeleton",
  component: Skeleton,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Skeleton>;

export const SingleLine: Story = {
  render: () => <Skeleton className="h-4 w-64" />,
};

export const ArticleCard: Story = {
  render: () => (
    <div className="w-[360px] space-y-3">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  ),
};
