import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

const Header = () => {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <header className="flex justify-around items-center px-8 py-4 shadow-md">
      <Link to="/">
        <div>
          <span>Rivanshop</span>
        </div>
      </Link>

      <div className="flex items-center space-x-3">
        <nav className="flex items-center space-x-6 text-sm">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/">Team</Link>
        </nav>

        <div className="flex gap-3 items-center">
          {isAuthenticated ? (
            <>
              <Link to="/cart" className="text-primary text-lg">
                <svg
                  aria-label="Cart"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 2-1.6L23 6H6" />
                </svg>
              </Link>
              <Link to="/profile" className="text-primary text-lg">
                <svg
                  aria-label="Profile"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21a8 8 0 0 0-16 0" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="border text-primary border-primary px-4 py-1 rounded-full text-sm"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-primary text-white px-4 py-1 rounded-full text-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
