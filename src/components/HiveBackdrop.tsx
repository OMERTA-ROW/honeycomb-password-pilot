// Interlocking pointy-top hive cells along both edges, matched to the approved mockup:
// black empty interiors, warm champagne-amber strokes, brighter glowing junctions.
const R = 74; // center to vertex
const W = Math.sqrt(3) * R; // pointy-top hex width = horizontal step
const H = R * 1.5; // vertical step between rows

const cells = Array.from({ length: 11 }, (_, row) =>
  Array.from({ length: 4 }, (_, column) => ({
    x: column * W + (row % 2 ? W / 2 : 0) + 20,
    y: row * H + 30,
  })),
).flat();

const polygon = (x: number, y: number) =>
  `${x},${y - R} ${x + W / 2},${y - R / 2} ${x + W / 2},${y + R / 2} ${x},${y + R} ${x - W / 2},${y + R / 2} ${x - W / 2},${y - R / 2}`;

// Junction glow on shared vertices (top and upper-right vertex of each cell).
const nodes = cells.flatMap(({ x, y }, i) =>
  i % 3 === 0 ? [{ x, y: y - R }, { x: x + W / 2, y: y - R / 2 }] : [{ x, y: y - R }],
);

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
              <feGaussianBlur stdDeviation="2.6" result="blur" />
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
              <circle key={index} cx={x} cy={y} r="2.6" />
            ))}
          </g>
        </svg>
      ))}
    </div>
  );
}
