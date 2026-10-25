const cells = Array.from({ length: 4 }, (_, column) =>
  Array.from({ length: 10 }, (_, row) => {
    const x = column * 138;
    const y = row * 160 + (column % 2 ? 80 : 0);
    return `${x - 92},${y} ${x - 46},${y - 80} ${x + 46},${y - 80} ${x + 92},${y} ${x + 46},${y + 80} ${x - 46},${y + 80}`;
  }),
).flat();

export function HiveBackdrop() {
  return (
    <div className="hive-backdrop pointer-events-none" aria-hidden="true">
      {(["left", "right"] as const).map((edge) => (
        <svg key={edge} className={`hive-edge hive-edge-${edge}`} viewBox="0 0 360 1440" preserveAspectRatio="xMinYMin slice" focusable="false">
          <defs>
            <linearGradient id={`hive-metal-${edge}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" className="hive-metal-soft" />
              <stop offset="0.35" className="hive-metal-bright" />
              <stop offset="0.65" className="hive-metal-soft" />
              <stop offset="1" className="hive-metal-bright" />
            </linearGradient>
          </defs>
          <g fill="none" stroke={`url(#hive-metal-${edge})`} strokeWidth="0.85">
            {cells.map((points, index) => <polygon key={index} points={points} />)}
          </g>
        </svg>
      ))}
    </div>
  );
}