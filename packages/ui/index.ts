/**
 * @propharmex/ui — public API.
 *
 * Every component is Framer Motion- and Radix-ready, tokenized against
 * `packages/config/design-tokens.css`, and audited for WCAG 2.1 AA.
 *
 * Consumer import pattern:
 *   import { Button, Card, Dialog } from "@propharmex/ui";
 */

// Utilities
export { cn } from "./utils";

// Motion tokens
export { MOTION, fadeRise, staggerContainer } from "./motion/tokens";
export type { MotionToken } from "./motion/tokens";

// Hooks
export { useReducedMotion } from "./hooks/use-reduced-motion";

// Primitives
export { Button, buttonVariants, type ButtonProps } from "./components/Button";
export { Badge, badgeVariants, type BadgeProps } from "./components/Badge";
export { Input, type InputProps } from "./components/Input";
export { Textarea, type TextareaProps } from "./components/Textarea";
export { Skeleton, type SkeletonProps } from "./components/Skeleton";
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  cardVariants,
  type CardProps,
} from "./components/Card";
export { Callout, calloutVariants, type CalloutProps } from "./components/Callout";
export { Stat, type StatProps } from "./components/Stat";
export {
  Breadcrumb,
  type BreadcrumbProps,
  type BreadcrumbItem,
} from "./components/Breadcrumb";
export { Pagination, type PaginationProps } from "./components/Pagination";

// Radix-backed
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
} from "./components/Select";
export { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/Tabs";
export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./components/Accordion";
export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogClose,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./components/Dialog";
export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetPortal,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  type SheetContentProps,
} from "./components/Sheet";
export {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "./components/Tooltip";

// Motion-heavy
export { Marquee, type MarqueeProps } from "./components/Marquee";
export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  useCarousel,
  type CarouselProps,
  type CarouselApi,
} from "./components/Carousel";
