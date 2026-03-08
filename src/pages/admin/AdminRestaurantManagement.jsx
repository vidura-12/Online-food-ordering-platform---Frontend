// AdminRestaurantManagement.js
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import RestaurantsList from "./RestaurantsList"; // Add this import
import MenusList from "./MenusList"; // Add this import
import MenuItemsList from "./MenuItemsList"; // Add this import
const MySwal = withReactContent(Swal);

export default function AdminRestaurantManagement() {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Restaurant Management</h1>
      
      <RestaurantsList 
        onSelectRestaurant={setSelectedRestaurant} 
        selectedRestaurant={selectedRestaurant}
      />
      
      {selectedRestaurant && (
        <MenusList
          restaurantId={selectedRestaurant.restaurantId}
          onSelectMenu={setSelectedMenu}
          selectedMenu={selectedMenu}
        />
      )}
      
      {selectedMenu && (
        <MenuItemsList
          restaurantId={selectedRestaurant.restaurantId}
          menuId={selectedMenu.menuId}
        />
      )}
    </div>
  );
}