import { useState, useEffect } from 'react';
import axios from 'axios';
import './Orders.css'; // We'll create this CSS file

export default function Orders() {
  const [orders, setOrders] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const restaurantId = localStorage.getItem("restaurantId");
        const token = localStorage.getItem("token"); // Get token from localStorage
        
        if (!restaurantId) {
          throw new Error("Restaurant ID not found in local storage");
        }
        if (!token) {
          throw new Error("Authentication token not found");
        }
        
        const response = await axios.get(
          `http://localhost:5000/api/orders/details/pending?restaurantId=${restaurantId}`,
          {
            headers: {
              Authorization: `Bearer ${token}` // Include token in headers
            }
          }
        );
        
        setOrders(response.data.groupedByRestaurant || {});
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchOrders();
  }, []);
  
  const handleApproveOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token"); // Get token from localStorage
      console.log(orderId);
      console.log(token)
      if (!token) {
        throw new Error("Authentication token not found");
      }
  
      await axios.put(
        `http://localhost:5000/api/userdetails/userdetails/${orderId}/status`,
        {
          "statusType": "RestaurantOwner",
          "value": "Approved"
        },
        {
          headers: {
            Authorization: `Bearer ${token}` // Include token in headers
          }
        }
      );
  
      // Update the local state to remove the approved order
      const updatedOrders = { ...orders };
      for (const restaurantId in updatedOrders) {
        updatedOrders[restaurantId] = updatedOrders[restaurantId].filter(
          order => order._id !== orderId
        );
      }
      setOrders(updatedOrders);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h1 className="orders-header">Pending Orders</h1>
      
      {Object.keys(orders).length === 0 ? (
        <p className="no-orders">No pending orders found</p>
      ) : (
        Object.entries(orders).map(([restaurantId, restaurantOrders]) => (
          <div key={restaurantId} className="restaurant-orders">
            
            
            {restaurantOrders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <h3>Order #{order._id.slice(-6).toUpperCase()}</h3>
                  <span className={`status-badge ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="order-details">
                  <div className="customer-info">
                    <h4>Customer Information</h4>
                    <p><strong>Name:</strong> {order.customerName}</p>
                    <p><strong>Phone:</strong> {order.phoneNumber}</p>
                    <p><strong>Address:</strong> {order.address}, {order.city}, {order.zipCode}</p>
                    <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                    <p><strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}</p>
                  </div>
                  
                  <div className="order-items">
                    <h4>Order Items</h4>
                    {order.menus.map(menu => (
                      <div key={menu.menuId} className="menu-section">
                        <h5>{menu.menuName}</h5>
                        <ul>
                          {menu.items.map(item => (
                            <li key={item.menuItemId}>
                              {item.menuItemName} - {item.qty} x ${item.price.toFixed(2)}
                              <span className="item-total">
                                ${(item.qty * item.price).toFixed(2)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="order-actions">
                  <button 
                    onClick={() => handleApproveOrder(order._id)}
                    className="approve-button"
                  >
                    Approve Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}