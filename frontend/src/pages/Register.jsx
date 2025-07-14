import { useState } from "react";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import Popup from "../components/ui/Popup";
// import { Card, CardContent } from "../components/ui/Card";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo-light.svg";
import ImageCard from "../assets/image-card.svg";
import { register } from "../apis/auth";

export default function Register() {
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ visible: false, type: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmitRegister = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setPopup({
        visible: true,
        type: "error",
        message: "Please fill in all fields!",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await register(form);
      const data = res.data;

      if (data.success && data.token) {
        setToken(data.token); 
        localStorage.setItem("token", data.token); 

        setPopup({
          visible: true,
          type: "success",
          message: "User successfully registered!",
        });

        setTimeout(() => {
          navigate("/select-action");
        }, 1000);
      } else {
        setPopup({
          visible: true,
          type: "error",
          message: data.message || "Something went wrong",
        });
      }
    } catch (error) {
      setPopup({
        visible: true,
        type: "error",
        message:
          error?.response?.data?.message || error.message || "Register failed",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#111929] to-[#788AFF] px-4">
      <div className="flex w-full max-w-5xl bg-white rounded-[32px] overflow-hidden shadow-lg">
        {/* Left Side */}
        <div className="w-1/2 bg-[#F7F8FD] flex flex-col justify-center items-center p-10">
          <img src={Logo} alt="Case Logo" className="w-36 mb-4" />
          <h2 className="text-xl font-bold text-primary mb-2">
            Test, Track, and Triumph!!
          </h2>
          <img
            src={ImageCard}
            alt="Team Illustration"
            className="w-full max-w-sm mt-4"
          />
        </div>

        {/* Right Side - Form */}
        <div className="w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-orange text-center">
            Create your account here
          </h2>
          <h3 className="text-xl font-bold mt-1 text-primary text-center">
            Welcome to{" "}
            <span className="text-black font-bold">
              Case<span className="text-orange font-bold">.com</span>
            </span>
          </h3>
          <p className="text-primary mt-1 mb-6 font-bold text-center">
            Test, Track, and Triumph!!
          </p>

          <form className="space-y-4" onSubmit={handleSubmitRegister}>
            <div>
              <label className="text-sm font-medium text-primary">Name</label>
              <Input
                type="text"
                name="name"
                placeholder="type your name here.."
                value={form.name}
                onChange={handleChange}
                className="mt-1 border border-primary focus:ring-0 focus:border-primary"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-primary">Email</label>
              <Input
                type="email"
                name="email"
                placeholder="type your email here.."
                value={form.email}
                onChange={handleChange}
                className="mt-1 border border-primary focus:ring-0 focus:border-primary"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-primary">
                Password
              </label>
              <Input
                type="password"
                name="password"
                placeholder="type your password here.."
                value={form.password}
                onChange={handleChange}
                className="mt-1 border border-primary focus:ring-0 focus:border-primary"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-blue-700 text-white mt-4"
            >
              Register
            </Button>
          </form>

          <p className="text-sm text-center mt-4">
            Have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-medium hover:underline"
            >
              Login
            </Link>
          </p>

          <p className="text-xs text-gray-400 text-center mt-6">
            © 2025 by TestingWithAnisa
          </p>
        </div>
      </div>
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
