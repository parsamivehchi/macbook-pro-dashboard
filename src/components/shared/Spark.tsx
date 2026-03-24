interface SparkProps {
  values: number[];
  color: string;
  w?: number;
  h?: number;
}

export function Spark({ values, color, w = 60, h = 20 }: SparkProps) {
  if (!values?.length) return null;
  const mn = Math.min(...values);
  const mx = Math.max(...values);
  const rng = mx - mn || 1;
  const pts = values.map((v, i) =>
    `${(i / (values.length - 1)) * w},${h - ((v - mn) / rng) * h}`
  ).join(' ');
  return (
    <svg width={w} height={h} className="block">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
