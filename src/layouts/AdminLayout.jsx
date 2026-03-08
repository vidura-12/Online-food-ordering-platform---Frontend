import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import {
  FaBars,
  FaHome,
  FaStore,
  FaThLarge,
  FaBoxes,
  FaUsers,
  FaChartBar,
  FaCog,
  FaSignOutAlt
} from "react-icons/fa";

const MySwal = withReactContent(Swal);

const AdminLayout = () => {
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const navItems = [
  
    { name: "Restaurants", icon: <FaStore />, path: "/admin/restaurants" },
   
    { name: "Users", icon: <FaUsers />, path: "/admin/users" },
    { name: "Reports", icon: <FaChartBar />, path: "/admin/reports" }
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    MySwal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out of the system',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate("/login");
      }
    });
  };

  // 🔐 Token and Role Check
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "Admin") {
      MySwal.fire({
        icon: "error",
        title: "Access Denied",
        text: "You must be an Admin to access this page!",
        confirmButtonText: "Go to Login"
      }).then(() => {
        navigate("/login");
      });
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-white text-gray-800 transition-all duration-300 border-r border-gray-200 ${
          sidebarOpen ? "w-64" : "w-20"
        } flex flex-col shadow-md fixed h-full z-10`}
      >
        {/* Toggle Button and Logo */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          {sidebarOpen ? (
            <div className="flex items-center space-x-2">
              <FaCog className="text-2xl text-indigo-600" />
              <span className="text-xl font-bold">Admin Panel</span>
            </div>
          ) : (
            <FaCog className="text-2xl text-indigo-600 mx-auto" />
          )}
          <FaBars
            className="cursor-pointer text-xl hover:text-indigo-600"
            onClick={toggleSidebar}
          />
        </div>

        {/* Nav Items */}
        <div className="flex-1 px-2 pt-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end
              className={({ isActive }) =>
                `flex items-center gap-4 rounded-lg px-4 py-3 text-lg font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md"
                    : "hover:bg-gray-100 text-gray-700"
                }`
              }
            >
              <span className="text-2xl">{item.icon}</span>
              {sidebarOpen && <span>{item.name}</span>}
            </NavLink>
          ))}
        </div>

        {/* Logout Button */}
        <div
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-4 mt-auto cursor-pointer text-red-600 hover:bg-red-50 transition rounded-lg mb-4 mx-2"
        >
          <FaSignOutAlt className="text-2xl" />
          {sidebarOpen && <span className="text-lg font-medium">Log Out</span>}
        </div>
      </div>

      {/* Main Content */}
      <main 
        className={`flex-1 overflow-auto p-6 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <div className="bg-white rounded-lg shadow-sm p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
