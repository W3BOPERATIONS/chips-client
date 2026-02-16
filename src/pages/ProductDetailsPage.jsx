"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import LoadingSpinner from "../components/LoadingSpinner"
import { toast } from "react-toastify"
import { buildApiUrl } from "../config/api"
import StarRating from "../components/StarRating"
import CustomizeHamperModal from "../components/CustomizeHamperModal"
import { getProductImage } from "../utils/imageUtils"

const ProductDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, updateQuantity } = useCart()
  const { isAuthenticated, user } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("description")
  const [isWishlisted, setIsWishlisted] = useState(false)

  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" })
  const [submittingReview, setSubmittingReview] = useState(false)

  const imageContainerRef = useRef(null)
  const [zoomActive, setZoomActive] = useState(false)
  const [zoomPos, setZoomPos] = useState({ xPct: 50, yPct: 50 })
  const zoomLevel = 3

  // All available flavors for hamper customization
  const allFlavors = ["Salty Hungama", "Tomato Chatpata", "Onion Tadka", "Desi Garlic", "Chilli Lemon"]
  const initialHamperQuantities = allFlavors.reduce((acc, f) => ({ ...acc, [f]: 0 }), {})
  const [hamperQty, setHamperQty] = useState(initialHamperQuantities)
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false)

  // Star rating distribution state
  const [starDistribution, setStarDistribution] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 })

  useEffect(() => {
    fetchProduct()
    fetchReviews()
  }, [id])

  // Calculate star distribution when reviews change
  useEffect(() => {
    if (reviews.length > 0) {
      const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      reviews.forEach((review) => {
        if (review.rating >= 1 && review.rating <= 5) {
          distribution[review.rating]++
        }
      })
      setStarDistribution(distribution)
    }
  }, [reviews])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await fetch(buildApiUrl(`api/products/${id}`))
      if (!response.ok) {
        throw new Error("Product not found")
      }
      const data = await response.json()
      setProduct(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true)
      const response = await fetch(buildApiUrl(`api/reviews/product/${id}`))
      if (response.ok) {
        const data = await response.json()
        setReviews(data)
      }
    } catch (err) {
      console.error("Error fetching reviews:", err)
    } finally {
      setReviewsLoading(false)
    }
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.info("Please sign in to leave a review", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      navigate("/login")
      return
    }

    try {
      setSubmittingReview(true)
      const token = localStorage.getItem("authToken")
      console.log("[v0] Token from localStorage:", token ? "exists" : "missing")

      const response = await fetch(buildApiUrl("api/reviews"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: id,
          rating: reviewForm.rating,
          comment: reviewForm.comment,
        }),
      })

      if (response.ok) {
        const newReview = await response.json()
        setReviews([newReview, ...reviews])
        setReviewForm({ rating: 5, comment: "" })
        setShowReviewForm(false)
        fetchProduct()
        toast.success("Review submitted successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      } else {
        const errorData = await response.json()
        console.log("[v0] Review submission error:", errorData)
        toast.error(errorData.message || "Failed to submit review", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      }
    } catch (err) {
      console.error("Error submitting review:", err)
      toast.error("Failed to submit review", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } finally {
      setSubmittingReview(false)
    }
  }

  const userHasReviewed = reviews.some((review) => review.user._id === user?.id)

  const handleMouseMove = (e) => {
    if (!imageContainerRef.current) return
    const rect = imageContainerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const xPct = Math.max(0, Math.min(100, (x / rect.width) * 100))
    const yPct = Math.max(0, Math.min(100, (y / rect.height) * 100))
    setZoomPos({ xPct, yPct })
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.info("Please sign in to add items to your cart", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      navigate("/login")
      return
    }
    const success = addToCart(product)
    if (success) {
      // Ensure cart quantity matches selector
      updateQuantity(product._id, Math.min(product.stock || quantity, quantity))
    }
  }

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.info("Please sign in to purchase items", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      navigate("/login")
      return
    }

    // Check if product is a hamper and if enough packets are available (10 packets per hamper)
    const packetsNeeded = (product.packetsPerHamper || 10) * quantity
    if (product.isHamper && (product.stock || 0) < packetsNeeded) {
      const packetsAvailable = product.stock || 0
      toast.error(
        `Only ${packetsAvailable} packets available of this flavor. Each hamper needs ${product.packetsPerHamper || 10} packets. Please add other flavors or customize your hamper.`,
        {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        },
      )
      return
    }

    const qty = Math.min(product.stock || quantity, quantity)
    const directItems = [
      {
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: qty,
        imageURL: product.imageURL,
        contents: product.contents || [],
      },
    ]
    navigate("/checkout", { state: { directItems, fromBuyNow: true } })
  }

  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      toast.info("Please sign in to add items to your wishlist", {
        position: "top-right",
        autoClose: 3000,
      })
      navigate("/login")
      return
    }
    setIsWishlisted(!isWishlisted)
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist", {
      position: "top-right",
      autoClose: 2000,
    })
  }

  // Always use all flavors for hamper customization
  const hamperFlavors = allFlavors

  const totalSelectedPackets = Object.values(hamperQty).reduce((sum, val) => sum + Number(val || 0), 0)
  const minPackets = 10
  const meetsMinPackets = totalSelectedPackets >= minPackets
  const customHamperPrice = (product?.packetPrice ?? 20) * totalSelectedPackets

  const updateHamperCount = (flavor, delta) => {
    const next = { ...hamperQty }
    next[flavor] = Math.max(0, Number(next[flavor] || 0) + delta)
    setHamperQty(next)
  }

  const handleAddCustomHamper = () => {
    if (!isAuthenticated) {
      toast.info("Please sign in to add items to your cart", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      navigate("/login")
      return
    }
    if (!meetsMinPackets) return

    const contents = Object.entries(hamperQty)
      .filter(([, count]) => count > 0)
      .map(([flavor, count]) => ({ flavor, count }))

    const customProduct = {
      // A synthetic id just for the order payload
      _id: `custom-${product._id}-${Date.now()}`,
      name: `${product.name} - Custom Hamper`,
      price: customHamperPrice,
      imageURL: product.imageURL,
      description: `Custom assortment of ${totalSelectedPackets} packets`,
      category: "custom-hamper",
      isHamper: true,
      packetsPerHamper: totalSelectedPackets,
      packetPrice: product.packetPrice || 20,
      packetWeightGrams: product.packetWeightGrams || 30,
      contents,
    }

    const directItems = [
      {
        productId: customProduct._id,
        name: customProduct.name,
        price: customProduct.price,
        quantity: 1,
        imageURL: customProduct.imageURL,
        contents: contents,
      },
    ]

    toast.success("Custom hamper ready! Proceeding to checkout…", { position: "top-right", autoClose: 1500 })
    setIsCustomizeOpen(false)
    navigate("/checkout", { state: { directItems, fromBuyNow: true } })
  }

  if (loading) return <LoadingSpinner />
  if (error)
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="text-red-500 text-xl mb-4">❌ {error}</div>
        <button
          onClick={() => navigate("/")}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg"
        >
          Back to Home
        </button>
      </div>
    )
  if (!product)
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="text-gray-700 text-xl mb-4">Product not found</div>
        <button
          onClick={() => navigate("/")}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg"
        >
          Back to Home
        </button>
      </div>
    )

  const images = product.images && product.images.length > 0
    ? product.images.map(img => getProductImage({ ...product, imageURL: img }, 'details'))
    : [getProductImage(product, 'details')]

  const discount = 10

  const isHamper = !!product.isHamper
  const packCount = product.packetsPerHamper || 10
  const packetWeight = product.packetWeightGrams || 30
  const perPacketPrice = product.packetPrice || 20
  const totalWeight = product.totalWeightGrams || (isHamper ? packCount * packetWeight : undefined)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Section - Fixed Position */}
          <div className="space-y-6 xl:sticky xl:top-8 xl:self-start xl:h-fit">
            {/* Breadcrumb - Fixed at top */}
            <nav className="text-sm text-gray-600 bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
              <span onClick={() => navigate("/")} className="cursor-pointer hover:text-orange-500 transition-colors">
                Home
              </span>
              <span className="mx-2">›</span>
              <span
                onClick={() => navigate(`/category/${product.category}`)}
                className="cursor-pointer hover:text-orange-500 transition-colors capitalize"
              >
                {product.category}
              </span>
              <span className="mx-2">›</span>
              <span className="text-gray-900 font-medium">{product.name}</span>
            </nav>

            {/* Product Images */}
            <div className="space-y-4">
              <div
                ref={imageContainerRef}
                className="relative aspect-square max-w-[420px] xl:max-w-[460px] mx-auto bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg overflow-hidden border border-gray-200 group"
                onMouseEnter={() => setZoomActive(true)}
                onMouseLeave={() => setZoomActive(false)}
                onMouseMove={handleMouseMove}
              >
                <img
                  src={images[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  className={`w-full h-full object-cover transition-transform duration-500 ease-out ${zoomActive ? "scale-110" : "scale-100"}`}
                  draggable={false}
                />

                {/* Flipkart-style Magnifier */}
                {zoomActive && images[selectedImage] && (
                  <div className="hidden xl:block absolute top-0 left-full ml-6 w-[400px] h-[400px] bg-white rounded-2xl shadow-xl overflow-hidden z-50 border border-gray-300">
                    <div
                      className="w-full h-full bg-no-repeat"
                      style={{
                        backgroundImage: `url(${images[selectedImage]})`,
                        backgroundSize: `${zoomLevel * 100}%`,
                        backgroundPosition: `${zoomPos.xPct}% ${zoomPos.yPct}%`,
                      }}
                    />
                  </div>
                )}

                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.bestseller && (
                    <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur-sm">
                      🔥 Bestseller
                    </span>
                  )}
                  {product.featured && (
                    <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur-sm">
                      ⭐ Featured
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur-sm">
                      {discount}% OFF
                    </span>
                  )}
                </div>

                <button
                  onClick={handleWishlistToggle}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-300"
                  aria-label="Add to wishlist"
                >
                  <span
                    className={`text-xl transition-all duration-300 ${isWishlisted ? "text-red-500 scale-110" : "text-gray-400 hover:text-red-400"}`}
                  >
                    {isWishlisted ? "❤️" : "🤍"}
                  </span>
                </button>

                {/* Removed "Hover to zoom" text */}
              </div>

              {images.length > 1 && (
                <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 transform hover:scale-105 ${selectedImage === index
                        ? "border-orange-500 shadow-lg ring-2 ring-orange-200/50"
                        : "border-gray-200 hover:border-gray-400"
                        }`}
                    >
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Scrollable Content */}
          <div className="space-y-6">
            {/* Product Info Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold px-3 py-1 rounded-xl capitalize shadow-md">
                      {product.category}
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">{product.name}</h1>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="flex items-center bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-2 rounded-xl shadow-md border border-green-200">
                      <StarRating rating={product.rating || product.initialRating || 0} size="w-5 h-5" />
                      <span className="ml-2 font-bold text-green-700 text-base">
                        {(product.rating || product.initialRating || 0).toFixed(1)}
                      </span>
                    </div>
                    <span className="text-gray-600 text-base font-medium">
                      {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl p-4 border border-orange-200/50">
                  <div className="flex items-baseline space-x-3 mb-2">
                    <span className="text-3xl font-black text-orange-600">₹{product.price}</span>
                    {product.originalPrice && (
                      <>
                        <span className="text-xl text-gray-500 line-through">₹{product.originalPrice}</span>
                        <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-black px-3 py-1 rounded-xl shadow-lg">
                          Save {discount}%
                        </span>
                      </>
                    )}
                  </div>
                  {/* Free shipping on orders above ₹499 */}
                  <p className="text-sm text-gray-600 font-medium">Free shipping on orders above ₹499</p>
                </div>

                <div className="flex flex-col gap-3 bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center space-x-4">
                    <span className="font-bold text-gray-800 text-base">Quantity:</span>
                    <div className="flex items-center bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-all duration-200 font-bold text-gray-700 text-base hover:scale-105"
                      >
                        −
                      </button>
                      <span className="px-4 py-2 font-black text-gray-900 text-base bg-white min-w-[60px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-all duration-200 font-bold text-gray-700 text-base hover:scale-105"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  {product.stock < 20 && product.stock > 0 && (
                    <div className="text-xs sm:text-sm text-red-600 font-semibold bg-red-50 px-3 py-2 rounded-lg">
                      Hurry! Only {product.stock} packets of this flavor left in stock.
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="group bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-xl font-bold text-base hover:from-orange-600 hover:to-orange-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                  >
                    <span className="text-xl group-hover:scale-110 transition-transform">🛒</span>
                    <span>Add to Cart</span>
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={product.stock === 0}
                    className="group bg-gradient-to-r from-gray-900 to-gray-800 text-white py-3 px-4 rounded-xl font-bold text-base hover:from-gray-800 hover:to-gray-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                  >
                    <span className="text-xl group-hover:scale-110 transition-transform">⚡</span>
                    <span>Buy Now</span>
                  </button>
                  {isHamper && (
                    <button
                      type="button"
                      onClick={() => setIsCustomizeOpen(true)}
                      className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-xl font-bold text-base hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                      aria-label="Customize your hamper"
                    >
                      <span className="text-xl group-hover:scale-110 transition-transform">🎨</span>
                      <span>Customize</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
                <span className="text-xl mr-2">✨</span>
                Why You'll Love This
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200 hover:shadow-md transition-all duration-300">
                  <div className="text-xl mb-2">🌱</div>
                  <div className="font-bold text-gray-900 text-base mb-1">100% Natural Ingredients</div>
                  <div className="text-gray-600 text-sm">Fresh, authentic flavors with no artificial additives</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200 hover:shadow-md transition-all duration-300">
                  <div className="text-xl mb-2">🛡️</div>
                  <div className="font-bold text-gray-900 text-base mb-1">Hygienically Packed</div>
                  <div className="text-gray-600 text-sm">Sealed bags to maintain freshness and quality</div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200 hover:shadow-md transition-all duration-300">
                  <div className="text-xl mb-2">⚡</div>
                  <div className="font-bold text-gray-900 text-base mb-1">Perfect Snacking</div>
                  <div className="text-gray-600 text-sm">Ideal for any time cravings and occasions</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200 hover:shadow-md transition-all duration-300">
                  <div className="text-xl mb-2">🎯</div>
                  <div className="font-bold text-gray-900 text-base mb-1">Premium Quality</div>
                  <div className="text-gray-600 text-sm">Consistent taste and texture in every bite</div>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="flex space-x-1 border-b border-gray-200 bg-gray-50/50 p-3 overflow-x-auto scrollbar-hide">
                {["description", ...(isHamper ? ["inside"] : []), "nutrition", "details", "reviews"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-2 px-3 rounded-xl font-bold text-sm transition-all duration-300 whitespace-nowrap ${activeTab === tab
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-md"
                      }`}
                  >
                    {tab === "inside" ? "What's Inside" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {tab === "reviews" && ` (${reviews.length})`}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === "description" && (
                  <div className="space-y-4">
                    <p className="text-gray-700 text-base leading-relaxed">{product.description}</p>
                    {isHamper && (
                      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200">
                        <div className="font-bold text-gray-900 text-base mb-1">🎁 Hamper Details</div>
                        <p className="text-gray-700 text-sm">
                          Includes {packCount} premium packets × {packetWeight}g each. Perfect for gifting, parties, or
                          group snacking experiences.
                        </p>
                      </div>
                    )}
                    {product.tags && product.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-semibold px-2 py-1 rounded-xl border border-gray-300 text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {isHamper && activeTab === "inside" && (
                  <div className="space-y-3">
                    {Array.isArray(product.contents) && product.contents.length > 0 ? (
                      product.contents.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300"
                        >
                          <span className="font-bold text-gray-900 text-base">{item.flavor}</span>
                          <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold px-3 py-1 rounded-xl text-sm">
                            {item.count} packet{item.count > 1 ? "s" : ""}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-gray-600 text-base">
                        This premium hamper includes {packCount} carefully selected assorted packets for the perfect
                        snacking experience.
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "nutrition" && (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      {
                        label: "Calories",
                        value: product.nutritionInfo?.calories || 150,
                        color: "from-orange-500 to-red-500",
                        unit: "",
                      },
                      {
                        label: "Protein",
                        value: product.nutritionInfo?.protein || "2g",
                        color: "from-blue-500 to-cyan-500",
                        unit: "",
                      },
                      {
                        label: "Carbs",
                        value: product.nutritionInfo?.carbs || "15g",
                        color: "from-green-500 to-emerald-500",
                        unit: "",
                      },
                      {
                        label: "Fat",
                        value: product.nutritionInfo?.fat || "10g",
                        color: "from-purple-500 to-pink-500",
                        unit: "",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-200 text-center hover:shadow-md transition-all duration-300"
                      >
                        <div
                          className={`text-xl font-black bg-gradient-to-r ${item.color} bg-clip-text text-transparent mb-1`}
                        >
                          {item.value}
                        </div>
                        <div className="text-gray-600 font-semibold text-sm">{item.label}</div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "details" && (
                  <div className="space-y-4">
                    {[
                      {
                        label: "Brand",
                        value: product.brand,
                      },
                      {
                        label: "Weight",
                        value: product.weight,
                      },
                      {
                        label: "Category",
                        value: product.category,
                      },
                      {
                        label: "Ingredients",
                        value: product.ingredients,
                      },
                    ].map((detail, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-start py-3 border-b border-gray-200 last:border-b-0"
                      >
                        <span className="font-bold text-gray-900 text-base">{detail.label}:</span>
                        <span className="text-gray-700 text-base text-right max-w-md">{detail.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-6">
                    {/* Star Rating Distribution */}
                    {reviews.length > 0 && (
                      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 border border-gray-200 shadow-md">
                        <h4 className="font-bold text-gray-900 text-base mb-3">Rating Distribution</h4>
                        <div className="space-y-2">
                          {[5, 4, 3, 2, 1].map((star) => {
                            const count = starDistribution[star] || 0
                            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
                            return (
                              <div key={star} className="flex items-center justify-between">
                                <div className="flex items-center space-x-2 flex-1">
                                  <span className="text-sm font-medium text-gray-600 w-6">{star}★</span>
                                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full transition-all duration-500"
                                      style={{ width: `${percentage}%` }}
                                    ></div>
                                  </div>
                                </div>
                                <span className="text-sm text-gray-500 w-16 text-right whitespace-nowrap">
                                  {count} ({percentage.toFixed(0)}%)
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {isAuthenticated && !userHasReviewed && (
                      <div className="border-b border-gray-200 pb-4">
                        <button
                          onClick={() => setShowReviewForm(!showReviewForm)}
                          className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-xl font-bold text-base hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                          {showReviewForm ? "✕ Cancel Review" : "✍️ Write a Review"}
                        </button>
                      </div>
                    )}

                    {showReviewForm && (
                      <form
                        onSubmit={handleSubmitReview}
                        className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 border border-gray-200 space-y-4 shadow-md"
                      >
                        <div>
                          <label className="block text-base font-bold text-gray-900 mb-2">Your Rating</label>
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                className={`text-2xl transition-all duration-300 transform hover:scale-110 ${star <= reviewForm.rating
                                  ? "text-yellow-400 scale-105"
                                  : "text-gray-300 hover:text-yellow-300"
                                  }`}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-base font-bold text-gray-900 mb-2">Your Review</label>
                          <textarea
                            value={reviewForm.comment}
                            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                            rows={3}
                            className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 resize-none text-base"
                            placeholder="Share your experience with this product..."
                            required
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={submittingReview}
                          className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-bold text-base hover:from-orange-600 hover:to-red-600 disabled:from-gray-300 disabled:to-gray-400 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:cursor-not-allowed"
                        >
                          {submittingReview ? "Submitting..." : "Submit Review"}
                        </button>
                      </form>
                    )}

                    {reviewsLoading ? (
                      <div className="text-center py-6">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                      </div>
                    ) : reviews.length > 0 ? (
                      <div className="space-y-4">
                        {reviews.map((review) => (
                          <div
                            key={review._id}
                            className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <div className="font-bold text-gray-900 text-base mb-1">{review.user.name}</div>
                                <div className="flex items-center space-x-2">
                                  <StarRating rating={review.rating} size="w-4 h-4" />
                                  <span className="text-gray-500 text-sm">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-700 text-base leading-relaxed">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200">
                        <div className="text-4xl mb-3">💬</div>
                        <div className="text-gray-600 text-base font-medium">
                          No reviews yet. Be the first to share your experience!
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isHamper && (
        <CustomizeHamperModal
          isOpen={isCustomizeOpen}
          onClose={() => setIsCustomizeOpen(false)}
          product={product}
          hamperQty={hamperQty}
          updateHamperCount={updateHamperCount}
          totalSelectedPackets={totalSelectedPackets}
          meetsMinPackets={meetsMinPackets}
          minPackets={minPackets}
          customHamperPrice={customHamperPrice}
          handleAddCustomHamper={handleAddCustomHamper}
        />
      )}
    </div>
  )
}

export default ProductDetailsPage
