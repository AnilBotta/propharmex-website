/**
 * Pastel-tinted circular avatar with initials. Color is derived from a
 * stable hash of the seed so the same person always gets the same hue.
 */
const PALETTE = [
  { bg: "#FFE4D6", fg: "#9B4A0A" }, // accent
  { bg: "#DEF1FA", fg: "#0E5E86" }, // blue
  { bg: "#DDF3DF", fg: "#1F7A2C" }, // green
  { bg: "#E4E7F4", fg: "#2A3050" }, // navy/slate
  { bg: "#F4DCEB", fg: "#823062" }, // pink
  { bg: "#EEE0FF", fg: "#5B2A8A" }, // purple
];

export function LeadAvatar({
  name,
  email,
  size = 28,
}: {
  name?: string | null;
  email: string;
  size?: number;
}) {
  const seed = name && name.trim() ? name : email;
  const initials = computeInitials(seed);
  const palette = PALETTE[hash(seed) % PALETTE.length]!;

  return (
    <span
      className="grid shrink-0 place-items-center rounded-full font-semibold"
      style={{
        width: size,
        height: size,
        background: palette.bg,
        color: palette.fg,
        fontSize: Math.max(9, Math.round(size * 0.36)),
      }}
      aria-hidden
    >
      {initials}
    </span>
  );
}

function computeInitials(seed: string): string {
  const cleaned = seed.replace(/[._\-+]/g, " ").trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}
