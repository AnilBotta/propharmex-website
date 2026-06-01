import Image from "next/image";

import type { HeroSection } from "../../content/home";

import { HeroActions } from "./HeroActions";

interface Props { content: HeroSection }

/**
 * Home hero. The hero illustration sits behind the copy as a full-bleed
 * background; a left-anchored white-to-transparent gradient overlay
 * preserves readability of the headline + body + CTAs over the molecules.
 *
 * Text column is constrained to ~50% on lg+ so the molecules cluster on
 * the right of the image stays visible behind/beside the CTAs. On mobile
 * the image is positioned to keep its lighter side under the text.
 */
export function Hero({ content }: Props) {
  return (
    <section
      aria-labelledby="home-hero-heading"
      className="relative isolate overflow-hidden bg-[var(--color-bg)] pb-24 pt-20 sm:pb-32 sm:pt-28"
    >
      <HeroBackdrop />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 flex max-w-2xl flex-col gap-6 lg:max-w-3xl">
          <p className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-700)]">
            {content.eyebrow}
          </p>

          <h1
            id="home-hero-heading"
            className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-5xl lg:text-[clamp(2.75rem,4.2vw,3.75rem)] lg:leading-[1.08]"
          >
            <span>{content.headline}</span>{" "}
            <span className="text-[var(--color-primary-700)]">{content.headlineAccent}</span>
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-[var(--color-slate-800)] sm:text-lg">
            {content.subhead}
          </p>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <HeroActions ctas={content.ctas} />
          </div>

          <p className="mt-3 max-w-xl text-xs tracking-[0.02em] text-[var(--color-muted)]">
            {content.microTrust}
          </p>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section-level decoration. Layered (back to front):                        */
/*    1. Hero illustration as a full-bleed background image.                  */
/*    2. White-to-transparent gradient overlay for text contrast on the left. */
/*    3. Subtle radial primary glow at the top + hairline divider at bottom   */
/*       for section framing.                                                 */
/* -------------------------------------------------------------------------- */

function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <Image
        src="/hero-section.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[80%_50%] sm:object-[78%_50%] lg:object-[72%_50%]"
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, var(--color-bg) 0%, var(--color-bg) 28%, color-mix(in srgb, var(--color-bg) 90%, transparent) 50%, color-mix(in srgb, var(--color-bg) 35%, transparent) 75%, transparent 100%)",
        }}
      />

      <div
        className="absolute inset-x-0 top-0 h-[60%] opacity-50"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, var(--color-primary-50) 0%, transparent 60%)",
        }}
      />

      <div
        className="absolute inset-x-0 bottom-0 h-px"
        style={{ background: "var(--color-border)" }}
      />
    </div>
  );
}
