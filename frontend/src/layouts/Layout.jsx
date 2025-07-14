import Sidebar from "./Sidebar.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

export default function Layout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white overflow-y-auto">
        <div className="flex justify-end p-4 border-b border-gray-300 dark:border-gray-700">
          <ThemeToggle />
        </div>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
