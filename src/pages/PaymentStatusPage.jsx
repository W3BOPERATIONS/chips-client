import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { buildApiUrl } from "../config/api";
import { toast } from "react-toastify";

const PaymentStatusPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { clearCart } = useCart();
    const [status, setStatus] = useState("verifying");
    const [paymentData, setPaymentData] = useState(null);

    useEffect(() => {
        const orderId = searchParams.get('order_id');
        
        console.log("Payment callback - Order ID:", orderId);

        if (orderId) {
            verifyPayment(orderId);
        } else {
            setStatus("error");
            toast.error("No order ID found");
        }
    }, []);

    const verifyPayment = async (orderId) => {
        try {
            const response = await axios.post(buildApiUrl("api/payment/verify"), { 
                orderId 
            });

            console.log("Verify response:", response.data);

            if (response.data.status === "success") {
                const paymentStatus = response.data.payment?.status;
                
                if (paymentStatus === "SUCCESS") {
                    setStatus("success");
                    setPaymentData(response.data);
                    clearCart();
                    toast.success("Payment Successful! Order confirmed.");
                } else if (paymentStatus === "PENDING") {
                    setStatus("pending");
                    toast.info("Payment is being processed.");
                } else {
                    setStatus("failed");
                    toast.error("Payment failed or cancelled.");
                }
            } else {
                setStatus("error");
                toast.error("Payment verification failed.");
            }
        } catch (error) {
            console.error("Payment verification error:", error);
            setStatus("error");
            toast.error("Error verifying payment.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                {status === "verifying" && (
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                        <h2 className="text-2xl font-bold text-gray-800">Verifying Payment...</h2>
                        <p className="text-gray-600 mt-2">Please wait while we confirm your payment.</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="flex flex-col items-center animate-fadeIn">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
                        <p className="text-gray-600 mb-6">Thank you for your order. We'll notify you when it ships.</p>
                        <div className="bg-gray-50 p-4 rounded-lg w-full mb-6">
                            <p className="text-sm text-gray-500 mb-1">Transaction ID</p>
                            <p className="font-mono text-sm text-gray-800 break-all">
                                {paymentData?.payment?.paymentId || "Processing..."}
                            </p>
                        </div>
                        <button
                            onClick={() => navigate("/orders")}
                            className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition duration-300 font-semibold mb-3"
                        >
                            View Orders
                        </button>
                        <button
                            onClick={() => navigate("/")}
                            className="text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                            Continue Shopping
                        </button>
                    </div>
                )}

                {status === "failed" && (
                    <div className="flex flex-col items-center animate-fadeIn">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-red-600 mb-2">Payment Failed</h2>
                        <p className="text-gray-600 mb-6">Your payment was not successful.</p>
                        <button
                            onClick={() => navigate("/cart")}
                            className="w-full bg-gray-800 text-white py-3 rounded-xl hover:bg-gray-900 transition duration-300 font-semibold mb-3"
                        >
                            Return to Cart
                        </button>
                    </div>
                )}

                {status === "pending" && (
                    <div className="flex flex-col items-center animate-fadeIn">
                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                            <span className="text-3xl">⏳</span>
                        </div>
                        <h2 className="text-2xl font-bold text-yellow-600 mb-2">Payment Processing</h2>
                        <p className="text-gray-600 mb-6">Your payment is being processed.</p>
                        <button
                            onClick={() => navigate("/orders")}
                            className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition duration-300 font-semibold"
                        >
                            Check Status
                        </button>
                    </div>
                )}

                {status === "error" && (
                    <div className="flex flex-col items-center animate-fadeIn">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <span className="text-3xl">⚠️</span>
                        </div>
                        <h2 className="text-2xl font-bold text-red-600 mb-2">Verification Error</h2>
                        <p className="text-gray-600 mb-6">Unable to verify payment status.</p>
                        <button
                            onClick={() => navigate("/contact")}
                            className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition duration-300 font-semibold mb-3"
                        >
                            Contact Support
                        </button>
                        <button
                            onClick={() => navigate("/")}
                            className="text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                            Go to Home
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentStatusPage;