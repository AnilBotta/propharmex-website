import type { Meta, StoryObj } from "@storybook/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./Card";
import { Button } from "./Button";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Card>;

export const Service: Story = {
  render: () => (
    <Card className="w-[360px]">
      <CardHeader>
        <CardTitle>Health Canada DEL anchoring</CardTitle>
        <CardDescription>
          We hold the Drug Establishment Licence and serve as your Canadian importer of record.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-5 text-sm text-[var(--color-slate-700)] space-y-1">
          <li>Pre-filing gap analysis</li>
          <li>Inspection-readiness coaching</li>
          <li>QP batch release</li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button size="sm">Review DEL pathway</Button>
      </CardFooter>
    </Card>
  ),
};

export const Elevations: Story = {
  render: () => (
    <div className="flex gap-4">
      <Card elevation="flat" className="w-48 p-4">flat</Card>
      <Card elevation="sm" className="w-48 p-4">sm</Card>
      <Card elevation="md" className="w-48 p-4">md</Card>
      <Card elevation="lg" className="w-48 p-4">lg</Card>
    </div>
  ),
};
