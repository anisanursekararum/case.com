import { useEffect, useState } from "react";
import {
  getPendingJoinRequests,
  decideJoinRequest,
} from "../../apis/team";

export default function UserRequest() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await getPendingJoinRequests();
      setRequests(res.data); // asumsi backend return array langsung
    } catch (err) {
      console.error("Gagal fetch join requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, decision) => {
    try {
      await decideJoinRequest(id, decision);
      fetchRequests(); // refresh setelah aksi
    } catch (err) {
      console.error("Gagal update join request:", err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4">Permintaan Join Team</h2>

      {requests.length === 0 ? (
        <p>Tidak ada request.</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="p-2">User</th>
              <th className="p-2">Email</th>
              <th className="p-2">Team</th>
              <th className="p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id} className="text-center">
                <td className="p-2">
                  {req.users_join_requests_requestorTousers?.name}
                </td>
                <td className="p-2">
                  {req.users_join_requests_requestorTousers?.email}
                </td>
                <td className="p-2">{req.teams?.team_name}</td>
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
