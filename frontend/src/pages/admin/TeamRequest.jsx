import { useEffect, useState } from "react";
import {
  getPendingTeamRequests,
  decideTeamCreation
} from "../../apis/team";

export default function TeamRequest() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const fetchRequests = async () => {
    try {
      const res = await getPendingTeamRequests();
      setRequests(res.data); // asumsi backend return array langsung
    } catch (error) {
      console.error("Gagal fetch request team:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, decision) => {
    try {
      await decideTeamCreation(id, decision);
      fetchRequests(); // refresh list
    } catch (error) {
      console.error("Gagal update request:", error);
    }
  };

  const handleDetail = (team) => {
    setSelectedTeam(team);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4">Permintaan Buat Team</h2>

      {requests.length === 0 ? (
        <p>Tidak ada request.</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="p-2">Requester</th>
              <th className="p-2">Team Name</th>
              <th className="p-2">Description</th>
              <th className="p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id} className="text-center">
                <td className="p-2">
                  {req.users_create_requests_requestorTousers?.name || "-"}
                </td>
                <td className="p-2">{req.team_name}</td>
                <td className="p-2">{req.description}</td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => handleAction(req.id, "approved")}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(req.id, "declined")}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Decline
                  </button>
                  {req.status === "approved" && (
                    <button
                      onClick={() => handleDetail(req)}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Detail
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedTeam && (
        <div className="mt-8 p-4 border rounded bg-gray-50 dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-2">Team Detail</h3>
          <p>
            <strong>Nama:</strong> {selectedTeam.team_name}
          </p>
          <p>
            <strong>Deskripsi:</strong> {selectedTeam.description}
          </p>
          <p>
            <strong>Team Code:</strong> {selectedTeam.team_code}
          </p>
          <p>
            <strong>Status:</strong> {selectedTeam.status}
          </p>
          <p>
            <strong>Members:</strong>
          </p>
          <ul className="list-disc list-inside">
            {selectedTeam.teams?.members?.map((member) => (
              <li key={member.id}>
                {member.name} ({member.email})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
