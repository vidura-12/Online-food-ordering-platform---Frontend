import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../../components/common/headerlanding";
import Footer from "../../components/common/footerLanding";
import Swal from "sweetalert2";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import OrderReceiptPDF from "./OrderReceiptPDF";

function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const order =
    location.state?.order || JSON.parse(localStorage.getItem("currentOrder"));
  const [showPDFPreview, setShowPDFPreview] = useState(false);

  useEffect(() => {
    if (!order) {
      Swal.fire("Error", "No order details found", "error").then(() =>
        navigate("/order/restaurant")
      );
    }
  }, [order, navigate]);

  if (!order) return null;

  return (
    <div className="font-sans min-h-screen bg-gray-50">
      <NavBar />

      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Order Confirmed!
            </h1>
            <p className="text-gray-600">
              Thank you for your order #{order.orderId}
            </p>
          </div>

          <div className="border-t border-gray-200 pt-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Order Summary
            </h2>

            <div className="mb-6">
              <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-3">
                Customer Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{order.customerEmail}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-3">
                Order Items
              </h3>
              <div className="space-y-4">
                {order.foodItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border-b border-gray-100 pb-3"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  ${order.subtotal?.toFixed(2) || order.totalPrice.toFixed(2)}
                </span>
              </div>
              {order.deliveryFee && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">
                    ${order.deliveryFee.toFixed(2)}
                  </span>
                </div>
              )}
              {order.tax && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${order.tax.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-t border-gray-200 mt-2">
                <span className="font-bold">Total</span>
                <span className="font-bold">
                  ${order.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center mt-8">
            <button
              onClick={() => navigate("/order/restaurant")}
              className="bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors duration-300 sm:mr-4 mb-4 sm:mb-0"
            >
              Back to Menu
            </button>

            <PDFDownloadLink
              document={<OrderReceiptPDF order={order} />}
              fileName={`order_${order.orderId}.pdf`}
              className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors duration-300 text-center sm:mr-4 mb-4 sm:mb-0"
            >
              {({ loading }) =>
                loading ? "Generating PDF..." : "Download Receipt"
              }
            </PDFDownloadLink>

            <button
              onClick={() => setShowPDFPreview(!showPDFPreview)}
              className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
              {showPDFPreview ? "Hide Preview" : "Preview Receipt"}
            </button>
            <button
  onClick={() => navigate("/track-delivery")}
  className="bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors duration-300 sm:ml-4 mt-4 sm:mt-0"
>
  Track My Order
</button>
          </div>

          {showPDFPreview && (
            <div className="mt-8" style={{ height: "500px" }}>
              <PDFViewer width="100%" height="100%">
                <OrderReceiptPDF order={order} />
              </PDFViewer>
            </div>
          )}
          
        </div>
        
      </div>


      <Footer />
    </div>
  );
}

export default OrderSuccess;
