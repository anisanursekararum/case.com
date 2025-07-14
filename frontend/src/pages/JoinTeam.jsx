import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import Popup from "../components/ui/Popup";
// import { Card, CardContent } from "../components/ui/Card";
// import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Logo from "../assets/logo-light.svg";
import { requestJoinTeam } from "../apis/team";

export default function JoinTeam() {
  const [form, setForm] = useState({
    team_code: "",
  });

  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ visible: false, type: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleJoinTeam = async (e) => {
    e.preventDefault();
    if (!form.team_code) {
      setPopup({
        visible: true,
        type: "error",
        message: "Please fill in all fields!",
      });
      return;
    }
    try {
      setLoading(true);
      const response = await requestJoinTeam(form);

      if (response?.data?.success) {
        setPopup({
          visible: true,
          type: "success",
          message: "User successfully sent request!",
        });
        // TODO: redirect to login or select team page
      } else {
        setPopup({
          visible: true,
          type: "error",
          message: response?.data?.message || "Something went wrong",
        });
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Failed to join team";
      setPopup({ visible: true, type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#111929] to-[#788AFF] px-4">
      <div className="w-full justify-center max-w-3xl p-10 bg-white rounded-[32px] shadow-lg">
        <img src={Logo} alt="Case Logo" className="w-36 mb-4 mx-auto" />
        <h2 className="text-center text-xl font-semibold text-primary mb-10">
          Test, Track, and Triumph!!
        </h2>
        <h2 className="text-2xl font-bold text-black text-center">
          Become a teammate!
        </h2>
        <form className="space-y-4" onSubmit={handleJoinTeam}>
          <div className="gap-4 mt-4 mb-10">
            <div className="flex justify-center">
              <Input
                type="text"
                name="team_code"
                placeholder="type your team code here.."
                value={form.team_code}
                onChange={handleChange}
                className="border border-orange focus:ring-0 focus:border-orange w-auto max-w-sm"
              />
            </div>
            <div>
              <Button
                type="submit"
                className="bg-orange hover:bg-lightOrange text-white mt-4 mx-auto flex"
              >
                Join Team
              </Button>
            </div>
          </div>
        </form>

        <p className="text-sm text-center mt-4">
          Back to{" "}
          <Link
            to="/select-action"
            className="text-primary font-medium hover:underline"
          >
            Select Option
          </Link>
        </p>
        <p className="text-xs text-gray-400 text-center mt-6">
          © 2025 by TestingWithAnisa
        </p>
      </div>
      {/* </div> */}
      {popup.visible && (
        <>
          {console.log("popup.type =>", popup.type)}
          <Popup
            type={popup.type}
            message={popup.message}
            onClose={() => setPopup({ visible: false, type: "", message: "" })}
          />
        </>
      )}
    </div>
  );
}
