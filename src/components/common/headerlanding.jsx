import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Link } from 'react-router-dom';
const MySwal = withReactContent(Swal);

const Navbar = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isBlurred, setIsBlurred] = useState(false);

  // Add/remove blur class to body when isBlurred changes
  useEffect(() => {
    if (isBlurred) {
      document.body.classList.add("blur-active");
    } else {
      document.body.classList.remove("blur-active");
    }
  }, [isBlurred]);

  const handleLogout = () => {
    setIsBlurred(true);
    
    MySwal.fire({
      title: <span style={{ color: '#fff' }}>Ready to Leave?</span>,
      html: <span style={{ color: '#aaa' }}>Confirm to end your current session.</span>,
      icon: 'question',
      background: 'rgba(20, 20, 25, 0.98)',
      backdrop: `
        rgba(5,5,5,0.73)
        url("/images/nyan-cat.gif")
        left top
        no-repeat
      `,
      showCancelButton: true,
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'No, stay',
      confirmButtonColor: 'rgba(255,88,35,1)',
      cancelButtonColor: 'rgba(100,100,100,0.5)',
      customClass: {
        popup: 'sweet-alert-popup',
        title: 'sweet-alert-title',
        htmlContainer: 'sweet-alert-html',
        confirmButton: 'sweet-alert-confirm-btn',
        cancelButton: 'sweet-alert-cancel-btn'
      },
      showClass: {
        popup: 'swal2-show',
        backdrop: 'swal2-backdrop-show',
        icon: 'swal2-icon-show'
      },
      hideClass: {
        popup: 'swal2-hide',
        backdrop: 'swal2-backdrop-hide',
        icon: 'swal2-icon-hide'
      },
      willOpen: () => {
        document.querySelector('.swal2-popup').style.boxShadow = '0 0 30px rgba(255,88,35,0.5)';
      }
    }).then((result) => {
      setIsBlurred(false);
      
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        setToken(null);
        
        MySwal.fire({
          title: <span style={{ color: '#fff' }}>Logged Out!</span>,
          html: <span style={{ color: '#aaa' }}>You have been successfully signed out.</span>,
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          background: 'rgba(20, 20, 25, 0.98)',
          willOpen: () => {
            document.querySelector('.swal2-popup').style.boxShadow = '0 0 30px rgba(0,200,150,0.5)';
          }
        }).then(() => {
          navigate("/");
        });
      }
    });
  };

  return (
    <>
      <nav
        className={`flex justify-between items-center px-9 py-6 text-white sticky top-0 z-50 mx-4 my-2 rounded-xl shadow-lg backdrop-blur-md transition-all duration-300 ${isBlurred ? 'opacity-80' : 'opacity-100'}`}
        style={{ backgroundColor: "rgba(20, 20, 20, 0.9)" }}
      >
        <div className="text-2xl font-normal tracking-tight">
  <Link to="/order/restaurant" className="hover:text-blue-500">
    Deliveroo <span className="font-bold" style={{ color: "rgba(255,88,35,1)" }}>FOOD</span>
  </Link>
</div>

        <div className="flex space-x-4">
          {!token ? (
            <>
              <button
                onClick={() => navigate("/order/login")}
                className="px-5 py-2 text-gray-100 hover:text-white font-medium rounded-full transition-all duration-300 hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/order/signup")}
                className="px-6 py-2 text-white font-medium rounded-full hover:bg-yellow-500 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
                style={{ backgroundColor: "rgba(255,88,35,1)" }}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/User/profile")}
                className="px-6 py-2 text-white font-medium rounded-full bg-indigo-500 hover:bg-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-2 text-white font-medium rounded-full bg-red-500 hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
      
      {/* Add global styles for the blur effect */}
      <style jsx global>{`
        .blur-active {
          overflow: hidden;
        }
        .blur-active > *:not(.swal2-container):not(nav) {
          filter: blur(5px) brightness(0.7);
          transition: filter 0.3s ease;
          pointer-events: none;
        }
        .sweet-alert-popup {
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 16px !important;
        }
        .sweet-alert-title {
          font-family: 'Inter', sans-serif !important;
          font-weight: 600 !important;
          letter-spacing: 0.5px !important;
        }
        .sweet-alert-html {
          font-family: 'Inter', sans-serif !important;
          font-weight: 400 !important;
        }
        .sweet-alert-confirm-btn {
          font-weight: 500 !important;
          letter-spacing: 0.5px !important;
          transition: all 0.2s ease !important;
        }
        .sweet-alert-confirm-btn:hover {
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 8px rgba(255, 88, 35, 0.3) !important;
        }
        .sweet-alert-cancel-btn {
          font-weight: 500 !important;
          letter-spacing: 0.5px !important;
          transition: all 0.2s ease !important;
        }
        .sweet-alert-cancel-btn:hover {
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 8px rgba(100, 100, 100, 0.3) !important;
        }
      `}</style>
    </>
  );
};

export default Navbar;