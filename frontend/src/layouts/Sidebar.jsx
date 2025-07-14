import { useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { Select } from "../components/ui/Select";
import LogoLight from "../assets/logo-light.svg";
import LogoDark from "../assets/logo-dark.svg";

export default function Sidebar() {
  const { darkMode } = useTheme();
  const { user, activeTeam, setActiveTeam, fetchUser  } = useAuth();

  // ✅ Fetch data user setiap kali Sidebar mount
  useEffect(() => {
    fetchUser();
  }, []);

  const teamOptions = user?.teams?.map((team) => ({
    value: team.id,
    label: team.team_name,
  }));

  const handleChangeTeam = (e) => {
    const selectedId = parseInt(e.target.value);
    const selectedTeam = user.teams.find((t) => t.id === selectedId);
    setActiveTeam(selectedTeam);
  };

  return (
    <aside className="w-64 h-screen bg-white dark:bg-[#1F2937] border-r dark:border-gray-700 p-6 space-y-6">
      <div className="flex justify-center">
        <img
          src={darkMode ? LogoDark : LogoLight}
          alt="Logo"
          className="h-10"
        />
      </div>

      {/* Select Active Team */}
      <div>
        <label className="text-xs font-semibold text-gray-500 dark:text-gray-300 mb-1 block">
          Active Team
        </label>
        {/* ✅ Tampilkan select hanya jika lebih dari 1 tim */}
        {user?.teams?.length > 1 ? (
          <Select
            value={activeTeam?.id || ""}
            onChange={handleChangeTeam}
            options={teamOptions}
            placeholder="Choose your team"
            className="w-full"
          />
        ) : (
          <div className="text-sm font-medium mt-2 text-gray-700 dark:text-gray-100">
            {activeTeam?.team_name || "-"}
          </div>
        )}
      </div>

      {/* Menu */}
      <nav className="space-y-2 text-sm">
        <p className="text-xs text-gray-400 uppercase">Project</p>
        <ul className="space-y-1 ml-2">
          <li>📊 Dashboard</li>
          <li>👥 Team</li>
        </ul>

        <p className="text-xs text-gray-400 uppercase mt-4">Management</p>
        <ul className="space-y-1 ml-2">
          <li>📚 Test Case Repositories</li>
          <li>🧪 Test Plans</li>
          <li>🚀 Test Runs</li>
        </ul>
      </nav>
    </aside>
  );
}
