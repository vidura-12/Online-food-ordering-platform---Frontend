import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import jwtDecode from 'jwt-decode';
import 'react-toastify/dist/ReactToastify.css';

import Sidebar from '../../layouts/AdminLayout';
import Topbar from '../../components/layout/TopbarRestaurants';
import { Outlet } from 'react-router-dom';

export default function HomeAdmin() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first.");
      navigate("/auth/login/restaurant-manager");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== "Admin") {
        toast.error("Access denied. Admins only.");
        navigate("/auth/login/restaurant-manager");
      }
    } catch (error) {
      toast.error("Invalid token. Please login again.");
      localStorage.removeItem("token");
      navigate("/auth/login/restaurant-manager");
    }
  }, [navigate]);

  return (
    <>
      <ToastContainer />
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-col flex-1 bg-gray-100">
          <Topbar />
          <div className="p-6 flex-1 overflow-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
