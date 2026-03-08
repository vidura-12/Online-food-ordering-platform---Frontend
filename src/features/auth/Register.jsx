import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Swal from "sweetalert2";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    id: 1
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showErrorAlert = (message) => {
    Swal.fire({
      icon: 'error',
      title: 'Registration Failed',
      text: message,
      confirmButtonColor: '#27548A',
    });
  };

  const showSuccessAlert = () => {
    Swal.fire({
      icon: 'success',
      title: 'Registration Successful!',
      text: 'You can now login with your credentials',
      confirmButtonColor: '#27548A',
    }).then(() => {
      navigate("/login");
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      showErrorAlert("Passwords do not match");
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      showErrorAlert("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password,
          id: formData.id
        }),
      });
      
      const text = await response.text();
      
      if (response.ok) {
        showSuccessAlert();
      } else {
        try {
          const data = JSON.parse(text);
          showErrorAlert(data.message || "Registration failed");
        } catch {
          showErrorAlert(text || "Registration failed");
        }
      }
    } catch (err) {
      showErrorAlert(err.message || "Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('/src/assets/img/background-1591228.jpg')",
      }}
    >
      {/* Background overlay */}
      <div 
        className="absolute inset-0 bg-[#3E3F5B] opacity-90 backdrop-blur-md"
        style={{
          background: "linear-gradient(to bottom right, rgba(62, 63, 91, 0.9), rgba(138, 178, 166, 0.2))",
        }}
      ></div>
      
      {/* Register form container */}
      <div className="relative bg-[#F6F1DE] rounded-2xl p-8 w-full max-w-md shadow-xl z-40 transition-all hover:shadow-lg">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 rounded-xl shadow-md backdrop-blur-sm">
            <img
              src="src/assets/img/food ordering and delivery platform (2).png"
              alt="Logo"
              className="w-28 h-28 object-contain rounded-lg"
            />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center text-[#3E3F5B] mb-6 tracking-tight">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#3E3F5B]/80 mb-2">
                First Name
              </label>
              <input
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white text-[#3E3F5B] outline-none transition placeholder:text-[#3E3F5B]/60 focus:ring-2 focus:ring-[#8AB2A6]/50"
                placeholder="First Name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#3E3F5B]/80 mb-2">
                Last Name
              </label>
              <input
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white text-[#3E3F5B] outline-none transition placeholder:text-[#3E3F5B]/60 focus:ring-2 focus:ring-[#8AB2A6]/50"
                placeholder="Last Name"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#3E3F5B]/80 mb-2">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-white text-[#3E3F5B] outline-none transition placeholder:text-[#3E3F5B]/60 focus:ring-2 focus:ring-[#8AB2A6]/50"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#3E3F5B]/80 mb-2">
              Phone Number
            </label>
            <input
              name="phoneNumber"
              type="text"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-white text-[#3E3F5B] outline-none transition placeholder:text-[#3E3F5B]/60 focus:ring-2 focus:ring-[#8AB2A6]/50"
              placeholder="Phone Number"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#3E3F5B]/80 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white text-[#3E3F5B] outline-none transition placeholder:text-[#3E3F5B]/60 focus:ring-2 focus:ring-[#8AB2A6]/50 pr-12"
                placeholder="Enter your password"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <button
                  type="button"
                  className="text-[#3E3F5B]/50 hover:text-[#3E3F5B] transition"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#3E3F5B]/80 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white text-[#3E3F5B] outline-none transition placeholder:text-[#3E3F5B]/60 focus:ring-2 focus:ring-[#8AB2A6]/50 pr-12"
                placeholder="Confirm your password"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <button
                  type="button"
                  className="text-[#3E3F5B]/50 hover:text-[#3E3F5B] transition"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: '#27548A',
              color: 'white',
            }}
            className={`w-full py-3 rounded-lg font-medium hover:bg-[#ACD3A8] transition-all shadow-md hover:shadow-[#8AB2A6]/30 mt-4 focus:ring-2 focus:ring-[#8AB2A6]/50 focus:outline-none ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering...
              </span>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-[#3E3F5B]/60">
            Already have an account?{" "}
            <button
              type="button"
              className="text-[#8AB2A6] hover:text-[#ACD3A8] transition font-medium"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;