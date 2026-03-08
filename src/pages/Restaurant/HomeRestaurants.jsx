import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Sidebar from '../../components/layout/SidebarRestaurants';
import Topbar from '../../components/layout/TopbarRestaurants';
import { Outlet } from 'react-router-dom';

export default function RestaurantHome() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first.");
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
