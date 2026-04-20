export default function XPBar({ xp, xpForNextLevel, animated = true }) {
  const percentage = Math.min((xp / xpForNextLevel) * 100, 100);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs text-gray-400 font-medium">EXP</span>
        <span className="text-xs text-gold-400 font-mono font-semibold">
          {xp.toLocaleString()} / {xpForNextLevel.toLocaleString()}
        </span>
      </div>
      <div className="xp-bar-track">
        <div
          className={`xp-bar-fill ${animated ? "animate-xp-fill" : ""}`}
          style={{ width: `${percentage}%`, "--xp-width": `${percentage}%` }}
        />
      </div>
      <div className="flex justify-end mt-1">
        <span className="text-xs text-gray-500">{Math.round(percentage)}%</span>
      </div>
    </div>
  );
}
