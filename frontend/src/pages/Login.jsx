import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

const inputClasses =
  "w-full h-10 rounded-md border border-gray-400 px-3 text-sm outline-none focus:border-[#132b67] focus:ring-2 focus:ring-[#132b67]/20";

export default function Login() {
  const { setIsAuthenticated } = useContext(AuthContext);
  const nav = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/token/", {
        username: form.username,
        password: form.password,
      });
      setIsAuthenticated(true);
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      if (localStorage.getItem("access_token")) {
        nav("/Profile", { replace: true });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
    console.log(form);
  };

  return (
    <div className="flex min-h-screen items-start justify-center bg-[#f3f3f3] pt-20 px-4">
      <div className="w-full max-w-sm rounded-lg bg-white shadow-md px-6 py-6">
        {/* Title */}
        <h1 className="text-3xl font-extrabold text-[#132b67] mb-6">Sign In</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-xs font-semibold mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full h-10 rounded-md bg-[#132b67] text-white text-sm font-semibold hover:bg-[#0f2558] transition"
          >
            Login
          </button>
        </form>

        {/* Footer text */}
        <p className="text-xs text-[#132b67] mt-5 font-semibold">
          Don't have account yet? <br /> 
          <Link to="/register"> Register Here </Link>
        </p>
      </div>
    </div>
  );
}
