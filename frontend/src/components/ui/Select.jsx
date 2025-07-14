export function Select({ options = [], className = '', ...props }) {
  return (
    <select
      {...props}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-zinc-900 ${className}`}
    >
      {options.map((opt, index) => (
        <option key={index} value={opt.value || opt}>
          {opt.label || opt}
        </option>
      ))}
    </select>
  );
}
