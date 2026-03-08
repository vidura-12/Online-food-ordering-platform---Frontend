import React, { useEffect, useState } from 'react';
import { orderService, authService } from '../../services/apiOrder';

export default function OrderDashboard() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      setError("Unauthorized: No token found. Please log in.");
      return;
    }
    
    orderService
      .getOrders()
      .then((data) => setOrders(data))
      .catch((err) => setError(err.message));
    
    authService
      .getAllUsers()
      .then((data) => setUsers(data.users))
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="p-8 bg-white rounded-xl shadow-lg border border-red-100 animate-pulse">
          <h2 className="text-2xl font-bold text-red-600 mb-4 flex items-center">
            <span className="mr-2">⚠️</span> Error
          </h2>
          <p className="text-gray-700">{error}</p>
          <button className="mt-4 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 text-sm font-medium">
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 to-indigo-600 text-white shadow-lg">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold flex items-center">
            <span className="mr-3 text-indigo-300">🖥️</span> 
            Admin Dashboard
          </h1>
          <p className="mt-2 text-indigo-200">Manage orders and users</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-indigo-500">
            <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
            <p className="text-2xl font-bold text-gray-800 mt-1">{orders.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
            <h3 className="text-gray-500 text-sm font-medium">Completed Orders</h3>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              {orders.filter(order => order.status === 'completed').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
            <h3 className="text-gray-500 text-sm font-medium">Pending Orders</h3>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              {orders.filter(order => order.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
            <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
            <p className="text-2xl font-bold text-gray-800 mt-1">{users.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex mb-8 border-b">
          <button
            className={`px-8 py-4 text-lg font-medium transition-colors duration-200 flex items-center ${
              activeTab === 'orders'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-indigo-500'
            }`}
            onClick={() => setActiveTab('orders')}
          >
            <span className="mr-2 text-lg">📋</span> Orders
          </button>
          <button
            className={`px-8 py-4 text-lg font-medium transition-colors duration-200 flex items-center ${
              activeTab === 'users'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-indigo-500'
            }`}
            onClick={() => setActiveTab('users')}
          >
            <span className="mr-2 text-lg">👥</span> Users
          </button>
        </div>

        {/* Content Cards */}
        <div className="transition-all duration-300">
          {/* Orders Table */}
          {activeTab === 'orders' && (
            <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
              <h2 className="text-2xl font-bold p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b flex items-center">
                <span className="mr-2">📋</span> Orders
                <span className="ml-auto bg-indigo-100 text-indigo-800 text-xs font-medium px-3 py-1 rounded-full">
                  {orders.length} total
                </span>
              </h2>
              {orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-4 text-left font-semibold text-gray-600 uppercase tracking-wider text-sm">
                          Order ID
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-600 uppercase tracking-wider text-sm">
                          Customer
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-600 uppercase tracking-wider text-sm">
                          Total
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-600 uppercase tracking-wider text-sm">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-600 uppercase tracking-wider text-sm">
                          Items
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order._id} className="hover:bg-indigo-50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            <span className="font-mono">{order._id}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {order.customerName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            <span className="font-semibold text-green-600">${order.totalPrice}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                              ${
                                order.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : order.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-blue-100 text-blue-800'
                              }
                            `}>
                              {order.status === 'completed' && <span className="mr-1">✓</span>}
                              {order.status === 'pending' && <span className="mr-1">⏱</span>}
                              {order.status !== 'completed' && order.status !== 'pending' && <span className="mr-1">⚙️</span>}
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            <details className="cursor-pointer group">
                              <summary className="text-indigo-600 hover:text-indigo-900 font-medium flex items-center">
                                <span className="mr-1 text-indigo-400 group-hover:text-indigo-600 transition-colors">📦</span>
                                View Items 
                                <span className="ml-1 px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">
                                  {order.foodItems.length}
                                </span>
                              </summary>
                              <div className="mt-3 bg-indigo-50 p-3 rounded-lg">
                                <ul className="space-y-2 pl-6 list-disc">
                                  {order.foodItems.map((item) => (
                                    <li key={item._id} className="text-gray-700">
                                      <span className="font-medium">{item.name}</span> - 
                                      <span className="text-gray-600"> Qty: {item.quantity || 1}</span> - 
                                      <span className="text-green-600 font-medium">${item.price}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </details>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-16 text-center text-gray-500 flex flex-col items-center">
                  <div className="text-5xl mb-4">📭</div>
                  <p>No orders available</p>
                </div>
              )}
            </div>
          )}

          {/* Users Table */}
          {activeTab === 'users' && (
            <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
              <h2 className="text-2xl font-bold p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b flex items-center">
                <span className="mr-2">👥</span> Users
                <span className="ml-auto bg-purple-100 text-purple-800 text-xs font-medium px-3 py-1 rounded-full">
                  {users.length} total
                </span>
              </h2>
              {users.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-4 text-left font-semibold text-gray-600 uppercase tracking-wider text-sm">
                          User ID
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-600 uppercase tracking-wider text-sm">
                          Name
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-600 uppercase tracking-wider text-sm">
                          Email
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-600 uppercase tracking-wider text-sm">
                          Role
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user._id} className="hover:bg-indigo-50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            <span className="font-mono">{user._id}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                            {user.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            <a href={`mailto:${user.email}`} className="text-indigo-600 hover:text-indigo-900 hover:underline">
                              {user.email}
                            </a>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                              ${
                                user.role === 'admin'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-gray-100 text-gray-800'
                              }
                            `}>
                              {user.role === 'admin' && <span className="mr-1">👑</span>}
                              {user.role !== 'admin' && <span className="mr-1">👤</span>}
                              {user.role}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-16 text-center text-gray-500 flex flex-col items-center">
                  <div className="text-5xl mb-4">🙁</div>
                  <p>No users available</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-12 border-t border-gray-200 py-6 bg-gray-50">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          Admin Dashboard © {new Date().getFullYear()} • All rights reserved
        </div>
      </div>
    </div>
  );
}