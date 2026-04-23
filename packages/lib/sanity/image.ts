/**
 * `@sanity/image-url` helpers bound to the published client.
 *
 * Use `urlFor(source)` for a builder (chainable .width/.height/.format etc.)
 * or `urlForWidth(source, w)` for a quick sized URL.
 */
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { publishedClient, sanityConfig } from "./client";

type ImageUrlBuilder = ReturnType<typeof imageUrlBuilder>;
type ImageBuilder = ReturnType<ImageUrlBuilder["image"]>;

let cachedBuilder: ImageUrlBuilder | null = null;

function builder(): ImageUrlBuilder {
  if (!cachedBuilder) {
    cachedBuilder = imageUrlBuilder(publishedClient);
  }
  return cachedBuilder;
}

/**
 * Return an image URL builder for the given image source.
 * Returns `null` if the source is falsy (no asset picked in Sanity).
 */
export function urlFor(
  source: SanityImageSource | null | undefined,
): ImageBuilder | null {
  if (!source) return null;
  if (!sanityConfig.projectId) return null;
  return builder().image(source);
}

/**
 * Convenience: image URL at a given width, auto-format, 75 quality.
 * Returns `null` if the source is missing.
 */
export function urlForWidth(
  source: SanityImageSource | null | undefined,
  width: number
): string | null {
  const b = urlFor(source);
  if (!b) return null;
  return b.width(width).auto("format").quality(75).url();
}
