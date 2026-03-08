// MenuItemsList.js
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function MenuItemsList({ restaurantId, menuId }) {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    if (restaurantId && menuId) {
      fetchMenuItems();
    }
  }, [restaurantId, menuId]);

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/restaurant/menu/MenuItems/${restaurantId}/menus/${menuId}/items`,
        { headers }
      );
      setMenuItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      Swal.fire("Error", "Failed to fetch menu items", "error");
      setLoading(false);
    }
  };

  const handleApproveToggle = async (item) => {
    try {
      await axios.put(
        `http://localhost:8080/api/restaurant/menu/menuitems/${restaurantId}/menus/${menuId}/items/${item.menuItemId}`,
        {
          ...item,
          isApproved: !item.isApproved
        },
        { headers }
      );
      fetchMenuItems();
      Swal.fire("Success", "Menu item approval status updated", "success");
    } catch (error) {
      console.error("Error updating menu item:", error);
      Swal.fire("Error", "Failed to update menu item", "error");
    }
  };

  const handleDelete = async (menuItemId) => {
    const confirm = await Swal.fire({
      title: "Delete this menu item?",
      text: "This cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#d33",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(
          `http://localhost:8080/api/restaurant/menu/menuitems/${restaurantId}/menus/${menuId}/items/${menuItemId}`,
          { headers }
        );
        Swal.fire("Deleted!", "Menu item removed successfully.", "success");
        fetchMenuItems();
      } catch (err) {
        Swal.fire("Error", "Failed to delete menu item.", "error");
      }
    }
  };

  if (loading) return <div>Loading menu items...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow mt-6">
      <h2 className="text-2xl font-semibold mb-4">Menu Items</h2>
      {menuItems.length === 0 ? (
        <p className="text-gray-500">No items available for this menu.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <div
              key={item.menuItemId}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg">{item.name}</h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    item.isApproved
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {item.isApproved ? "Approved" : "Pending"}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
              <div className="mt-2">
                <img
                  src={item.imageUrl || "https://via.placeholder.com/150"}
                  alt={item.name}
                  className="w-full h-32 object-cover rounded"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150";
                  }}
                />
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="font-bold text-orange-600">
                  ${item.price.toFixed(2)}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    item.isAvailable
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {item.isAvailable ? "Available" : "Unavailable"}
                </span>
              </div>
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => handleApproveToggle(item)}
                  className={`text-xs px-3 py-1 rounded flex-1 ${
                    item.isApproved
                      ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                  }`}
                >
                  {item.isApproved ? "Unapprove" : "Approve"}
                </button>
                <button
                  onClick={() => handleDelete(item.menuItemId)}
                  className="text-xs px-3 py-1 rounded bg-red-100 text-red-800 hover:bg-red-200 flex-1"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}