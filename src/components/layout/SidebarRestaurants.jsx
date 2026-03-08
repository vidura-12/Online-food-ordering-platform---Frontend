import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {
  FaBars,
  FaTachometerAlt,
  FaShoppingCart,
  FaUtensils,
  FaCreditCard,
  FaQuestionCircle,
  FaSignOutAlt,
} from "react-icons/fa";

const navItems = [
  { name: "Dashboard", icon: <FaTachometerAlt />, path: "." },
  { name: "Orders", icon: <FaShoppingCart />, path: "orders" },
  { name: "Menus", icon: <FaUtensils />, path: "menus" },
  { name: "Payments", icon: <FaCreditCard />, path: "payments" },
  { name: "Help", icon: <FaQuestionCircle />, path: "help" },
];
const MySwal = withReactContent(Swal);
export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth/login/restaurant-manager");
  };

  return (
    <div
      className={`bg-white text-gray-800 transition-all duration-300 border-r border-gray-200 ${
        isExpanded ? "w-64" : "w-20"
      } flex flex-col shadow-md`}
    >
      {/* Toggle Button */}
      <div className="flex justify-between items-center p-4 border-b border-gray-100">
        <span className="text-xl font-bold">{isExpanded && "Menu"}</span>
        <FaBars
          className="cursor-pointer text-2xl"
          onClick={() => setIsExpanded(!isExpanded)}
        />
      </div>

      {/* Nav Items */}
      <div className="flex-1 px-2 pt-4 space-y-3">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end
            className={({ isActive }) =>
              `flex items-center gap-4 rounded-lg px-4 py-3 text-lg font-medium transition-all duration-200 ${
                isActive
                  ? "bg-black text-white shadow-md"
                  : "hover:bg-gray-100 text-gray-700"
              }`
            }
          >
            <span className="text-2xl">{item.icon}</span>
            {isExpanded && <span>{item.name}</span>}
          </NavLink>
        ))}
      </div>

      {/* Logout */}
      <div
        onClick={handleLogout}
        className="flex items-center gap-4 px-4 py-4 mt-auto cursor-pointer text-red-600 hover:bg-red-50 transition rounded-lg mb-4 mx-2"
      >
        <FaSignOutAlt className="text-2xl" />
        {isExpanded && <span className="text-lg font-medium">Log Out</span>}
      </div>
    </div>
  );
}
