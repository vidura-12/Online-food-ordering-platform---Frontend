import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function RestaurantsList({ onSelectRestaurant, selectedRestaurant }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({}); // Track image load failures

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/Restaurant/get-all-restaurants",
        { headers }
      );
      setRestaurants(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      Swal.fire("Error", "Failed to fetch restaurants", "error");
      setLoading(false);
    }
  };
  const handleApproveToggle = async (restaurant) => {
    try {
      // Create the complete update object
      const updatedRestaurant = {
        restaurantId: restaurant.restaurantId, // Include ID if needed
        name: restaurant.name,
        description: restaurant.description,
        address: restaurant.address,
        phoneNumber: restaurant.phoneNumber,
        email: restaurant.email || "default@example.com", // Required field
        openingTime: restaurant.openingTime,
        closingTime: restaurant.closingTime,
        ImageUrl: restaurant.imageUrl || "", // Note exact case matching
        isAvailable: restaurant.isAvailable,
        isApproved: !restaurant.isApproved,
        ownerId: restaurant.ownerId, // Required
        categoryId: restaurant.categoryId, // Required
        // Include any other fields your backend expects
      };
  
      console.log("Update payload:", updatedRestaurant);
  
      const response = await axios.put(
        `http://localhost:8080/api/Restaurant/update-restaurant/${restaurant.restaurantId}`,
        updatedRestaurant,
        { headers }
      );
  
      console.log("Update response:", response.data);
      
      // Force a complete refresh
      await fetchRestaurants();
      
 
    } catch (error) {
      console.error("Full error:", error);
      console.error("Error response:", error.response?.data);
      
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Update failed silently",
        icon: "error"
      });
    }
  };
  const handleDelete = async (restaurantId) => {
    const confirm = await Swal.fire({
      title: "Delete this restaurant?",
      text: "This cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#d33",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(
          `http://localhost:8080/api/Restaurant/delete-restaurant/${restaurantId}`,
          { headers }
        );
        Swal.fire("Deleted!", "Restaurant removed successfully.", "success");
        fetchRestaurants();
        if (selectedRestaurant?.restaurantId === restaurantId) {
          onSelectRestaurant(null);
        }
      } catch (err) {
        Swal.fire("Error", "Failed to delete restaurant.", "error");
      }
    }
  };

  if (loading) return <div className="text-center py-8">Loading restaurants...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Restaurants</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {restaurants.map((restaurant) => {
          const showFallback = imageErrors[restaurant.restaurantId];

          return (
            <div
              key={restaurant.restaurantId}
              className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
                selectedRestaurant?.restaurantId === restaurant.restaurantId
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 hover:border-orange-300"
              }`}
              onClick={() => onSelectRestaurant(restaurant)}
            >
              <div className="h-48 bg-gray-100 overflow-hidden relative">
                {!showFallback && restaurant.imageUrl ? (
                  <img
                    src={restaurant.imageUrl}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                    onError={() =>
                      setImageErrors((prev) => ({
                        ...prev,
                        [restaurant.restaurantId]: true,
                      }))
                    }
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-500">No Image Available</span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg">{restaurant.name}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      restaurant.isApproved
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {restaurant.isApproved ? "Approved" : "Pending"}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {restaurant.description}
                </p>

                <div className="mt-2">
                  <p className="text-sm text-gray-500 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {restaurant.address}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApproveToggle(restaurant);
                      }}
                      className={`text-xs px-3 py-1 rounded ${
                        restaurant.isApproved
                          ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                          : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                      }`}
                    >
                      {restaurant.isApproved ? "Unapprove" : "Approve"}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(restaurant.restaurantId);
                      }}
                      className="text-xs px-3 py-1 rounded bg-red-100 text-red-800 hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                  <span className="text-xs text-gray-500">
                    {restaurant.openingTime} - {restaurant.closingTime}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
