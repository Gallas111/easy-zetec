interface ComparisonTableProps {
  title?: string;
  headers: string[];
  rows: string[][];
  highlightRow?: number;
}

export default function ComparisonTable({
  title,
  headers,
  rows,
  highlightRow,
}: ComparisonTableProps) {
  return (
    <div className="my-6 bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden">
      {title && (
        <div className="px-5 py-3 bg-gray-50 border-b border-[var(--color-border)]">
          <h4 className="font-semibold text-[var(--color-text)] flex items-center gap-2">
            <span>📊</span> {title}
          </h4>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--color-primary)]">
              {headers.map((header, i) => (
                <th
                  key={i}
                  className="px-4 py-3 text-left text-white font-semibold whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className={`border-b border-[var(--color-border)] ${
                  highlightRow === i
                    ? "bg-[#F0FDFA] font-medium"
                    : i % 2 === 0
                    ? "bg-white"
                    : "bg-gray-50"
                } hover:bg-[#F0FDFA] transition-colors`}
              >
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-3 whitespace-nowrap">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
