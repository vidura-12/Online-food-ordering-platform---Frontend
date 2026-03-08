import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaClock,
  FaMapMarkerAlt,
  FaSearch,
  FaFilter,
  FaStar,
  FaUtensils,
  FaMotorcycle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import NavBar from "../../components/common/headerlanding";
import Footer from "../../components/common/footerLanding";

const Restaurant = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("name");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openingTimeFilter, setOpeningTimeFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized: Please log in to view restaurants.");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:8080/api/Restaurant/get-all-restaurants",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401) {
          setError(
            "Unauthorized: Invalid or expired token. Please log in again."
          );
          return;
        }

        const data = await response.json();
        setRestaurants(data);
        setFilteredRestaurants(data.filter((r) => r.isApproved));
      } catch (err) {
        setError("Error fetching restaurants. Please try again later.");
        console.error("Error fetching restaurants:", err);
      }
    };

    fetchRestaurants();
  }, []);

  useEffect(() => {
    let results = restaurants.filter(
      (restaurant) =>
        restaurant.isApproved &&
        (restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          restaurant.address.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (openingTimeFilter) {
      results = results.filter(
        (r) =>
          r.openingTime <= openingTimeFilter &&
          r.closingTime >= openingTimeFilter
      );
    }

    // Sorting
    results.sort((a, b) => {
      if (sortOption === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortOption === "openingTime") {
        return a.openingTime.localeCompare(b.openingTime);
      }
      return 0;
    });

    setFilteredRestaurants(results);
  }, [searchTerm, sortOption, openingTimeFilter, restaurants]);

  if (error) {
    return (
      <>
        <NavBar />
        <div className="p-6 text-center">
          <h1 className="text-xl font-medium text-gray-800">{error}</h1>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Discover Restaurants
        </h2>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or location..."
              className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
            >
              <FaFilter className="text-orange-500" />
              <span className="font-medium">Filters</span>
            </motion.button>

            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-10"
                >
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort by
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                    >
                      <option value="name">Name (A-Z)</option>
                      <option value="openingTime">Opening Time</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currently Open
                    </label>
                    <input
                      type="time"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                      value={openingTimeFilter}
                      onChange={(e) => setOpeningTimeFilter(e.target.value)}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Restaurant List */}
        <div className="mb-12">
          {filteredRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <motion.div
                  key={restaurant.restaurantId}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
                  onClick={() =>
                    navigate(`/cart`, { 
                      state: { 
                        restaurantId: restaurant.restaurantId,
                        restaurantData: restaurant // Optional: pass the whole restaurant object if needed
                      } 
                    })
                  }
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={
                        restaurant.imageUrl ||
                        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1470&q=80"
                      }
                      alt={restaurant.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute bottom-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-semibold flex items-center">
                      <FaStar className="mr-1" /> 4.5
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-800 mb-1 truncate">
                      {restaurant.name}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <FaMapMarkerAlt className="mr-2 text-orange-500" />
                      <span className="truncate">{restaurant.address}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <FaClock className="mr-2 text-orange-500" />
                      <span>
                        {restaurant.openingTime} - {restaurant.closingTime}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span className="flex items-center">
                        <FaUtensils className="mr-1" /> Italian
                      </span>
                      <span className="flex items-center">
                        <FaMotorcycle className="mr-1" /> Delivery
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-gray-400 text-5xl mb-4">🍽️</div>
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                No restaurants found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filters
              </p>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Restaurant;
