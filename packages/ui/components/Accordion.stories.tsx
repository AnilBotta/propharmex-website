import type { Meta, StoryObj } from "@storybook/react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./Accordion";

const meta: Meta<typeof Accordion> = {
  title: "Components/Accordion",
  component: Accordion,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Accordion>;

export const FAQ: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-[640px]">
      <AccordionItem value="del">
        <AccordionTrigger>What is a Health Canada DEL?</AccordionTrigger>
        <AccordionContent>
          A Drug Establishment Licence authorizes activities such as fabricating, packaging, labelling,
          testing, importing, distributing, and wholesaling drugs in Canada under the Food and Drugs Act.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="scope">
        <AccordionTrigger>Do you serve as importer of record?</AccordionTrigger>
        <AccordionContent>
          Yes — Propharmex can hold the DEL and act as the Canadian importer under a master services agreement.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
