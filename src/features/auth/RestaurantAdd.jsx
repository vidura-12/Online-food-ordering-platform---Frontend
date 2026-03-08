import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RestaurantAdd = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    categoryId: "",
    name: "",
    description: "",
    address: "",
    phoneNumber: "",
    email: "",
    openingTime: "",
    closingTime: "",
    isApproved: false,
    isAvailable: "true",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "RestaurantOwner") {
      Swal.fire({
        icon: "warning",
        title: "Access Denied",
        text: "You must be logged in as a Restaurant Manager!",
        confirmButtonText: "Go to Login",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/auth/login/restaurant-manager");
        }
      });
    }
  }, [navigate]);

  useEffect(() => {
    fetch("http://localhost:8080/api/Restaurant/get-restaurants/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Failed to load categories",
          text: "Try again later.",
        });
      });
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:8080/api/Restaurant/add-restaurant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        ...formData,
        isAvailable: formData.isAvailable === "true",
      }),
    })
      .then(async (res) => {
        const contentType = res.headers.get("content-type");
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || "Failed to add restaurant");
        }
        return contentType && contentType.includes("application/json") ? res.json() : {};
      })
      .then(() => {
        toast.success("🎉 Restaurant added successfully!");
        setTimeout(() => navigate("auth/login/restaurant-manager"), 2000);
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.message || "Could not add restaurant. Try again.",
        });
      });
  };

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-black text-white">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Left Hero Section */}
      <div
        className="hidden md:block md:w-1/2 relative bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1661529515567-dcb300f41da5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        <div className="relative z-10 h-full flex flex-col justify-center p-10 text-white">
          <h1 className="text-5xl font-bold mb-6 leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Ready to <span className="text-[#FF5823]">Serve</span>?
          </h1>
          <p className="text-lg leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]">
            List your restaurant on{" "}
            <span className="text-[#FF5823] font-semibold">Deliveroo FOOD</span>{" "}
            and join the fastest-growing food delivery platform. Connect with
            food lovers and boost your business visibility 🍜📈🚀
          </p>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="w-full md:w-1/2 bg-white text-black p-10 flex items-center justify-center">
        <div className="w-full max-w-xl">
          <h2 className="text-3xl font-bold text-center mb-8 text-[#FF5823]">
            Add Your Restaurant
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Category */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">Category</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5823]"
                required
              >
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            </div>

            {/* Text Inputs */}
            {[
              { label: "Restaurant Name", name: "name", type: "text" },
              { label: "Description", name: "description", type: "textarea" },
              { label: "Address", name: "address", type: "text" },
              { label: "Phone Number", name: "phoneNumber", type: "tel" },
              { label: "Email", name: "email", type: "email" },
            ].map(({ label, name, type }) => (
              <div key={name}>
                <label className="block font-medium text-gray-700 mb-1">{label}</label>
                {type === "textarea" ? (
                  <textarea
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5823]"
                    required
                  ></textarea>
                ) : (
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5823]"
                    required
                  />
                )}
              </div>
            ))}

            {/* Time Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-gray-700 mb-1">Opening Time</label>
                <input
                  type="time"
                  name="openingTime"
                  value={formData.openingTime}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5823]"
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">Closing Time</label>
                <input
                  type="time"
                  name="closingTime"
                  value={formData.closingTime}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5823]"
                  required
                />
              </div>
            </div>

            {/* Availability */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">Is Available</label>
              <select
                name="isAvailable"
                value={formData.isAvailable}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5823]"
                required
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full p-3 bg-gray-900 text-white font-bold rounded-md hover:bg-gray-800 transition duration-200 shadow-md"
            >
              Submit Restaurant
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RestaurantAdd;
