interface KeyTakeawayProps {
  title?: string;
  points: string[];
}

export default function KeyTakeaway({
  title = "핵심 요약",
  points,
}: KeyTakeawayProps) {
  return (
    <div className="my-8 bg-gradient-to-br from-[#F0FDFA] to-white rounded-2xl border border-[var(--color-primary-light)]/30 p-6">
      <h4 className="font-bold text-[var(--color-primary-dark)] mb-4 flex items-center gap-2 text-lg">
        <span className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center text-white text-sm">
          ✓
        </span>
        {title}
      </h4>
      <ul className="space-y-2.5">
        {points.map((point, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
            <span className="w-5 h-5 rounded-full bg-[var(--color-primary)] text-white text-xs flex items-center justify-center shrink-0 mt-0.5 font-semibold">
              {i + 1}
            </span>
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}
