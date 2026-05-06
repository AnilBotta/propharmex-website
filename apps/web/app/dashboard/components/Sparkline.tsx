interface SparklineProps {
  data: number[];
  color: string;
  width?: number;
  height?: number;
}

/**
 * Lightweight inline-SVG sparkline. No deps. Rounds extremes; fills under
 * the line with a 12% alpha of `color`. Renders nothing if data has < 2
 * points (KPI card hides the slot).
 */
export function Sparkline({
  data,
  color,
  width = 120,
  height = 40,
}: SparklineProps) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  const points = data.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return [x, y] as const;
  });
  const path = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ");
  const fillPath = `${path} L${width} ${height} L0 ${height} Z`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden
      className="overflow-visible"
    >
      <path d={fillPath} fill={color} fillOpacity={0.12} />
      <path d={path} fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
