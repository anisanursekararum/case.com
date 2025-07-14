import { X } from "lucide-react";
import successIcon from "../../assets/success-icon.svg";
import errorIcon from "../../assets/error icon.svg";

export default function Popup({ type = "success", message, onClose }) {
  const icon = type === "success" ? successIcon : errorIcon;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-xl shadow-lg w-[300px] p-6 text-center relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-black"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <img
          src={icon}
          alt={type}
          className="w-12 h-12 mx-auto mb-4"
        />
        <p className="text-base font-medium mb-4">
          {message}
        </p>
        <button
          onClick={onClose}
          className={`px-4 py-2 rounded-md text-white ${
            type === "success"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          OK
        </button>
      </div>
    </div>
  );
}
