
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/apiOrder';
import NavBar from "../../components/common/headerlanding";
import Footer from "../../components/common/footerLanding";
import axios from 'axios';

export default function Profile() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    role: ''
  });
  const [orders, setOrders] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login to view profile');
      navigate('/login');
      return;
    }

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const decodedToken = JSON.parse(jsonPayload);
      const userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

      setUser({
        name: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
        email: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
        role: decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
      });

      // Fetch order history for the user
      axios.get(`https://deliveroo-api-gateway.onrender.com/gateway/userdetails/userdetails/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => {
          setOrders(res.data.orderDetails || []);
        })
        .catch(err => {
          console.error(err);
          setOrders([]);
        });

    } catch (err) {
      console.error(err);
      setError('Error decoding user information');
    }
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.updateUser(user);
      localStorage.setItem('user', JSON.stringify(response));
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await authService.deleteUser();
        localStorage.clear();
        navigate('/login');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  // CSS styles with improved visibility for profile header and buttons
  const styles = {
    profileContainer: `bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 min-h-screen pt-16 pb-24 px-4 sm:px-6 lg:px-8`,
    profileCard: `max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl border border-amber-100`,
    profileHeader: `bg-gradient-to-r from-purple-600 via-rose-500 to-amber-500 px-6 py-8 text-white`, // Improved contrast gradient
    profileContent: `px-6 py-6`,
    buttonPrimary: `inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-purple-500 to-rose-500 text-white font-medium rounded-lg shadow-md hover:from-purple-600 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-opacity-50 transform transition-all duration-300 hover:scale-105`, // Enhanced button gradient
    buttonSecondary: `inline-flex items-center justify-center px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transform transition-all duration-300 hover:scale-105`,
    buttonDanger: `inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium rounded-lg shadow-md hover:from-red-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transform transition-all duration-300 hover:scale-105`,
    input: `mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-200 bg-white shadow-sm`,
    label: `block text-sm font-medium text-gray-700 mb-1`,
    orderHistoryHeader: `relative mb-3 pb-2 border-b-2 border-amber-200 inline-flex items-center`,
    orderHistoryText: `text-3xl font-bold text-gray-800`,
    orderHistoryDecoration: `absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-amber-300 via-rose-400 to-purple-500`,
    orderCard: `bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-amber-100 transform hover:scale-101`,
    orderHeader: `relative bg-gradient-to-r from-amber-50 to-rose-50 px-6 py-5 border-b border-amber-100`,
    orderContent: `px-6 py-6`,
    orderStatusBadge: `inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium`,
    orderItemCard: `bg-white rounded-lg shadow-sm p-3 border border-gray-100 hover:border-amber-200 transition-all flex items-center justify-between`,
    orderItemIcon: `w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700`,
    printButton: `px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-lg shadow-md hover:from-amber-500 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-50 transform transition-all duration-300 hover:scale-105 font-medium text-sm flex items-center justify-center`,
    noOrdersContainer: `bg-white p-10 rounded-2xl shadow-lg text-center border border-dashed border-amber-300 transform transition-all duration-300 hover:shadow-xl`,
    actionButton: `mt-6 px-6 py-3 bg-gradient-to-r from-amber-400 to-rose-500 text-white rounded-lg hover:from-amber-500 hover:to-rose-600 transition-all transform hover:scale-105 font-medium flex items-center justify-center space-x-2`,
  };

  // Status badge styling helper
  const getStatusBadgeStyle = (status) => {
    switch(status) {
      case 'preparing':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'pending':
        return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'complete':
        return 'bg-rose-100 text-rose-800 border border-rose-200';
      default:
        return 'bg-gray-100 text-gray-600 border border-gray-200';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch(status) {
      case 'preparing':
        return '👨‍🍳';
      case 'delivered':
        return '✅';
      case 'pending':
        return '⏳';
      case 'complete':
        return '🎉';
      default:
        return '📋';
    }
  };

  if (error) {
    return (
      <>
        <NavBar />
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-rose-50 to-purple-50">
          <div className="p-8 bg-white rounded-xl shadow-lg border-l-4 border-red-500 transform transition-all hover:shadow-xl">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-700">{error}</p>
            <button 
              onClick={() => navigate('/login')} 
              className="mt-6 px-5 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all"
            >
              Back to Login
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className={styles.profileContainer}>
        {/* Profile Card */}
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-3xl text-purple-600 font-bold">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">My Profile</h1>
                <p className="text-white">{user.role && user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
              </div>
            </div>
          </div>

          <div className={styles.profileContent}>
            <form onSubmit={handleUpdate}>
              <div className="space-y-6">
                <div>
                  <label className={styles.label}>Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={user.email}
                      onChange={(e) => setUser({ ...user, email: e.target.value })}
                      className={styles.input}
                    />
                  ) : (
                    <p className="mt-1 text-lg text-gray-900 font-medium bg-gray-50 rounded-lg px-4 py-2 border border-gray-200">{user.email}</p>
                  )}
                </div>

                <div>
                  <label className={styles.label}>Role</label>
                  <p className="mt-1 text-lg text-gray-900 capitalize bg-gray-50 rounded-lg px-4 py-2 border border-gray-200">{user.role}</p>
                </div>

                {isEditing ? (
                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      className={`${styles.buttonPrimary} flex-1`}
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className={`${styles.buttonSecondary} flex-1`}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className={`${styles.buttonPrimary} w-full font-medium text-lg py-3`} // Improved button visibility
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleDelete}
                className={styles.buttonDanger + " w-full"}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* Order History Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className={styles.orderHistoryHeader}>
              <h2 className={styles.orderHistoryText}>Order History</h2>
              <div className={styles.orderHistoryDecoration}></div>
            </div>
          </div>
          
          {orders.length === 0 ? (
            <div className={styles.noOrdersContainer}>
              <div className="text-6xl mb-6">🛒</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">No Orders Yet</h3>
              <p className="text-gray-600 text-lg mb-6">You haven't placed any orders yet. Start exploring our delicious menu!</p>
              <button 
                onClick={() => navigate('/')} 
                className={styles.actionButton}
              >
                <span>Browse Menu</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {orders.map((order, index) => (
                <div key={index} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <span className="text-gray-500 text-sm">Order placed</span>
                        <h3 className="font-bold text-lg text-gray-800">
                          {formatDate(new Date().toISOString())}
                        </h3>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-gray-500 text-sm">Order #</span>
                        <span className="font-bold text-lg text-gray-800">{1000 + index}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        <div className={`${styles.orderStatusBadge} ${getStatusBadgeStyle(order.status.restaurantAdmin)}`}>
                          {getStatusIcon(order.status.restaurantAdmin)} Restaurant: {order.status.restaurantAdmin}
                        </div>
                        <div className={`${styles.orderStatusBadge} ${getStatusBadgeStyle(order.status.deliver)}`}>
                          {getStatusIcon(order.status.deliver)} Delivery: {order.status.deliver}
                        </div>
                        <div className={`${styles.orderStatusBadge} ${getStatusBadgeStyle(order.status.customerOrderRecive)}`}>
                          {getStatusIcon(order.status.customerOrderRecive)} Received: {order.status.customerOrderRecive}
                        </div>
                      </div>
                      <div>
                        <span className="font-bold text-xl text-rose-500">${order.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.orderContent}>
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Customer Details
                        </h4>
                        <div className="space-y-2">
                          <p className="text-gray-700"><span className="font-medium">Name:</span> {order.customerName}</p>
                          <p className="text-gray-700"><span className="font-medium">Phone:</span> {order.phoneNumber}</p>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Delivery Address
                        </h4>
                        <p className="text-gray-700">{order.address}, {order.city}, {order.zipCode}</p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-6">
                      <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        Payment Method
                      </h4>
                      <div className="flex items-center space-x-2">
                        {order.paymentMethod === 'Credit Card' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                          </svg>
                        )}
                        <span className="font-medium text-gray-700">{order.paymentMethod}</span>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Order Items
                      </h4>
                      <div className="grid gap-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className={styles.orderItemCard}>
                            <div className="flex items-center space-x-3">
                              <div className={styles.orderItemIcon}>
                                <span>🍽️</span>
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-800">{item.name}</h5>
                                <p className="text-sm text-gray-500">{item.description || 'Delicious dish'}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-lg font-medium text-xs">
                                x{item.quantity}
                              </span>
                              <span className="ml-3 font-semibold text-gray-700">${(item.price || 0).toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-2">
                        <button className={styles.buttonPrimary}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z" />
                          </svg>
                          Print Receipt
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-500 text-sm">Order Total</p>
                        <p className="font-bold text-xl text-amber-600">${order.totalAmount.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}