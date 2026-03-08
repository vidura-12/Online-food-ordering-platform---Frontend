import React from "react";
import { FaSearch } from "react-icons/fa";
import CitiesNearMe from "../components/common/CitiesNearMe ";
import { useNavigate } from "react-router-dom";
import CookieConsent from "../components/common/Cookie";
import NavBar from "../components/common/headerlanding";
import Footer from "../components/common/footerLanding";
import PromoRibbon from "../components/common/PromoRibbon";
import Card from "../components/common/Card";

const DeliverooLanding = () => {
  const navigate = useNavigate();

  return (
    <div className="font-sans">
      <NavBar />

      <div
        className="relative h-screen bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')",
        }}
      >
        {/* NavBar inside hero image */}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        {/* Hero content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-white px-8 max-w-4xl mx-auto w-full text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Order delivery near you
            </h1>
            <div className="flex flex-col md:flex-row gap-2">
              <div className="relative flex-grow">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter delivery address"
                  className="w-full py-4 pl-10 pr-4 rounded-lg text-gray-800 focus:outline-none"
                />
              </div>
              <button
                className="px-6 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-black transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700"
                onClick={() => navigate("/search")}
              >
                Find Food
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of the content */}
      <br></br>
      <PromoRibbon />
      <Card />
      <CitiesNearMe />
      <Footer />
      <CookieConsent />
    </div>
  );
};

export default DeliverooLanding;
