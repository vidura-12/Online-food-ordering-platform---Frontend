import React, { useState } from "react";
import RestaurantAdd from "./RestaurantAdd";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const RegistrationFlow = () => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [managerData, setManagerData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const handleManagerChange = (e) => {
    setManagerData({ ...managerData, [e.target.name]: e.target.value });
  };

  const nextStep = async () => {
    if (managerData.password !== managerData.confirmPassword) {
      toast.error("Passwords do not match 🚨");
      return;
    }
  
    for (let key in managerData) {
      if (!managerData[key]) {
        toast.warn(`Please fill in your ${key}`);
        return;
      }
    }
  
    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...managerData, id: "2" }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
  
        toast.success("Registration successful 🎉");
  
        // Navigate to step 2 after a short delay
        setTimeout(() => {
          setStep(2);
        }, 1500);
      } else {
        toast.error(data.message || "Registration failed ❌");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Something went wrong. Please try again later.");
    }
  };
  
  

  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <div className="w-full min-h-screen bg-black text-white flex items-center justify-center">
     <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row w-full h-screen"
          >
            {/* Left Side with Hero Text and BG */}
            <div
               className="hidden md:block md:w-1/2 relative bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1512485800893-b08ec1ea59b1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
              }}
            >
                {/* Overlay inside image box */}
  <div className="absolute inset-0 bg-black bg-opacity-70"></div>
              <div className="relative z-10 h-full flex flex-col justify-center p-10 text-white">
    <h1 className="text-5xl font-bold mb-6 leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  Welcome to <span className="text-[#FF5823]">Deliveroo <span className="italic text-3xl">FOOD</span></span>
                </h1>
                <p className="text-lg leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]">
                  Deliveroo FOOD is your food delivery superpower – browse, order, and enjoy dishes from the best
                  local restaurants. Seamless experience. Lightning-fast deliveries. Satisfaction in every bite. 🚀🍔🍕
                </p>
              </div>
            </div>

            {/* Right Side Form */}
            <div className="w-full md:w-1/2 bg-white text-black p-10 flex items-center justify-center">
              <div className="w-full max-w-md">
                <h2 className="text-3xl font-extrabold text-[#FF5823] text-center mb-8">
                  Restaurant Manager Sign Up
                </h2>

                <form className="space-y-5">
                  {[
                    { name: "firstName", placeholder: "First Name", type: "text" },
                    { name: "lastName", placeholder: "Last Name", type: "text" },
                    { name: "email", placeholder: "Email", type: "email" },
                    { name: "phoneNumber", placeholder: "Phone Number", type: "tel" },
                  ].map((field) => (
                    <input
                      key={field.name}
                      type={field.type}
                      name={field.name}
                      placeholder={field.placeholder}
                      onChange={handleManagerChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5823]"
                    />
                  ))}

                  {/* Password Fields with Visibility Toggle */}
                  {["password", "confirmPassword"].map((field) => (
                    <div className="relative" key={field}>
                      <input
                        type={showPassword ? "text" : "password"}
                        name={field}
                        placeholder={field === "confirmPassword" ? "Confirm Password" : "Password"}
                        onChange={handleManagerChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5823]"
                      />
                      <span
                        className="absolute right-3 top-3.5 cursor-pointer text-xl text-gray-500"
                        onClick={togglePassword}
                      >
                        {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                      </span>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-full bg-[#FF5823] hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition duration-300 shadow-lg text-lg"
                  >
                    Next ➡️
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.6 }}
            className="w-full p-4"
          >
            <RestaurantAdd />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RegistrationFlow;
