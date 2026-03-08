import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { login } from "../../services/authService";
import logo from "../../assets/img/logo1.png";
import bgImage from "../../assets/img/12.png"
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Random food image from Unsplash (different each time)
  const unsplashImage =
    "../../assets/img/12.png"
  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ email, password });
      localStorage.setItem("token", response.token);
      localStorage.setItem("restaurantId", response.restaurantId);
      localStorage.setItem("role", response.role);

      if (rememberMe) {
        localStorage.setItem("savedEmail", email);
      } else {
        localStorage.removeItem("savedEmail");
      }
      if (response.role === "RestaurantOwner") {
        navigate("/restaurant/dashboard");
      } else {
        setError("Invalid credentials");
        Swal.fire("Error", "Invalid credentials", "error");
      }
    } catch (err) {
      setError("Invalid credentials");
      Swal.fire("Error", "Invalid credentials", "error");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left side - Image with reduced brightness */}
      <div
        className="hidden md:flex md:w-1/2 relative items-center justify-center p-12 text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-2xl z-10 px-10 py-16">
          <h1 className="text-6xl mb-8 leading-tight">
            Welcome to <span className="font-bold">Deliveroo{" "}
            <span className="italic text-3xl">FOOD</span></span>
          </h1>
          <p className="text-xl mb-10 leading-relaxed">
            Deliveroo FOOD is an online food ordering and delivery platform that
            connects customers with a wide range of restaurants. It offers a
            seamless ordering experience, fast deliveries, and a variety of
            cuisines to satisfy every craving. 🚀🍔🍕
          </p>
          <div className="flex space-x-4 mt-12">
            <div className="w-16 h-1.5 bg-white"></div>
            <div className="w-10 h-1.5 bg-white"></div>
            <div className="w-6 h-1.5 bg-white"></div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl border border-gray-100">
          <img src={logo} alt="Logo" className="mx-auto w-32 mb-8" />

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              />
            </div>
            <div className="mb-6">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              />
            </div>
            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2 h-4 w-4 text-gray-800 border-gray-300 rounded focus:ring-gray-800"
              />
              <label htmlFor="rememberMe" className="text-sm text-gray-600">
                Remember me
              </label>
            </div>
            <button
              type="submit"
              className="w-full p-3 bg-gray-900 text-white font-bold rounded-md hover:bg-gray-800 transition duration-200 shadow-md"
            >
              LOGIN
            </button>
          </form>

          <div className="text-center mt-6 text-sm">
            <a
              href="/forgot-password"
              className="text-gray-600 hover:text-gray-800 hover:underline"
            >
              Forgot password?
            </a>
          </div>

          <div className="text-center mt-4 text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="/restaurant/restaurant-manager/register"
              className="text-gray-800 font-medium hover:underline"
            >
              Sign Up
            </a>
          </div>
        </div>

        <footer className="mt-8 text-sm text-gray-400">
          © {new Date().getFullYear()} Deliveroo FOOD. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default LoginPage;
