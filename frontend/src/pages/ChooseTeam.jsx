import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCurrentUser } from "../apis/auth";
import { Button } from "../components/ui/Button";
import { Select } from "../components/ui/Select";
import Popup from "../components/ui/Popup";
import Logo from "../assets/logo-light.svg";

export default function ChooseTeam() {
  const { token, user, setUser, setActiveTeam } = useAuth();
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [popup, setPopup] = useState({ visible: false, type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Ambil data user + teams dari API (kalau belum ada)
  useEffect(() => {
    const fetchTeams = async () => {
      if (!user && token) {
        try {
          const res = await getCurrentUser(token);
          setUser(res.data); // langsung set seluruh response
        } catch (err) {
          setPopup({
            visible: true,
            type: "error",
            message: "Failed to fetch user teams",
          });
        }
      }
    };
    fetchTeams();
  }, [user, token, setUser]);

  // Handle submit pilihan tim
  const handleSubmit = (e) => {
    e.preventDefault();

    const selected = user?.teams?.find(
      (team) => team.id === parseInt(selectedTeamId)
    );
    if (!selected) {
      setPopup({
        visible: true,
        type: "error",
        message: "Please select a team",
      });
      return;
    }

    setActiveTeam(selected);
    navigate("/dashboard"); // Ganti sesuai rute dashboard kamu
  };

  const teamOptions = [
    { value: "", label: "Choose your active team" },
    ...(user?.teams?.map((team) => ({
      value: team.id.toString(),
      label: team.team_name,
    })) || []),
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#111929] to-[#788AFF] px-4">
      <div className="w-full max-w-3xl p-10 bg-white rounded-[32px] shadow-lg">
        <img src={Logo} alt="Case Logo" className="w-36 mb-4 mx-auto" />
        <h2 className="text-center text-xl font-semibold text-primary mb-10">
          Test, Track, and Triumph!!
        </h2>
        <h2 className="text-2xl font-bold text-black text-center mb-6">
          You're in multiple teams. Select one to continue.
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex justify-center">
            <Select
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              options={teamOptions}
              placeholder="Select your team"
              className="max-w-sm w-full p-10 flex flex-col bg-white rounded-[32px] shadow-lg"
            />
          </div>
          <div className="flex justify-center">
            <Button
              type="submit"
              className="bg-orange hover:bg-lightOrange text-white mt-4 px-6"
              disabled={loading}
            >
              Continue to the Dashboard
            </Button>
          </div>
        </form>
        <p className="text-xs text-gray-400 text-center mt-4">
          © 2025 by TestingWithAnisa
        </p>
      </div>
      {popup.visible && (
        <Popup
          type={popup.type}
          message={popup.message}
          onClose={() => setPopup({ visible: false, type: "", message: "" })}
        />
      )}
    </div>
  );
}
