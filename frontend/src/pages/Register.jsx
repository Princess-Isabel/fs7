import { useState } from "react";
import { Link } from "react-router-dom";

const inputClasses =
  "w-full h-10 rounded-md border border-gray-400 px-3 text-sm outline-none focus:border-[#132b67] focus:ring-2 focus:ring-[#132b67]/20";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <div className="flex min-h-screen items-start justify-center bg-[#f3f3f3] pt-20 px-4">
      <div className="w-full max-w-sm rounded-lg bg-white shadow-md px-6 py-6">
        {/* Title */}
        <h1 className="text-3xl font-extrabold text-[#132b67] mb-6">Sign Up</h1>

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

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
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
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full h-10 rounded-md bg-[#132b67] text-white text-sm font-semibold hover:bg-[#0f2558] transition"
          >
            Register
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
