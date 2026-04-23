import Link from "next/link";
import { Button } from "@propharmex/ui";

export const metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-start gap-6 px-6 py-24 sm:py-32">
      <p className="font-[family-name:var(--font-display)] text-sm font-semibold uppercase tracking-[0.08em] text-[var(--color-primary-700)]">
        404 · Page not found
      </p>
      <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight sm:text-5xl">
        We couldn&rsquo;t find that page.
      </h1>
      <p className="text-base leading-relaxed text-[var(--color-slate-700)]">
        The link may be out of date, or the page may have moved. The site map
        below points to the most-visited sections. If you followed a link from
        an email or document, please{" "}
        <Link
          className="underline underline-offset-4 hover:text-[var(--color-primary-700)]"
          href="/contact"
        >
          let us know
        </Link>{" "}
        so we can correct it.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button asChild variant="primary" size="md">
          <Link href="/">Return home</Link>
        </Button>
        <Button asChild variant="secondary" size="md">
          <Link href="/services">Browse services</Link>
        </Button>
        <Button asChild variant="secondary" size="md">
          <Link href="/contact">Contact us</Link>
        </Button>
      </div>
    </section>
  );
}
