import React from "react";
import { useLocation } from "react-router-dom";

const Payment = () => {
  const location = useLocation();
  const { cartItems, subtotal } = location.state || {
    cartItems: [],
    subtotal: 0,
  };

  return (
    <div className="font-sans">
      {/* Header */}
      <nav className="flex justify-between items-center p-4 bg-white shadow-sm sticky top-0 z-50">
        <div className="text-2xl font-normal text-black">
          Deliveroo <span className="font-bold">FOOD</span>
        </div>
        <div className="flex space-x-4">
          <button className="px-4 py-2 text-gray-700 hover:text-black-600">
            Login
          </button>
          <button className="px-6 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-black transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700">
            Sign Up
          </button>
        </div>
      </nav>

      <div className="bg-gray-100 py-10">
        <h1 className="text-4xl font-bold text-center text-gray-800">
          Payment Details
        </h1>
        <p className="text-center text-gray-600 mt-2">
          Complete your payment to place the order.
        </p>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white p-6 shadow rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Order Summary
          </h2>
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center mb-4"
            >
              <div>
                <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-500">
                  Quantity: {item.quantity}
                </p>
              </div>
              <p className="text-lg font-bold text-gray-800">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
          <div className="flex justify-between items-center border-t pt-4 mt-4">
            <h3 className="text-xl font-bold text-gray-800">Total:</h3>
            <p className="text-xl font-bold text-gray-800">${subtotal}</p>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Payment Method
          </h2>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Card Number
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="1234 5678 9012 3456"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Expiry Date
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="MM/YY"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                CVV
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="123"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all"
            >
              Pay Now
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* ...existing footer content... */}
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Deliveroo. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition"
              >
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Payment;
