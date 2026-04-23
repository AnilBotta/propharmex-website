import type { Preview } from "@storybook/react";
import "./preview.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "pharma-white",
      values: [
        { name: "pharma-white", value: "#FAFAF7" },
        { name: "surface", value: "#FFFFFF" },
        { name: "slate-900", value: "#1A2330" },
      ],
    },
    viewport: {
      viewports: {
        mobile: { name: "Mobile (390)", styles: { width: "390px", height: "844px" } },
        tablet: { name: "Tablet (768)", styles: { width: "768px", height: "1024px" } },
        desktop: { name: "Desktop (1440)", styles: { width: "1440px", height: "900px" } },
      },
    },
    a11y: {
      config: { rules: [{ id: "color-contrast", enabled: true }] },
    },
  },
  tags: ["autodocs"],
};

export default preview;
