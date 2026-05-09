import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Products from "./pages/Product";
import Register from "./pages/Register";
import Product_Details from "./pages/Product_Details";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import { AuthProvider } from "./context/AuthProvider";
import { PrivateRoute } from "./context/PrivateRoute";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/products" element={<Products />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product/:id" element={<Product_Details />} />
            <Route
              path="/cart"
              element={
                <PrivateRoute>
                  <Cart />
                </PrivateRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}
export default App;
