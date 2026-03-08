import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function MenusList({ restaurantId, onSelectMenu, selectedMenu }) {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    if (restaurantId) {
      fetchMenus();
    }
  }, [restaurantId]);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8080/api/Restaurant/get-restaurant-menu/${restaurantId}`,
        { headers }
      );
      console.log(response.data);
      setMenus([...response.data]);
    } catch (error) {
      console.error("Error fetching menus:", error);
      Swal.fire("Error", "Failed to fetch menus", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveToggle = async (menu) => {
    try {
      await axios.put(
        `http://localhost:8080/api/restaurant/menus/${restaurantId}/menus/${menu.menuId}`,
        {
          menuName: menu.menuName,
          description: menu.menuDescription,
          isActive: menu.isActive,
          menuApproved: !menu.menuApproved,
        },
        { headers }
      );
      await fetchMenus();
      Swal.fire("Success", "Menu approval status updated", "success");
    } catch (error) {
      console.error("Error updating menu:", error);
      Swal.fire("Error", "Failed to update menu", "error");
    }
  };

  const handleDelete = async (menuId) => {
    const confirm = await Swal.fire({
      title: "Delete this menu?",
      text: "This cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#d33",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(
          `http://localhost:8080/api/restaurant/menus/${restaurantId}/menus/${menuId}`,
          { headers }
        );
        Swal.fire("Deleted!", "Menu removed successfully.", "success");
        await fetchMenus();
        if (selectedMenu?.menuId === menuId) {
          onSelectMenu(null);
        }
      } catch (err) {
        Swal.fire("Error", "Failed to delete menu.", "error");
      }
    }
  };

  if (loading) return <div>Loading menus...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow mt-6">
      <h2 className="text-2xl font-semibold mb-4">Menus</h2>
      {menus.length === 0 ? (
        <p className="text-gray-500">No menus available for this restaurant.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menus.map((menu) => (
            <div
              key={menu.menuId}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedMenu?.menuId === menu.menuId
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 hover:border-orange-300"
              }`}
              onClick={() => onSelectMenu(menu)}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg">{menu.menuName}</h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    menu.menuApproved
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {menu.menuApproved ? "Approved" : "Pending"}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{menu.menuDescription}</p>

              <div className="flex justify-between items-center mt-4">
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApproveToggle(menu);
                    }}
                    className={`text-xs px-3 py-1 rounded ${
                      menu.menuApproved
                        ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                    }`}
                  >
                    {menu.menuApproved ? "Unapprove" : "Approve"}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(menu.menuId);
                    }}
                    className="text-xs px-3 py-1 rounded bg-red-100 text-red-800 hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
                <span className="text-xs text-gray-500">
                  {menu.isAvailable ? "Available" : "Unavailable"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
