import type { Meta, StoryObj } from "@storybook/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./Tabs";

const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  component: Tabs,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Tabs>;

export const Engagement: Story = {
  render: () => (
    <Tabs defaultValue="canada" className="w-[640px]">
      <TabsList>
        <TabsTrigger value="canada">Canada side</TabsTrigger>
        <TabsTrigger value="india">India side</TabsTrigger>
        <TabsTrigger value="together">Together</TabsTrigger>
      </TabsList>
      <TabsContent value="canada">
        Health Canada DEL holder, QP release, and regulator relationships.
      </TabsContent>
      <TabsContent value="india">
        WHO-GMP analytical depth, cost-efficient manufacturing, ICH stability.
      </TabsContent>
      <TabsContent value="together">
        Split-geography engagement: one SLA, one batch record chain-of-custody.
      </TabsContent>
    </Tabs>
  ),
};
