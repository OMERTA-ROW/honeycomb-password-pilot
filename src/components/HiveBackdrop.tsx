// Large interlocking outlined hexagonal hive cells along both edges.
// Black empty interiors, metallic champagne-gold strokes, bright junction nodes.
const R = 96; // hex "radius" (center to vertex)
const W = R * 1.74; // flat-top hex width step
const H = R * 1.5; // vertical step between rows

const cells = Array.from({ length: 4 }, (_, column) =>
  Array.from({ length: 8 }, (_, row) => {
    const x = column * W * 0.75 + 40;
    const y = row * H + (column % 2 ? H / 2 : 0) + 60;
    return { x, y };
  }),
).flat();

const polygon = (x: number, y: number) =>
  `${x},${y - R} ${x + W / 2},${y - R / 2} ${x + W / 2},${y + R / 2} ${x},${y + R} ${x - W / 2},${y + R / 2} ${x - W / 2},${y - R / 2}`;

// Bright gold junctions at selected shared vertices (top vertex of every other cell).
const nodes = cells.filter((_, i) => i % 2 === 0).map(({ x, y }) => ({ x, y: y - R }));

export function HiveBackdrop() {
  return (
    <div className="hive-backdrop pointer-events-none" aria-hidden="true">
      {(["left", "right"] as const).map((edge) => (
        <svg key={edge} className={`hive-edge hive-edge-${edge}`} viewBox="0 0 560 1400" preserveAspectRatio="xMinYMin slice" focusable="false">
          <defs>
            <linearGradient id={`hive-metal-${edge}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" className="hive-metal-deep" />
              <stop offset="0.3" className="hive-metal-bright" />
              <stop offset="0.55" className="hive-metal-soft" />
              <stop offset="0.8" className="hive-metal-bright" />
              <stop offset="1" className="hive-metal-deep" />
            </linearGradient>
            <filter id={`hive-glow-${edge}`} x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g fill="none" stroke={`url(#hive-metal-${edge})`} filter={`url(#hive-glow-${edge})`}>
            {cells.map(({ x, y }, index) => (
              <polygon key={index} points={polygon(x, y)} className="hive-cell" />
            ))}
          </g>
          <g className="hive-nodes" filter={`url(#hive-glow-${edge})`}>
            {nodes.map(({ x, y }, index) => (
              <circle key={index} cx={x} cy={y} r="3.4" />
            ))}
          </g>
        </svg>
      ))}
    </div>
  );
}
