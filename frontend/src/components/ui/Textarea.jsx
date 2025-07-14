export function Textarea({ className = '', ...props }) {
  return (
    <textarea
      {...props}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${className}`}
      rows={props.rows || 4}
    />
  );
}