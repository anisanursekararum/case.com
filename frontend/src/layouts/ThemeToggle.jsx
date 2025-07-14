import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-sm rounded"
    >
      {theme === "dark" ? "Light Mode" : "Dark Mode"}
    </button>
  );
}
