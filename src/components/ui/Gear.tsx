import { cn } from "@/lib/utils";

const TEETH = 10;

function gearPath() {
  const outer = 48;
  const inner = 38;
  const step = (Math.PI * 2) / TEETH;
  const points: string[] = [];
  for (let i = 0; i < TEETH; i++) {
    const a = i * step;
    const corners = [
      [inner, a - step * 0.5],
      [inner, a - step * 0.22],
      [outer, a - step * 0.14],
      [outer, a + step * 0.14],
      [inner, a + step * 0.22],
    ] as const;
    for (const [r, angle] of corners) {
      points.push(`${(50 + r * Math.cos(angle)).toFixed(2)},${(50 + r * Math.sin(angle)).toFixed(2)}`);
    }
  }
  return `M${points.join("L")}Z`;
}

const PATH = gearPath();

export function Gear({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden className={cn("shrink-0", className)}>
      <path d={`${PATH} M50,34 A16,16 0 1,0 50,66 A16,16 0 1,0 50,34 Z`} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}
