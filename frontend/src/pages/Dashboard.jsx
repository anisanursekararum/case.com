import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTeamDetail } from "../apis/team";

export default function Dashboard() {
  // const { user, activeTeam } = useAuth();
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();
  const { activeTeam } = useAuth();
  console.log(activeTeam?.team_name); // gunakan untuk filtering data sesuai team

  useEffect(() => {
    const fetchMembers = async () => {
      if (!activeTeam) return;
      try {
        const res = await getTeamDetail(activeTeam.id);
        setMembers(res.data); // asumsi array langsung
      } catch (err) {
        console.error("Gagal ambil member team:", err);
      }
    };

    fetchMembers();
  }, [activeTeam]);

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      {/* <h2 className="text-2xl font-bold mb-4">Welcome, {user?.name} 👋</h2> */}

      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded shadow space-y-4">
        <h3 className="text-xl font-semibold">
          Team Aktif: {activeTeam?.team_name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {activeTeam?.description}
        </p>
        <p className="text-sm text-gray-500">
          <strong>Team Code:</strong> {activeTeam?.team_code}
        </p>

        <div className="flex justify-between items-center">
          <div>
            <p className="text-lg font-medium">
              Total Members: {members.length}
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/settings")}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Settings
            </button>
            {/* {user?.role === "admin" && (
              <button
                onClick={() => navigate("/admin/user-request")}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Admin Panel
              </button>
            )} */}
          </div>
        </div>

        <div className="mt-4">
          <h4 className="font-semibold">Anggota Team:</h4>
          <ul className="list-disc list-inside">
            {members.map((m) => (
              <li key={m.id}>
                {m.name} ({m.email})
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
