import type { Meta, StoryObj } from "@storybook/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./Carousel";
import { Card, CardHeader, CardTitle, CardDescription } from "./Card";

const meta: Meta<typeof Carousel> = {
  title: "Components/Carousel",
  component: Carousel,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Carousel>;

const caseStudies = [
  {
    title: "DEL-anchored Canadian market entry",
    desc: "US innovator achieving first-commercial-batch readiness.",
  },
  {
    title: "Analytical method transfer — top-5 generic",
    desc: "ICH Q2(R2) revalidation across 3 sites.",
  },
  {
    title: "Zone IVb stability for WHO procurement",
    desc: "12-month long-term + 6-month accelerated dataset.",
  },
];

export const CaseStudies: Story = {
  render: () => (
    <div className="px-12 max-w-3xl">
      <Carousel opts={{ loop: true }}>
        <CarouselContent>
          {caseStudies.map((c, i) => (
            <CarouselItem key={i} className="md:basis-1/2">
              <Card elevation="sm" className="h-48 p-6">
                <CardHeader className="p-0">
                  <CardTitle>{c.title}</CardTitle>
                  <CardDescription>{c.desc}</CardDescription>
                </CardHeader>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
};
