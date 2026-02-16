"use client"

import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import axios from "axios"
import { buildApiUrl } from "../config/api"

// Load Cashfree script
const loadCashfreeScript = () => {
  return new Promise((resolve, reject) => {
    if (window.Cashfree) {
      resolve(window.Cashfree);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.onload = () => {
      if (window.Cashfree) {
        resolve(window.Cashfree);
      } else {
        reject(new Error("Cashfree SDK failed to load"));
      }
    };
    script.onerror = () => reject(new Error("Failed to load Cashfree SDK"));
    document.head.appendChild(script);
  });
};

const PaymentModal = ({ isOpen, onClose, orderData }) => {
  const [processing, setProcessing] = useState(false)
  const [cashfree, setCashfree] = useState(null)

  useEffect(() => {
    // Load Cashfree SDK when component mounts
    loadCashfreeScript()
      .then((CashfreeClass) => {
        // Instantiate Cashfree with correct mode
        const isLocalHost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
        const mode = isLocalHost ? "sandbox" : "production";
        
        console.log(`Initializing Cashfree in ${mode} mode`);
        const cfInstance = new CashfreeClass({ mode: mode });
        
        setCashfree(cfInstance);
        console.log("Cashfree SDK initialized");
      })
      .catch((error) => {
        console.error("Failed to load Cashfree:", error);
        toast.error("Payment system not available");
      });
  }, []);

  if (!isOpen) return null

  const handlePayment = async () => {
    if (!cashfree) {
      toast.error("Payment system loading... Please wait");
      return;
    }

    setProcessing(true)
    
    try {
      // 1. Create Order on Backend
      const response = await axios.post(buildApiUrl("api/payment/create"), {
        amount: orderData.totalAmount,
        orderId: orderData.orderId || orderData._id,
        customerName: orderData.customerName,
        customerEmail: orderData.email,
        customerPhone: orderData.phone,
      })

      console.log("Payment response:", response.data)

      if (response.data.status === "success" && response.data.data.payment_session_id) {
        const paymentSessionId = response.data.data.payment_session_id;
        
        // 2. Initialize Cashfree Checkout
        const checkoutOptions = {
          paymentSessionId: paymentSessionId,
          redirectTarget: "_self" // Opens in same tab
        };

        console.log("Initializing checkout with:", checkoutOptions);

        // 3. Start checkout
        const result = await cashfree.checkout(checkoutOptions);
        console.log("Checkout result:", result);
        
        // If we reach here, checkout initialized successfully
        // The page will redirect automatically
        
      } else {
        toast.error(response.data.message || "Failed to create payment session")
        setProcessing(false)
      }

    } catch (error) {
      console.error("Payment error:", error);
      
      // Check specific error types
      if (error.message && error.message.includes("redirect")) {
        // Try direct redirect as fallback
        if (response?.data?.data?.payment_link) {
          window.location.href = response.data.data.payment_link;
          return;
        }
      }
      
      toast.error(error.response?.data?.message || "Payment failed. Please try again.")
      setProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">💳</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pay Securely</h2>
          <p className="text-gray-600 mb-6">
            You will be redirected to Cashfree to complete your payment of <span className="font-bold text-indigo-600">₹{orderData?.totalAmount?.toFixed(2)}</span>
          </p>

          <div className="space-y-3">
            <button
              onClick={handlePayment}
              disabled={processing || !cashfree}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {processing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </>
              ) : !cashfree ? (
                "Loading Payment..."
              ) : (
                "Proceed to Payment"
              )}
            </button>
            <button
              onClick={onClose}
              disabled={processing}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition duration-300"
            >
              Cancel
            </button>
          </div>

          <div className="mt-4 flex justify-center items-center space-x-2 opacity-60">
            <span className="text-xs text-gray-500">Secured by Cashfree Payments</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentModal