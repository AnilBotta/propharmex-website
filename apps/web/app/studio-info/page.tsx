/**
 * Legacy `/studio-info` page — preserved as a 307 redirect to /studio.
 *
 * Before PR-L′ this page documented how to reach the standalone Sanity
 * Studio at studio.propharmex.com. The Studio is now embedded directly
 * at /studio inside this Next.js app, so any existing bookmarks land on
 * the live editor rather than a defunct info card.
 *
 * A complementary permanent redirect is also wired in next.config.ts so
 * crawlers see a 308; this server-side redirect handles the runtime hop
 * with no client JS shipped.
 */
import { redirect } from "next/navigation";

export const dynamic = "force-static";

export default function StudioInfoPage(): never {
  redirect("/studio");
}
