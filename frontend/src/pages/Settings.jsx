import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getTeamDetail, requestCreateTeam } from "../apis/team";

export default function Settings() {
  const { token, activeTeam, setActiveTeam } = useAuth();
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const fetchTeams = async () => {
    try {
      const { data } = await getTeamDetail(token); // diganti dari getUserTeams jadi getTeamDetail
      setTeams(data);

      const saved = JSON.parse(localStorage.getItem("activeTeam"));
      if (saved) fetchMembers(saved.id);
    } catch (err) {
      console.error("Failed to fetch teams:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async (teamId) => {
    try {
      const { data } = await getTeamDetail(teamId, token);
      setMembers(data);
    } catch (err) {
      console.error("Failed to fetch members:", err);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleChangeTeam = (e) => {
    const teamId = e.target.value;
    const selected = teams.find((t) => t.teams.id === teamId);
    if (selected) {
      setActiveTeam(selected.teams);
      localStorage.setItem("activeTeam", JSON.stringify(selected.teams));
      fetchMembers(selected.teams.id);
    }
  };

  const handleCreateTeam = async () => {
    try {
      await requestCreateTeam({ team_name: newTeamName, description }, token);
      setMessage("Request pembuatan team berhasil dikirim.");
      setNewTeamName("");
      setDescription("");
      setShowCreateForm(false);
    } catch (err) {
      setMessage(err.response?.data?.message || "Gagal mengirim request.");
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      <h2 className="text-2xl font-semibold">Settings</h2>

      <div className="space-y-2">
        <label className="block font-medium">Pilih Team Aktif</label>
        <select
          className="w-full p-2 border rounded"
          value={activeTeam?.id || ""}
          onChange={handleChangeTeam}
        >
          <option disabled value="">
            -- Pilih Team --
          </option>
          {teams.map((ut) => (
            <option key={ut.teams.id} value={ut.teams.id}>
              {ut.teams.team_name}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
        <h3 className="font-semibold text-lg mb-2">
          Team Aktif: {activeTeam?.team_name}
        </h3>
        <p className="mb-2 text-sm text-gray-600 dark:text-gray-300">
          Deskripsi: {activeTeam?.description || "-"}
        </p>

        <h4 className="font-medium">Member Team:</h4>
        <ul className="list-disc list-inside">
          {members.map((m) => (
            <li key={m.id}>
              {m.name} ({m.email})
            </li>
          ))}
        </ul>
      </div>

      <div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="text-blue-600 underline text-sm"
        >
          {showCreateForm ? "Batal" : "Request Buat Team Baru"}
        </button>
      </div>

      {showCreateForm && (
        <div className="space-y-4 bg-gray-50 dark:bg-gray-900 p-4 rounded">
          <input
            type="text"
            placeholder="Nama Team"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <textarea
            placeholder="Deskripsi"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            onClick={handleCreateTeam}
            disabled={!newTeamName || !description}
            className="bg-green-600 text-white py-2 px-4 rounded"
          >
            Kirim Request
          </button>
          {message && <p className="text-blue-500 text-sm">{message}</p>}
        </div>
      )}
    </div>
  );
}
