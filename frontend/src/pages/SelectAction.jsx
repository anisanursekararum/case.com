import { useState } from "react";
import { Button } from "../components/ui/Button";
import Popup from "../components/ui/Popup";
// import { Card, CardContent } from "../components/ui/Card";
// import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Logo from "../assets/logo-light.svg";

export default function SelectAction() {
  // const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ visible: false, type: "", message: "" });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#111929] to-[#788AFF] px-4">
      <div className="w-full max-w-3xl p-10 bg-white rounded-[32px] shadow-lg">
        <img src={Logo} alt="Case Logo" className="w-36 mb-4 mx-auto" />
        <h2 className="text-center text-xl font-semibold text-primary mb-10">
          Test, Track, and Triumph!!
        </h2>
        <h2 className="text-2xl font-bold text-black text-center">
          What do you want to do?
        </h2>
        <div className="flex justify-center gap-4 mt-4 mb-10">
          <Button
            type="submit"
            className="bg-primary hover:bg-blue-600 text-white mt-4"
          >
            <Link to="/create-team">Create Team</Link>
          </Button>
          <Button
            type="submit"
            className="bg-orange hover:bg-lightOrange text-white mt-4"
          >
            <Link to="/join-team">Join Team</Link>
          </Button>
        </div>
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
