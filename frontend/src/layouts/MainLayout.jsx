import { Outlet } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function MainLayout() {
  const { darkMode, setDarkMode } = useTheme();
  const { user, activeTeam, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-[#F2F3F7] dark:bg-[#111827] text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );

  // return (
  //   <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
  //     <header className="flex items-center justify-between p-4 shadow-md dark:shadow-none">
  //       <div>
  //         👋 Hi, {user?.name || "-"} | Team: {activeTeam?.team_name || "-"}
  //       </div>
  //       <div className="flex gap-4 items-center">
  //         <button onClick={() => setDarkMode(!darkMode)}>
  //           {darkMode ? "🌙" : "☀️"}
  //         </button>
  //         <button onClick={logout} className="text-red-500">
  //           Logout
  //         </button>
  //       </div>
  //     </header>
  //     <main className="p-4">
  //       <Outlet />
  //     </main>
  //   </div>
  // );
}
