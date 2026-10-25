const cells = Array.from({ length: 5 }, (_, column) =>
  Array.from({ length: 9 }, (_, row) => {
    const x = column * 165;
    const y = row * 190 + (column % 2 ? 95 : 0);
    return `${x - 110},${y} ${x - 55},${y - 95} ${x + 55},${y - 95} ${x + 110},${y} ${x + 55},${y + 95} ${x - 55},${y + 95}`;
  }),
).flat();

export function HiveBackdrop() {
  return (
    <div className="hive-backdrop pointer-events-none" aria-hidden="true">
      {(["left", "right"] as const).map((edge) => (
        <svg key={edge} className={`hive-edge hive-edge-${edge}`} viewBox="0 0 560 1600" preserveAspectRatio="xMinYMin slice" focusable="false">
          <defs>
            <linearGradient id={`hive-metal-${edge}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" className="hive-metal-deep" />
              <stop offset="0.3" className="hive-metal-bright" />
              <stop offset="0.55" className="hive-metal-soft" />
              <stop offset="0.8" className="hive-metal-bright" />
              <stop offset="1" className="hive-metal-deep" />
            </linearGradient>
            <filter id={`hive-glow-${edge}`} x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="3.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g fill="none" stroke={`url(#hive-metal-${edge})`} filter={`url(#hive-glow-${edge})`}>
            {cells.map((points, index) => (
              <polygon key={index} points={points} className="hive-cell" />
            ))}
          </g>
        </svg>
      ))}
    </div>
  );
}
