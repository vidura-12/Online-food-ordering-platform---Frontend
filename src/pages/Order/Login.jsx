import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import loginImage from "../../assets/img/12.png"; // Your login image
import { authService } from "../../services/apiOrder";

const MySwal = withReactContent(Swal);

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsBlurred(true);

    try {
      await authService.login({ email, password });

      if (rememberMe) {
        localStorage.setItem("savedEmail", email);
      } else {
        localStorage.removeItem("savedEmail");
      }

      await MySwal.fire({
        title: <span style={{ color: "#fff" }}>Login Successful</span>,
        html: <span style={{ color: "#aaa" }}>Welcome back!</span>,
        icon: "success",
        background: "rgba(20, 20, 25, 0.98)",
        backdrop: `
          rgba(5,5,5,0.73)
          url("/images/nyan-cat.gif")
          left top
          no-repeat
        `,
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
          popup: "sweet-alert-popup",
          title: "sweet-alert-title",
          htmlContainer: "sweet-alert-html",
          confirmButton: "sweet-alert-confirm-btn",
        },
        willOpen: () => {
          document.querySelector(".swal2-popup").style.boxShadow =
            "0 0 30px rgba(0,200,150,0.5)";
        },
      });

      navigate("/order/restaurant");
    } catch (err) {
      await MySwal.fire({
        title: <span style={{ color: "#fff" }}>Login Failed</span>,
        html: (
          <span style={{ color: "#aaa" }}>
            {err.response?.data?.message || "Invalid credentials"}
          </span>
        ),
        icon: "error",
        background: "rgba(20, 20, 25, 0.98)",
        backdrop: `
          rgba(5,5,5,0.73)
          url("/images/nyan-cat.gif")
          left top
          no-repeat
        `,
        confirmButtonColor: "rgba(255,88,35,1)",
        customClass: {
          popup: "sweet-alert-popup",
          title: "sweet-alert-title",
          htmlContainer: "sweet-alert-html",
          confirmButton: "sweet-alert-confirm-btn",
        },
        willOpen: () => {
          document.querySelector(".swal2-popup").style.boxShadow =
            "0 0 30px rgba(255,88,35,0.5)";
        },
      });
    } finally {
      setIsLoading(false);
      setIsBlurred(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row bg-gray-50 ${
        isBlurred ? "blur-sm" : ""
      } transition-all`}
    >
      {/* Left side - Image */}
      <div className="md:w-1/2 relative">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <img
          src={loginImage}
          alt="Food background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-center p-12 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Discover Amazing Food
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-lg">
            Join our community of food lovers and enjoy the best dining
            experience with just a few clicks.
          </p>
          <div className="flex space-x-4">
            <div className="w-12 h-1 bg-[#ff5823]"></div>
            <div className="w-8 h-1 bg-white"></div>
            <div className="w-4 h-1 bg-white"></div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="md:w-1/2 flex items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-2 bg-[#ff5823]"></div> {/* Orange accent line */}
          <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-1">
              Welcome Back
            </h2>
            <p className="text-gray-600 mb-8">Sign in to your account</p>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff5823] focus:border-transparent transition"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff5823] focus:border-transparent transition"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-[#ff5823] focus:ring-[#ff5823] border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div>
                <a
                  href="/forgot-password"
                  className="text-sm text-[#ff5823] hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full p-3 bg-gray-900 text-white font-bold rounded-md hover:bg-gray-800 transition duration-200 shadow-md"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                href="/register"
                className="font-medium text-[#ff5823] hover:underline"
              >
                Sign up
              </a>
            </div>
          </div>
          <div className="px-8 py-4 bg-gray-50 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} FoodExpress. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
