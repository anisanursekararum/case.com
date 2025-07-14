import { useTheme } from "../context/ThemeContext";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { darkMode, setDarkMode } = useTheme();
    const { logout } = useAuth();

  return (
    <header className="h-16 px-6 flex justify-end items-center bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <button
        onClick={() => setDarkMode((prev) => !prev)}
        className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        {darkMode ? (
          <SunIcon className="h-5 w-5 text-yellow-400" />
        ) : (
          <MoonIcon className="h-5 w-5 text-gray-800" />
        )}
      </button>
      <button onClick={logout} className="text-red-500 font-bold">
        Logout
      </button>
    </header>
  );
}
