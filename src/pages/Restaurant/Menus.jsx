import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function Menus() {
  const [menus, setMenus] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedMenuId, setSelectedMenuId] = useState(null);

  const token = localStorage.getItem("token");
  const restaurantId = "17";

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const fetchMenus = async () => {
    try {
      console.log(restaurantId);
      const response = await axios.get(
        `http://localhost:8080/api/Restaurant/get-restaurant-menu/${restaurantId}`,
        { headers }
      );
      console.log(restaurantId);
      const approvedMenus = response.data.filter((menu) => menu.menuApproved);
      setMenus(approvedMenus);
    } catch (error) {
      console.error("Error fetching menus:", error);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleCreateItem = async () => {
    const { value: formValues } = await MySwal.fire({
      title: "Add Menu Item",
      html: `
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <input 
            id="item-name" 
            class="swal2-input" 
            placeholder="Item Name" 
            style="padding: 12px; border-radius: 8px;"
          />
          
          <textarea 
            id="item-desc" 
            class="swal2-textarea" 
            placeholder="Description"
            style="padding: 12px; border-radius: 8px; min-height: 100px;"
          ></textarea>
          
          <input 
            id="item-price" 
            type="number" 
            class="swal2-input" 
            placeholder="Price (e.g. 9.99)"
            style="padding: 12px; border-radius: 8px;"
            step="0.01"
            min="0"
          />
          
          <div style="display: flex; gap: 10px; align-items: center;">
          <input id="item-image" class="swal2-input" placeholder="Image filename (ex: veggie_pizza.jpg)" />
          <button id="image-picker" style="padding: 8px 8px; background-color: #FF5823; border: none; color: white; border-radius: 5px; cursor: pointer;  width: 300px; margin-top:31px ">
            📁 Browse
          </button>
        </div>

          
          <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 8px;">
            <span style="font-size: 14px; color: #333;">Item Availability</span>
            <label style="
              position: relative;
              display: inline-block;
              width: 50px;
              height: 26px;
              margin-left: 10px;
            ">
              <input 
                type="checkbox" 
                id="item-available" 
                style="opacity: 0; width: 0; height: 0;"
                checked
              />
              <span style="
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                transition: .4s;
                border-radius: 34px;
              "></span>
              <span style="
                position: absolute;
                height: 18px;
                width: 18px;
                left: 4px;
                bottom: 4px;
                background-color: white;
                transition: .4s;
                border-radius: 50%;
              "></span>
            </label>
          </div>
        </div>
        
        <style>
          #image-picker:hover {
            background-color: #E04A1A !important;
          }
          input:checked + span {
            background-color: #FF5823 !important;
          }
          input:checked + span:before {
            transform: translateX(24px) !important;
          }
        </style>
      `,
      focusConfirm: false,
      confirmButtonText: "Add Item",
      confirmButtonColor: "#FF5823",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      customClass: {
        popup: "custom-swal-popup",
      },
      didOpen: () => {
        const pickerButton = document.getElementById("image-picker");
        const imageInput = document.getElementById("item-image");

        pickerButton.addEventListener("click", () => {
          const fileInput = document.createElement("input");
          fileInput.type = "file";
          fileInput.accept = "image/*";

          fileInput.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
              imageInput.value = file.name;
            }
          };

          fileInput.click();
        });

        // Add toggle switch functionality
        const toggle = document.getElementById("item-available");
        const slider = toggle.nextElementSibling;
        const sliderCircle = slider.nextElementSibling;

        toggle.addEventListener("change", function () {
          if (this.checked) {
            slider.style.backgroundColor = "#FF5823";
            sliderCircle.style.transform = "translateX(24px)";
          } else {
            slider.style.backgroundColor = "#ccc";
            sliderCircle.style.transform = "translateX(0)";
          }
        });
      },
      preConfirm: () => {
        return {
          name: document.getElementById("item-name").value,
          description: document.getElementById("item-desc").value,
          price: parseFloat(document.getElementById("item-price").value),
          imageUrl: document.getElementById("item-image").value,
          isAvailable: document.getElementById("item-available").checked,
          isApproved: false, // Add this line
        };
      },
    });

    if (formValues) {
      try {
        await axios.post(
          `http://localhost:8080/api/restaurant/menu/MenuItems/${restaurantId}/menus/${selectedMenuId}/items`,
          formValues,
          { headers }
        );
        Swal.fire({
          title: "Success!",
          text: "Menu item added successfully",
          icon: "success",
          confirmButtonColor: "#FF5823",
        });
        handleMenuClick(selectedMenuId);
      } catch (err) {
        Swal.fire({
          title: "Error!",
          text: "Failed to add item. Please try again.",
          icon: "error",
          confirmButtonColor: "#FF5823",
        });
      }
    }
  };

  const handleUpdateItem = async (item) => {
    const { value: formValues } = await MySwal.fire({
      title: "Edit Menu Item",
      html: `
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <input 
            id="item-name" 
            class="swal2-input" 
            value="${item.name || ""}" 
            placeholder="Item Name"
            style="padding: 12px; border-radius: 8px;"
          />
          
          <textarea 
            id="item-desc" 
            class="swal2-textarea" 
            placeholder="Description"
            style="padding: 12px; border-radius: 8px; min-height: 100px;"
          >${item.description || ""}</textarea>
          
          <input 
            id="item-price" 
            type="number" 
            class="swal2-input" 
            value="${item.price || ""}"
            placeholder="Price (e.g. 9.99)"
            style="padding: 12px; border-radius: 8px;"
            step="0.01"
            min="0"
          />
          
          <div style="display: flex; align-items: center; gap: 10px;">
          <input id="item-image" class="swal2-input" value="${
            item.imageUrl
          }" placeholder="Image filename (e.g. veggie.jpg)" />
          <button id="image-picker" style="padding: 8px 8px; background-color: #FF5823; border: none; color: white; border-radius: 5px; cursor: pointer;  width: 380px; margin-top:30px ">
            📁 Browse
          </button>
        </div>
          
          <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 8px;">
            <span style="font-size: 14px; color: #333;">Item Availability</span>
            <label style="
              position: relative;
              display: inline-block;
              width: 50px;
              height: 26px;
              margin-left: 10px;
            ">
              <input 
                type="checkbox" 
                id="item-available" 
                style="opacity: 0; width: 0; height: 0;"
                ${item.isAvailable ? "checked" : ""}
              />
              <span style="
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: ${item.isAvailable ? "#FF5823" : "#ccc"};
                transition: .4s;
                border-radius: 34px;
              "></span>
              <span style="
                position: absolute;
                height: 18px;
                width: 18px;
                left: ${item.isAvailable ? "26px" : "4px"};
                bottom: 4px;
                background-color: white;
                transition: .4s;
                border-radius: 50%;
              "></span>
            </label>
          </div>
        </div>
        
        <style>
          #image-picker:hover {
            background-color: #E04A1A !important;
          }
          input:checked + span {
            background-color: #FF5823 !important;
          }
          input:focus + span {
            box-shadow: 0 0 0 2px rgba(255, 88, 35, 0.3);
          }
          input:checked + span + span {
            transform: translateX(1px) !important;
          }
        </style>
      `,
      focusConfirm: false,
      confirmButtonText: "Update Item",
      confirmButtonColor: "#FF5823",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      width: "600px",
      didOpen: () => {
        const pickerButton = document.getElementById("image-picker");
        const imageInput = document.getElementById("item-image");

        pickerButton.addEventListener("click", () => {
          const fileInput = document.createElement("input");
          fileInput.type = "file";
          fileInput.accept = "image/*";

          fileInput.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
              imageInput.value = file.name;
            }
          };

          fileInput.click();
        });

        // Initialize toggle switch
        const toggle = document.getElementById("item-available");
        const slider = toggle.nextElementSibling;
        const sliderCircle = slider.nextElementSibling;

        toggle.addEventListener("change", function () {
          if (this.checked) {
            slider.style.backgroundColor = "#FF5823";
            sliderCircle.style.left = "26px";
          } else {
            slider.style.backgroundColor = "#ccc";
            sliderCircle.style.left = "4px";
          }
        });
      },
      preConfirm: () => {
        return {
          name: document.getElementById("item-name").value,
          description: document.getElementById("item-desc").value,
          price: parseFloat(document.getElementById("item-price").value),
          imageUrl: document.getElementById("item-image").value,
          isAvailable: document.getElementById("item-available").checked,
          isApproved: item.isApproved,
        };
      },
    });

    if (formValues) {
      try {
        await axios.put(
          `http://localhost:8080/api/restaurant/menu/menuitems/${restaurantId}/menus/${selectedMenuId}/items/${item.menuItemId}`,
          formValues,
          { headers }
        );
        Swal.fire({
          title: "Updated!",
          text: "Menu item has been updated",
          icon: "success",
          confirmButtonColor: "#FF5823",
        });
        handleMenuClick(selectedMenuId);
      } catch (err) {
        Swal.fire({
          title: "Error!",
          text: err.response?.data?.message || "Failed to update item",
          icon: "error",
          confirmButtonColor: "#FF5823",
        });
      }
    }
  };

  const handleDeleteItem = async (item) => {
    const confirm = await Swal.fire({
      title: "Delete this item?",
      text: "This cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#d33",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(
          `http://localhost:8080/api/restaurant/menu/menuitems/${restaurantId}/menus/${selectedMenuId}/items/${item.menuItemId}`,
          { headers }
        );
        Swal.fire("Deleted!", "Item removed successfully.", "success");
        handleMenuClick(selectedMenuId);
      } catch (err) {
        Swal.fire("Error", "Failed to delete item.", "error");
      }
    }
  };

  const handleMenuClick = async (menuId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/restaurant/menu/MenuItems/${restaurantId}/menus/${menuId}/items`,
        { headers }
      );
      console.log(menuId);
      setSelectedMenuId(menuId);

      if (response.data && response.data.length > 0) {
        // Filter to only show approved items
        const approvedItems = response.data.filter((item) => item.isApproved);
        setMenuItems(approvedItems);

        if (approvedItems.length === 0) {
          MySwal.fire({
            title: "No Approved Items Found",
            text: "This menu currently has no approved items.",
            icon: "info",
            confirmButtonText: "OK",
          });
        }
      } else {
        setMenuItems([]);
        MySwal.fire({
          title: "No Items Found",
          text: "This menu currently has no items.",
          icon: "info",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error fetching menu items:", error);
      setMenuItems([]);
      setSelectedMenuId(null);
      MySwal.fire({
        text: "No menu items For This",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleCreate = async () => {
    const { value: result } = await MySwal.fire({
      title: "Add New Menu",
      html: `
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <input 
            id="menu-name" 
            class="swal2-input" 
            placeholder="Menu Name"
            style="padding: 12px; border-radius: 8px;"
          />
          
          <textarea 
            id="menu-desc" 
            class="swal2-textarea" 
            placeholder="Description"
            style="padding: 12px; border-radius: 8px; min-height: 100px;"
          ></textarea>
          
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 14px; color: #333;">Menu Status</span>
            <label style="
              position: relative;
              display: inline-block;
              width: 50px;
              height: 26px;
              margin-left: 10px;
            ">
              <input 
                type="checkbox" 
                id="menu-active" 
                style="opacity: 0; width: 0; height: 0;"
                checked
              />
              <span style="
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #FF5823;
                transition: .4s;
                border-radius: 34px;
              "></span>
              <span style="
                position: absolute;
                height: 18px;
                width: 18px;
                left: 26px;
                bottom: 4px;
                background-color: white;
                transition: .4s;
                border-radius: 50%;
              "></span>
            </label>
          </div>
        </div>
        
        <style>
          input:checked + span {
            background-color: #FF5823 !important;
          }
          input:focus + span {
            box-shadow: 0 0 0 2px rgba(255, 88, 35, 0.3);
          }
          input:not(:checked) + span {
            background-color: #ccc !important;
          }
          input:not(:checked) + span + span {
            transform: translateX(-1px) !important;
          }
        </style>
      `,
      focusConfirm: false,
      confirmButtonText: "Create Menu",
      confirmButtonColor: "#FF5823",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      width: "600px",
      preConfirm: () => {
        return {
          menuName: document.getElementById("menu-name").value,
          description: document.getElementById("menu-desc").value,
          isActive: document.getElementById("menu-active").checked,
          isApproved: false,
        };
      },
      didOpen: () => {
        // Initialize toggle switch interaction
        const toggle = document.getElementById("menu-active");
        const slider = toggle.nextElementSibling;
        const sliderCircle = slider.nextElementSibling;

        toggle.addEventListener("change", function () {
          if (this.checked) {
            slider.style.backgroundColor = "#FF5823";
            sliderCircle.style.left = "26px";
          } else {
            slider.style.backgroundColor = "#ccc";
            sliderCircle.style.left = "4px";
          }
        });
      },
    });

    if (result) {
      try {
        await axios.post(
          `http://localhost:8080/api/restaurant/menus/${restaurantId}/menus`,
          result,
          { headers }
        );
        Swal.fire({
          title: "Created!",
          text: "Menu successfully added.",
          icon: "success",
          confirmButtonColor: "#FF5823",
        });
        fetchMenus();
      } catch (err) {
        Swal.fire({
          title: "Error!",
          text: err.response?.data?.message || "Failed to create menu",
          icon: "error",
          confirmButtonColor: "#FF5823",
        });
      }
    }
  };

  const handleUpdate = async (menu) => {
    const { value: result } = await MySwal.fire({
      title: "Edit Menu",
      html: `
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <input 
            id="menu-name" 
            class="swal2-input" 
            value="${menu.menuName || ""}" 
            placeholder="Menu Name"
            style="padding: 12px; border-radius: 8px;"
          />
          
          <textarea 
            id="menu-desc" 
            class="swal2-textarea" 
            placeholder="Description"
            style="padding: 12px; border-radius: 8px; min-height: 100px;"
          >${menu.menuDescription || ""}</textarea>
          
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 14px; color: #333;">Menu Status</span>
            <label style="
              position: relative;
              display: inline-block;
              width: 50px;
              height: 26px;
              margin-left: 10px;
            ">
              <input 
                type="checkbox" 
                id="menu-active" 
                style="opacity: 0; width: 0; height: 0;"
                ${menu.isActive ? "checked" : ""}
              />
              <span style="
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: ${menu.isActive ? "#FF5823" : "#ccc"};
                transition: .4s;
                border-radius: 34px;
              "></span>
              <span style="
                position: absolute;
                height: 18px;
                width: 18px;
                left: ${menu.isActive ? "26px" : "4px"};
                bottom: 4px;
                background-color: white;
                transition: .4s;
                border-radius: 50%;
              "></span>
            </label>
          </div>
        </div>
        
        <style>
          input:checked + span {
            background-color: #FF5823 !important;
          }
          input:focus + span {
            box-shadow: 0 0 0 2px rgba(255, 88, 35, 0.3);
          }
          input:not(:checked) + span {
            background-color: #ccc !important;
          }
          input:not(:checked) + span + span {
            transform: translateX(-1px) !important;
          }
        </style>
      `,
      focusConfirm: false,
      confirmButtonText: "Update Menu",
      confirmButtonColor: "#FF5823",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      width: "600px",
      preConfirm: () => {
        return {
          menuName: document.getElementById("menu-name").value,
          description: document.getElementById("menu-desc").value,
          isActive: document.getElementById("menu-active").checked, // Use the checkbox value
          isApproved: menu.isApproved, // Preserve the approval status separately
        };
      },
      didOpen: () => {
        // Initialize toggle switch interaction
        const toggle = document.getElementById("menu-active");
        const slider = toggle.nextElementSibling;
        const sliderCircle = slider.nextElementSibling;

        toggle.addEventListener("change", function () {
          if (this.checked) {
            slider.style.backgroundColor = "#FF5823";
            sliderCircle.style.left = "26px";
          } else {
            slider.style.backgroundColor = "#ccc";
            sliderCircle.style.left = "4px";
          }
        });
      },
    });

    if (result) {
      try {
        await axios.put(
          `http://localhost:8080/api/restaurant/menus/${restaurantId}/menus/${menu.menuId}`,
          result,
          { headers }
        );
        Swal.fire({
          title: "Updated!",
          text: "Menu has been updated successfully.",
          icon: "success",
          confirmButtonColor: "#FF5823",
        });
        fetchMenus();
      } catch (err) {
        Swal.fire({
          title: "Error!",
          text: err.response?.data?.message || "Failed to update menu",
          icon: "error",
          confirmButtonColor: "#FF5823",
        });
      }
    }
  };
  const handleDelete = async (menuId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the menu!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(
          `http://localhost:8080/api/restaurant/menus/${restaurantId}/menus/${menuId}`,
          { headers }
        );
        Swal.fire("Deleted!", "Menu has been removed.", "success");
        fetchMenus();
      } catch (err) {
        Swal.fire("Error!", "Failed to delete menu.", "error");
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">📋 Approved Menus</h2>
        <button
          onClick={handleCreate}
          className="bg-orange-500 text-white px-5 py-2.5 rounded-lg hover:bg-orange-600 transition text-sm font-medium shadow"
          style={{
            background: "rgba(255,88,35,255)",
            fontWeight: "bold", // Makes text bold
            letterSpacing: "0.5px", // Adds a little space between letters
          }}
        >
          Create Menu
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {menus.map((menu) => (
          <div
            key={menu.menuId}
            className="relative bg-white p-6 rounded-xl shadow hover:shadow-xl transition-all duration-200 border border-gray-200"
          >
            <div
              onClick={() => handleMenuClick(menu.menuId)}
              className="cursor-pointer"
            >
              <h3 className="text-xl font-bold text-gray-800">
                {menu.menuName}
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                {menu.menuDescription}
              </p>
              <div className="mt-2">
                <span
                  className={`inline-block text-xs font-semibold px-2 py-1 rounded-full ${
                    menu.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {menu.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            <div className="absolute top-3 right-3 flex gap-3">
              <button
                onClick={() => handleUpdate(menu)}
                className="text-sm text-blue-600 font-semibold hover:underline"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => handleDelete(menu.menuId)}
                className="text-sm text-red-600 font-semibold hover:underline"
              >
                🗑 Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedMenuId && (
        <div className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              🍽 Menu Items
            </h2>
            <button
              onClick={handleCreateItem}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 text-sm shadow"
              style={{
                background: "rgba(255,88,35,255)",
                fontWeight: "bold", // Makes text bold
                letterSpacing: "0.px", // Adds a little space between letters
              }}
            >
              Add Item
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {menuItems.map((item) => (
              <div
                key={item.menuItemId}
                className="bg-white p-5 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200 flex flex-col"
              >
                <img
                  src={
                    item.imageUrl.startsWith("http")
                      ? item.imageUrl
                      : (() => {
                          try {
                            return require(`../../assets/${item.imageUrl}`);
                          } catch {
                            return item.imageUrl; // fallback to string even if not http
                          }
                        })()
                  }
                  alt={item.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/300x200?text=Image+Not+Found";
                  }}
                  className="w-full h-64 object-cover rounded-md mb-4"
                />

                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-800">
                    {item.name}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {item.description}
                  </p>
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <button
                    onClick={() => handleUpdateItem(item)}
                    className="text-sm text-blue-600 hover:underline font-medium"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item)}
                    className="text-sm text-red-600 hover:underline font-medium"
                  >
                    🗑 Delete
                  </button>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <p className="text-base text-orange-600 font-bold">
                    ${item.price.toFixed(2)}
                  </p>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      item.isAvailable
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {item.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
