import React from "react";
import { useNavigate } from 'react-router-dom';
import { FaMotorcycle, FaStore, FaBriefcase } from "react-icons/fa";

const Card = () => {
  const navigate = useNavigate();

  const handleAddRestaurant = () => {
    navigate("auth/login/restaurant-manager");
  };

  const handleSignUpToDeliver = () => {
    navigate("/driverLogin");
  };

  const handleCreateBusinessAccount = () => {
    navigate("/create-business");
  };

  return (
    <div className="max-w-8xl mx-auto px-4 py-20">
      <h2 className="text-4xl font-bold text-center mb-20">
        More ways to use Deliveroo Food
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-14">
        {/* Card 1 */}
        <div className="group">
          <div className="relative rounded-2xl overflow-hidden shadow-xl h-96 mb-8">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
              alt="Restaurant interior"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute top-6 left-6 bg-white/80 backdrop-blur-sm w-16 h-16 rounded-full flex items-center justify-center">
              
            </div>
          </div>

          <div className="px-4">
            <h3 className="text-3xl font-bold mb-4">Your restaurant, delivered</h3>
            <p className="text-gray-600 mb-6 text-lg">
              Add your restaurant on Deliveroo Food and reach new customers.
            </p>
            <button
              onClick={handleAddRestaurant}
              className="text-black font-medium hover:underline flex items-center gap-3 text-lg"
            >
              Add your restaurant
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                   viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Card 2 */}
        <div className="group">
          <div className="relative rounded-2xl overflow-hidden shadow-xl h-96 mb-8">
            <img
              src="https://images.unsplash.com/photo-1558981852-426c6c22a060?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80"
              alt="Delivery rider"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute top-6 left-6 bg-white/80 backdrop-blur-sm w-16 h-16 rounded-full flex items-center justify-center">
            
            </div>
          </div>

          <div className="px-4">
            <h3 className="text-3xl font-bold mb-4">Deliver with Deliveroo Food</h3>
            <p className="text-gray-600 mb-6 text-lg">
              Earn money by delivering food from restaurants.
            </p>
            <button
              onClick={handleSignUpToDeliver}
              className="text-black font-medium hover:underline flex items-center gap-3 text-lg"
            >
              Sign up to deliver
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                   viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Card 3 */}
        <div className="group">
          <div className="relative rounded-2xl overflow-hidden shadow-xl h-96 mb-8">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
              alt="Business meeting"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute top-6 left-6 bg-white/80 backdrop-blur-sm w-16 h-16 rounded-full flex items-center justify-center">
             
            </div>
          </div>

          <div className="px-4">
            <h3 className="text-3xl font-bold mb-4">Feed your employees</h3>
            <p className="text-gray-600 mb-6 text-lg">
              Deliveroo Food for Business helps you feed your team.
            </p>
            <button
              onClick={handleCreateBusinessAccount}
              className="text-black font-medium hover:underline flex items-center gap-3 text-lg"
            >
              Create a business account
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                   viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
