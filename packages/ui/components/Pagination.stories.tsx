import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Pagination } from "./Pagination";

const meta: Meta<typeof Pagination> = {
  title: "Components/Pagination",
  component: Pagination,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Pagination>;

function PaginationDemo({ initial, total }: { initial: number; total: number }) {
  const [page, setPage] = React.useState(initial);
  return <Pagination currentPage={page} totalPages={total} onPageChange={setPage} />;
}

export const Basic: Story = {
  render: () => <PaginationDemo initial={1} total={8} />,
};

export const WithEllipsis: Story = {
  render: () => <PaginationDemo initial={6} total={24} />,
};
