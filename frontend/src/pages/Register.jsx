import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../api/base";

const inputClasses =
  "w-full h-10 rounded-md border border-gray-400 px-3 text-sm outline-none focus:border-[#132b67] focus:ring-2 focus:ring-[#132b67]/20";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getErrorMessage = (errorData) => {
    if (!errorData) return "Registration failed. Please try again.";
    if (typeof errorData === "string") return errorData;

    const firstError = Object.values(errorData)[0];
    if (Array.isArray(firstError)) return firstError[0];
    if (typeof firstError === "string") return firstError;

    return "Registration failed. Please check your details.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post(`${BASE_URL}/register/`, {
        username: form.username,
        email: form.email,
        password: form.password,
      });

      navigate("/login", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err.response?.data));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-start justify-center bg-[#f3f3f3] pt-20 px-4">
      <div className="w-full max-w-sm rounded-lg bg-white shadow-md px-6 py-6">
        {/* Title */}
        <h1 className="text-3xl font-extrabold text-[#132b67] mb-6">Sign Up</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
              {error}
            </p>
          )}

          {/* Username */}
          <div>
            <label className="block text-xs font-semibold mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={inputClasses}
              required
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
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-10 rounded-md bg-[#132b67] text-white text-sm font-semibold hover:bg-[#0f2558] transition disabled:cursor-not-allowed disabled:bg-[#132b67]/70"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Footer text */}
        <p className="text-xs text-[#132b67] mt-5 font-semibold">
          I already had an account.
          <Link to="/login"> Sign In Here </Link>
        </p>
      </div>
    </div>
  );
}
