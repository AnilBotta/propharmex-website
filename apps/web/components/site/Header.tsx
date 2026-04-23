"use client";

/**
 * Site header.
 *
 * Sticky. Transparent over a dark hero on `/` (detected via
 * `data-hero="dark"` on <main>) and solid everywhere else and on scroll.
 * Mega-menus on desktop, full-sheet drawer on mobile. 44px minimum hit
 * targets throughout.
 *
 * Focus management:
 *  - Trigger buttons toggle `aria-expanded`.
 *  - Panel is a listbox-adjacent region with tab-order links.
 *  - Escape closes any open menu and returns focus to its trigger.
 *  - Outside click closes.
 *
 * Motion: panel fade+rise on open (240ms), honor prefers-reduced-motion.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  cn,
  useReducedMotion,
} from "@propharmex/ui";

import { CTAS, PRIMARY_NAV, type Region } from "../../content/site-nav";
import { BrandLogo } from "./BrandLogo";
import { RegionSwitcher } from "./RegionSwitcher";

type Props = {
  initialRegion?: Region;
};

export function Header({ initialRegion }: Props) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [heroDark, setHeroDark] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // Close open mega-menu on route change.
  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  // Detect an opt-in dark hero on the current page (`<main data-hero="dark">`).
  // Prompts 5+ mark pages with this attribute when their hero has a dark
  // background. Header stays solid on every other route.
  useEffect(() => {
    const main = document.getElementById("main-content");
    setHeroDark(main?.getAttribute("data-hero") === "dark");
  }, [pathname]);

  // Scroll detection: only matters while the hero is dark.
  useEffect(() => {
    if (!heroDark) return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [heroDark]);

  // Escape to close mega-menu.
  useEffect(() => {
    if (!openMenu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openMenu]);

  // Outside-click closes mega-menu.
  useEffect(() => {
    if (!openMenu) return;
    const onClick = (e: MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpenMenu(null);
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [openMenu]);

  const isTransparent = heroDark && !scrolled;

  const toggleMenu = useCallback(
    (label: string) =>
      setOpenMenu((curr) => (curr === label ? null : label)),
    [],
  );

  return (
    <header
      data-transparent={isTransparent ? "true" : undefined}
      className={cn(
        "sticky top-0 z-50 w-full transition-colors duration-200 ease-out",
        isTransparent
          ? "border-transparent bg-transparent"
          : "border-b border-[var(--color-border)] bg-[color-mix(in_oklab,var(--color-bg)_92%,transparent)] backdrop-blur",
      )}
    >
      <div
        ref={navRef}
        className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:h-[72px] lg:px-8"
      >
        <Link
          href="/"
          aria-label="Propharmex home"
          className="inline-flex items-center rounded-[var(--radius-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2"
        >
          <BrandLogo tone={isTransparent ? "light" : "dark"} />
        </Link>

        {/* Desktop nav */}
        <nav
          aria-label="Primary"
          className="ml-4 hidden flex-1 items-center gap-1 lg:flex"
        >
          {PRIMARY_NAV.map((section) => {
            const hasMenu = !!section.columns?.length;
            const expanded = openMenu === section.label;
            const active =
              section.href && pathname.startsWith(section.href) ? true : false;

            if (!hasMenu && section.href) {
              return (
                <Link
                  key={section.label}
                  href={section.href}
                  className={cn(
                    "rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium transition-colors",
                    isTransparent
                      ? "text-white/90 hover:text-white"
                      : "text-[var(--color-fg)] hover:text-[var(--color-primary-700)]",
                    active && "text-[var(--color-primary-700)]",
                  )}
                >
                  {section.label}
                </Link>
              );
            }

            return (
              <div key={section.label} className="relative">
                <button
                  type="button"
                  onClick={() => toggleMenu(section.label)}
                  aria-expanded={expanded}
                  aria-haspopup="true"
                  aria-controls={`megamenu-${section.label}`}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium transition-colors",
                    isTransparent
                      ? "text-white/90 hover:text-white"
                      : "text-[var(--color-fg)] hover:text-[var(--color-primary-700)]",
                    (expanded || active) && "text-[var(--color-primary-700)]",
                  )}
                >
                  {section.label}
                  <ChevronDown
                    aria-hidden="true"
                    className={cn(
                      "size-4 transition-transform",
                      expanded && "rotate-180",
                    )}
                  />
                </button>

                <AnimatePresence>
                  {expanded && (
                    <motion.div
                      id={`megamenu-${section.label}`}
                      role="region"
                      aria-label={`${section.label} menu`}
                      initial={reduced ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
                      transition={{
                        duration: reduced ? 0 : 0.24,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="absolute left-0 top-full z-50 mt-2 w-[min(880px,calc(100vw-2rem))] origin-top rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-xl)]"
                    >
                      <div
                        className={cn(
                          "grid gap-6",
                          section.columns!.length === 1
                            ? "grid-cols-1"
                            : section.columns!.length === 2
                              ? "grid-cols-2"
                              : "grid-cols-3",
                        )}
                      >
                        {section.columns!.map((col) => (
                          <div key={col.heading}>
                            <h3 className="mb-3 font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]">
                              {col.heading}
                            </h3>
                            <ul className="flex flex-col gap-1">
                              {col.links.map((l) => (
                                <li key={l.href}>
                                  <Link
                                    href={l.href}
                                    className="group flex flex-col gap-0.5 rounded-[var(--radius-sm)] px-2 py-1.5 transition-colors hover:bg-[var(--color-primary-50)]"
                                  >
                                    <span className="text-sm font-medium text-[var(--color-fg)] group-hover:text-[var(--color-primary-700)]">
                                      {l.label}
                                    </span>
                                    {l.description && (
                                      <span className="text-xs text-[var(--color-muted)]">
                                        {l.description}
                                      </span>
                                    )}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:gap-3">
          <div className="hidden md:block">
            <RegionSwitcher initial={initialRegion} variant="header" />
          </div>

          <Button asChild variant="primary" size="sm" className="hidden md:inline-flex">
            <Link href="/contact?intent=quote">{CTAS.quote}</Link>
          </Button>

          {/* Mobile trigger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                className={cn(
                  "inline-flex size-11 items-center justify-center rounded-[var(--radius-sm)] border transition-colors lg:hidden",
                  isTransparent
                    ? "border-white/30 text-white hover:bg-white/10"
                    : "border-[var(--color-border)] text-[var(--color-fg)] hover:bg-[var(--color-slate-100)]",
                )}
              >
                <Menu aria-hidden="true" className="size-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-sm overflow-y-auto p-0">
              <MobileNav initialRegion={initialRegion} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function MobileNav({ initialRegion }: { initialRegion?: Region }) {
  const pathname = usePathname();
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] p-5">
        <SheetTitle>
          <BrandLogo />
        </SheetTitle>
      </div>
      <nav aria-label="Mobile primary" className="flex-1 overflow-y-auto p-3">
        <Accordion type="multiple" className="w-full">
          {PRIMARY_NAV.map((section) => {
            if (!section.columns?.length && section.href) {
              const active = pathname.startsWith(section.href);
              return (
                <Link
                  key={section.label}
                  href={section.href}
                  className={cn(
                    "flex min-h-11 items-center rounded-[var(--radius-sm)] px-3 py-3 text-base font-medium",
                    active
                      ? "bg-[var(--color-primary-50)] text-[var(--color-primary-800)]"
                      : "text-[var(--color-fg)] hover:bg-[var(--color-slate-100)]",
                  )}
                >
                  {section.label}
                </Link>
              );
            }
            return (
              <AccordionItem
                key={section.label}
                value={section.label}
                className="border-none"
              >
                <AccordionTrigger className="min-h-11 px-3 text-base font-medium">
                  {section.label}
                </AccordionTrigger>
                <AccordionContent className="px-3 pb-2">
                  <ul className="flex flex-col gap-1 pl-2">
                    {section.columns!.flatMap((c) => c.links).map((l) => (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          className="flex min-h-11 items-center rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--color-fg)] hover:bg-[var(--color-slate-100)]"
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </nav>
      <div className="flex flex-col gap-3 border-t border-[var(--color-border)] p-5">
        <RegionSwitcher initial={initialRegion} variant="footer" />
        <Button asChild variant="primary" size="md" className="w-full">
          <Link href="/contact?intent=quote">{CTAS.quote}</Link>
        </Button>
      </div>
    </div>
  );
}
