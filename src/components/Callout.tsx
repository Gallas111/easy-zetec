interface CalloutProps {
  type?: "tip" | "warning" | "danger" | "info";
  title?: string;
  children: React.ReactNode;
}

const styles = {
  tip: {
    bg: "bg-emerald-50",
    border: "border-emerald-400",
    icon: "💡",
    titleColor: "text-emerald-800",
    defaultTitle: "꿀팁",
  },
  warning: {
    bg: "bg-amber-50",
    border: "border-amber-400",
    icon: "⚠️",
    titleColor: "text-amber-800",
    defaultTitle: "주의",
  },
  danger: {
    bg: "bg-red-50",
    border: "border-red-400",
    icon: "🚨",
    titleColor: "text-red-800",
    defaultTitle: "경고",
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-400",
    icon: "ℹ️",
    titleColor: "text-blue-800",
    defaultTitle: "참고",
  },
};

export default function Callout({
  type = "tip",
  title,
  children,
}: CalloutProps) {
  const style = styles[type];

  return (
    <div
      className={`${style.bg} border-l-4 ${style.border} rounded-r-xl p-5 my-6`}
    >
      <div className={`font-semibold ${style.titleColor} mb-2 flex items-center gap-2`}>
        <span>{style.icon}</span>
        {title || style.defaultTitle}
      </div>
      <div className="text-gray-700 text-sm leading-relaxed">{children}</div>
    </div>
  );
}
