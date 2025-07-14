export function Button({ children, className = '', variant = 'default', ...props }) {
  const base = 'px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2';
  // const variants = {
  //   // default: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary',
  //   // outline: 'border border-primary text-primary hover:bg-primary/10 focus:ring-primary',
  //   // ghost: 'text-primary hover:bg-primary/5 focus:ring-primary',
  //   // custom: '',
  // };
  return (
    <button
      {...props}
      className={`${base} ${className}`}
    >
      {children}
    </button>
  );
}