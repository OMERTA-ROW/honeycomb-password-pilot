// Decorative, deterministic mechanical scene. Only opt-in playback; no status authority.
export function MechanicalHive({ playing }: { playing: boolean }) {
  return <svg className={`mechanical-hive ${playing ? "hive-playing" : ""}`} viewBox="0 0 480 180" aria-hidden="true" focusable="false">
    <defs><linearGradient id="mechanical-metal" x2="1" y2="1"><stop className="hive-metal-deep" /><stop offset=".45" className="hive-metal-bright" /><stop offset="1" className="hive-metal-soft" /></linearGradient></defs>
    <g className="mechanical-frame" fill="none" stroke="url(#mechanical-metal)">
      <path d="M80 150L110 40 180 14H300L370 40 400 150Z" strokeWidth="3" />
      <path d="M100 150H380M125 38L105 130M355 38L375 130M170 20V35M310 20V35" />
      {[0,1,2].flatMap(row => [0,1,2,3,4].map(col => {
        const x = 156 + col * 34 + (row % 2 ? 17 : 0), y = 48 + row * 30;
        return <polygon key={`${row}-${col}`} className={`mechanical-cell mechanical-phase-${(row+col)%3}`} points={`${x},${y-20} ${x+17},${y-10} ${x+17},${y+10} ${x},${y+20} ${x-17},${y+10} ${x-17},${y-10}`} />;
      }))}
    </g>
    {["gold","silver"].map((metal,i) => <g key={metal} className={`robot-bee robot-bee-${metal}`} transform={`translate(${i ? 350 : 85} ${i ? 94 : 66})`}>
      <g className="robot-flight"><ellipse className="robot-wing" cx="-6" cy="-12" rx="15" ry="7" /><ellipse className="robot-wing" cx="10" cy="-12" rx="15" ry="7" /><ellipse cx="0" cy="0" rx="23" ry="13" /><path d="M-8-12V12M3-13V13M13-9V9M-14 12L-20 23M7 12L12 23M20-5L28-15" fill="none" /><circle cx="-24" cy="-1" r="8" /><circle className="robot-eye" cx="-27" cy="-3" r="2" /></g>
    </g>)}
  </svg>;
}