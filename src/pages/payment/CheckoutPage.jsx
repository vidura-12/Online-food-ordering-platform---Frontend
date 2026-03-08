import React, { useState } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import Swal from "sweetalert2";
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCodPayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Swal.fire("Oops!", "Please enter a valid amount.", "warning");
      return;
    }

    setIsProcessing(true);
    
    try {
      const response = await fetch("http://localhost:5212/api/payment/cod", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalAmount: parseFloat(amount),
          currency: "USD",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Swal.fire({
          title: "Success",
          html: `Cash on Delivery Payment Success!`,
          icon: "success",
          confirmButtonColor: "#10b981"
        });
      } else {
        Swal.fire("Error", data.error || "COD Payment Failed", "error");
      }
    } catch (error) {
      console.error("COD Error:", error);
      Swal.fire("Error", "Something went wrong with COD payment.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="CheckoutPage">
      <h1>Payment</h1>

      <div className="payment-card">
        <div className="card-header">
          <h3>Enter Payment Details</h3>
        </div>
        
        <div className="card-body">
          <div className="form-group">
            <label htmlFor="totalAmount">Amount (USD)</label>
            <input
              type="number"
              id="totalAmount"
              className="form-control"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              disabled={isProcessing}
            />
          </div>

          <div className="payment-actions">
            <button 
              className="cod-button" 
              onClick={handleCodPayment}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Cash on Delivery"}
            </button>

            {amount && parseFloat(amount) > 0 && (
              <div className="paypal-container">
                <PayPalScriptProvider
                  options={{
                    clientId: "Aacd_SPuODUux_H7x6evbTSojfds_jToSXaUD4SegYNJE5CM91OWuqbb1-qwkvnEdpMC_YW8zxZGxMdt",
                    currency: "USD",
                  }}
                >
                  <PayPalButtons
                    style={{ layout: "vertical", height: 45 }}
                    disabled={isProcessing}
                    createOrder={async () => {
                      try {
                        const res = await fetch("http://localhost:5212/api/paypal/create", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            amount: parseFloat(amount),
                            currency: "USD",
                          }),
                        });

                        const data = await res.json();
                        return data.orderId;
                      } catch (error) {
                        console.error("PayPal Error:", error);
                        Swal.fire("Error", "Failed to create PayPal order", "error");
                        throw error;
                      }
                    }}
                    onApprove={async (data) => {
                      try {
                        const res = await fetch(
                          `http://localhost:5212/api/paypal/capture/${data.orderID}`,
                          { method: "POST" }
                        );
                        const result = await res.json();
                        Swal.fire({
                          title: "Success",
                          text: result.message || "Payment completed.",
                          icon: "success",
                          confirmButtonColor: "#10b981"
                        });
                      } catch (error) {
                        console.error("Capture Error:", error);
                        Swal.fire("Error", "Failed to capture payment", "error");
                      }
                    }}
                    onError={(err) => {
                      console.error("PayPal Error:", err);
                      Swal.fire("Error", "Something went wrong with PayPal payment", "error");
                    }}
                  />
                </PayPalScriptProvider>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;