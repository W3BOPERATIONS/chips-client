"use client"

import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import SuccessModal from "../components/SuccessModal"
import PaymentModal from "../components/PaymentModal"
import { toast } from "react-toastify"
import { buildApiUrl } from "../config/api"
import { getProductImage } from "../utils/imageUtils"

const CheckoutPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { items, getTotalPrice, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()

  const directItems = Array.isArray(location.state?.directItems) ? location.state.directItems : []
  const isDirect = directItems.length > 0
  const itemsForOrder = isDirect ? directItems : items

  const [formData, setFormData] = useState({
    customerName: user?.name || "",
    email: user?.email || "", // this remains the delivery/invoice email input
    address: "",
    phone: "",
    deliveryState: "",
    paymentMethod: "cod",
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [showSuccess, setShowSuccess] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [orderId, setOrderId] = useState("")
  const [orderData, setOrderData] = useState(null)
  const [completeOrderData, setCompleteOrderData] = useState(null)
  const [orderPlaced, setOrderPlaced] = useState(false)

  // Calculate delivery charge based on state
  const getDeliveryCharge = () => {
    if (!formData.deliveryState) return 0
    return formData.deliveryState.toLowerCase() === "gujarat" ? 60 : 100
  }

  const deliveryCharge = getDeliveryCharge()

  if (itemsForOrder.length === 0 && !orderPlaced) {
    navigate("/")
    return null
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.customerName.trim()) {
      newErrors.customerName = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^[\d\s\-+]{10,}$/.test(formData.phone.trim())) {
      newErrors.phone = "Please enter a valid phone number"
    }

    if (!formData.deliveryState.trim()) {
      newErrors.deliveryState = "Delivery state is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    const subtotal = isDirect ? directItems.reduce((t, it) => t + it.price * it.quantity, 0) : getTotalPrice()
    const delivery = deliveryCharge
    const total = subtotal + delivery

    const normalizedItems = itemsForOrder.map((item) => ({
      productId: item.productId || item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      imageURL: item.imageURL,
      contents: item.contents || [],
    }))

    const orderDetails = {
      customerName: formData.customerName.trim(),
      email: formData.email.trim(),
      userEmail: user?.email || formData.email.trim(),
      address: formData.address.trim(),
      phone: formData.phone.trim(),
      deliveryState: formData.deliveryState.trim(),
      paymentMethod: formData.paymentMethod,
      items: normalizedItems,
      subtotal,
      tax: 0,
      deliveryCharge: delivery,
      totalAmount: total,
      status: "pending",
    }

    setOrderData(orderDetails)
    if (formData.paymentMethod === "online") {
      // For online payment, create the order first to get the ID
      try {
        setLoading(true)
        const response = await axios.post(buildApiUrl("api/orders"), orderDetails)
        const createdOrder = response.data

        // Update orderData with the real ID
        setOrderData({
          ...orderDetails,
          orderId: createdOrder.orderId || createdOrder._id,
          _id: createdOrder._id
        })

        setShowPayment(true)
      } catch (error) {
        console.error("Failed to create pending order:", error)
        toast.error("Failed to initialize order. Please try again.")
      } finally {
        setLoading(false)
      }
    } else {
      await processOrder(orderDetails)
    }
  }

  const processOrder = async (orderDetails) => {
    setLoading(true)
    try {
      const response = await axios.post(buildApiUrl("api/orders"), orderDetails)

      setOrderId(response.data.orderId || response.data._id)
      setCompleteOrderData({
        ...orderDetails,
        orderId: response.data.orderId || response.data._id,
        date: new Date().toLocaleDateString(),
      })
      setOrderPlaced(true)
      setShowSuccess(true)

      if (!isDirect) {
        clearCart()
      }

      if (typeof response.data?.emailSent !== "undefined") {
        if (response.data.emailSent) {
          console.log("[v0] Order email sent successfully for order:", response.data.orderId || response.data._id)
        } else {
          console.warn(
            "[v0] Order created but email failed to send; check server logs for PDF generation or SMTP issues.",
          )
          toast.warn("Order placed! Email could not be sent right now, but your order is confirmed.", {
            position: "top-right",
          })
        }
      } else {
        console.log("[v0] No emailSent flag in response; server may be on an older version.")
      }
    } catch (error) {
      if (error.response) {
        console.error("[v0] Error placing order (server responded):", {
          status: error.response.status,
          data: error.response.data,
        })
      } else if (error.request) {
        console.error("[v0] Error placing order (no response from server):", error.message)
      } else {
        console.error("[v0] Error placing order (request setup):", error.message)
      }
      toast.error("Failed to place order. Please try again.", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = async (paymentDetails) => {
    const updatedOrderData = {
      ...orderData,
      paymentDetails,
      paymentStatus: "completed",
    }

    await processOrder(updatedOrderData)
    setShowPayment(false)
  }

  const handlePaymentCancel = () => {
    setShowPayment(false)
  }

  const handleSuccessClose = () => {
    setShowSuccess(false)
    navigate("/orders", { replace: true })
  }

  const subtotal = isDirect ? directItems.reduce((t, it) => t + it.price * it.quantity, 0) : getTotalPrice()
  const total = subtotal

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 page-transition">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-2xl text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">Processing Order</h2>
            <p className="text-slate-600 text-sm sm:text-base">Please wait while we confirm your order...</p>
          </div>
        </div>
      )}

      <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-8 sm:mb-12 text-center">Checkout</h1>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12">
        {/* Checkout Form */}
        <div className="glass-effect rounded-2xl sm:rounded-3xl p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold gradient-text mb-6 sm:mb-8">Delivery Information</h2>

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            <div>
              <label htmlFor="customerName" className="block text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                Full Name *
              </label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 ${errors.customerName ? "border-red-500 ring-red-500/20" : ""
                  }`}
                placeholder="Enter your full name"
              />
              {errors.customerName && (
                <p className="text-red-500 text-sm mt-2 flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{errors.customerName}</span>
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 ${errors.email ? "border-red-500 ring-red-500/20" : ""
                  }`}
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-2 flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                Delivery Address *
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 ${errors.address ? "border-red-500 ring-red-500/20" : ""
                  }`}
                placeholder="Enter your complete delivery address"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-2 flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{errors.address}</span>
                </p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 ${errors.phone ? "border-red-500 ring-red-500/20" : ""
                  }`}
                placeholder="Enter your phone number"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-2 flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{errors.phone}</span>
                </p>
              )}
            </div>

            <div>
              <label htmlFor="deliveryState" className="block text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                Delivery State *
              </label>
              <input
                type="text"
                id="deliveryState"
                name="deliveryState"
                value={formData.deliveryState}
                onChange={handleInputChange}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 ${errors.deliveryState ? "border-red-500 ring-red-500/20" : ""
                  }`}
                placeholder="Enter your state (e.g., Gujarat, Maharashtra)"
              />
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Delivery charge: ₹{getDeliveryCharge()} (Gujarat: ₹60, Others: ₹100)
              </p>
              {errors.deliveryState && (
                <p className="text-red-500 text-sm mt-2 flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{errors.deliveryState}</span>
                </p>
              )}
            </div>

            {/* Payment Method Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 sm:mb-3">Payment Method *</label>
              <div className="space-y-2 sm:space-y-3">
                <label className="flex items-center p-3 sm:p-4 border border-gray-300 rounded-lg sm:rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={handleInputChange}
                    className="mr-3 text-indigo-600"
                  />
                  <div className="flex items-center space-x-3">
                    <span className="text-xl sm:text-2xl">💰</span>
                    <div>
                      <p className="font-medium text-gray-900 text-sm sm:text-base">Cash on Delivery</p>
                      <p className="text-xs sm:text-sm text-gray-600">Pay when your order arrives</p>
                    </div>
                  </div>
                </label>

                <label className="flex items-center p-3 sm:p-4 border border-gray-300 rounded-lg sm:rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={formData.paymentMethod === "online"}
                    onChange={handleInputChange}
                    className="mr-3 text-indigo-600"
                  />
                  <div className="flex items-center space-x-3">
                    <span className="text-xl sm:text-2xl">💳</span>
                    <div>
                      <p className="font-medium text-gray-900 text-sm sm:text-base">Online Payment</p>
                      <p className="text-xs sm:text-sm text-gray-600">Pay securely with card/UPI/wallet</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-indigo-100">
              <h3 className="font-bold text-slate-800 mb-3 sm:mb-4 flex items-center space-x-2">
                <span>🚚</span>
                <span className="text-sm sm:text-base">Delivery Information</span>
              </h3>
              <ul className="text-xs sm:text-sm text-slate-600 space-y-1 sm:space-y-2">
                <li className="flex items-center space-x-2">
                  <span>💰</span>
                  <span>Delivery charge: ₹{getDeliveryCharge()} (Gujarat: ₹60, Others: ₹100)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span>⏰</span>
                  <span>Estimated delivery: 2-3 business days</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span>📞</span>
                  <span>We'll call you before delivery</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span>🧾</span>
                  <span>Invoice will be emailed to you</span>
                </li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3 text-base sm:text-lg"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 sm:w-6 sm:h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Placing Order...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{formData.paymentMethod === "online" ? "Proceed to Payment" : "Place Order"}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="glass-effect rounded-2xl sm:rounded-3xl p-6 sm:p-8 h-fit xl:sticky xl:top-24">
          <h2 className="text-xl sm:text-2xl font-bold gradient-text mb-6 sm:mb-8">Order Summary</h2>

          {/* Order Items */}
          <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
            {itemsForOrder.map((item, index) => (
              <div
                key={(item.productId || item._id) + index}
                className="flex items-center space-x-3 sm:space-x-4 opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img
                  src={getProductImage(item)}
                  alt={item.name}
                  className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-xl sm:rounded-2xl shadow-md"
                />
                <div className="flex-grow min-w-0">
                  <h4 className="font-bold text-slate-800 text-sm sm:text-base truncate">{item.name}</h4>
                  <p className="text-xs sm:text-sm text-slate-600">Qty: {item.quantity}</p>
                  {item.contents && item.contents.length > 0 && (
                    <div className="mt-2 text-xs text-slate-500 space-y-1">
                      <p className="font-semibold">Contents:</p>
                      {item.contents.map((content, idx) => (
                        <p key={idx} className="ml-2">
                          • {content.flavor}: {content.count} packets
                        </p>
                      ))}
                    </div>
                  )}
                </div>
                <p className="font-bold text-slate-800 text-base sm:text-lg">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="border-t border-slate-200 pt-4 sm:pt-6 space-y-3 sm:space-y-4">
            <div className="flex justify-between text-slate-600 text-sm sm:text-base">
              <span>Subtotal</span>
              <span className="font-semibold">₹{(isDirect ? directItems.reduce((t, it) => t + it.price * it.quantity, 0) : getTotalPrice()).toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-slate-600 text-sm sm:text-base">
              <span>Delivery Charge</span>
              <span className={`font-semibold ${deliveryCharge > 0 ? "text-orange-600" : "text-green-600"}`}>
                {deliveryCharge > 0 ? `₹${deliveryCharge}` : "Free"}
              </span>
            </div>

            <div className="border-t border-slate-200 pt-3 sm:pt-4">
              <div className="flex justify-between text-xl sm:text-2xl font-bold gradient-text">
                <span>Total</span>
                <span>₹{((isDirect ? directItems.reduce((t, it) => t + it.price * it.quantity, 0) : getTotalPrice()) + deliveryCharge).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Security Info */}
          <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl border border-green-100">
            <div className="flex items-center space-x-3 text-green-700">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-bold text-sm sm:text-base">Secure Checkout</span>
            </div>
            <p className="text-xs sm:text-sm text-green-600 mt-2">Your information is protected and secure</p>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPayment}
        onClose={handlePaymentCancel}
        onSuccess={handlePaymentSuccess}
        orderData={orderData}
      />

      {/* Success Modal */}
      <SuccessModal isOpen={showSuccess} onClose={handleSuccessClose} orderId={orderId} orderData={completeOrderData} />
    </div>
  )
}

export default CheckoutPage
