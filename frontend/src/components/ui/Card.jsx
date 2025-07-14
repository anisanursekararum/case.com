export function Card({ children, className = '' }) {
  return <div className={`bg-white dark:bg-zinc-900 shadow-md rounded-xl ${className}`}>{children}</div>;
}

export function CardContent({ children, className = '' }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}
