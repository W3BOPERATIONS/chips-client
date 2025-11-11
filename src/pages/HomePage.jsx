"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";
import BackgroundCarousel from "../components/BackgroundCarousel";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const testimonialIntervalRef = useRef(null);

  const testimonials = [
    {
      id: 1,
      rating: "★★★★★",
      text: "The best chips I've ever tasted! The quality is outstanding and the flavors are incredible. My whole family is addicted!",
      name: "Sarah Johnson",
      initial: "S",
      color: "from-indigo-500 to-purple-600"
    },
    {
      id: 2,
      rating: "★★★★★",
      text: "Fast delivery and amazing packaging. The chips arrived fresh and crispy. Highly recommended! Will order again soon.",
      name: "Mike Chen",
      initial: "M",
      color: "from-green-500 to-emerald-600"
    },
    {
      id: 3,
      rating: "★★★★★",
      text: "Love the variety of healthy options. Perfect for my fitness goals without compromising on taste! So glad I found this store.",
      name: "Anna Rodriguez",
      initial: "A",
      color: "from-orange-500 to-red-600"
    },
    {
      id: 4,
      rating: "★★★★★",
      text: "Absolutely delicious! The Desi Garlic flavor is my favorite. The perfect balance of spices and crunch. 10/10!",
      name: "Raj Patel",
      initial: "R",
      color: "from-blue-500 to-cyan-600"
    },
    {
      id: 5,
      rating: "★★★★★",
      text: "These chips are a game-changer! So much better than store-bought ones. The freshness and quality are unmatched.",
      name: "Emily Wilson",
      initial: "E",
      color: "from-pink-500 to-rose-600"
    },
    {
      id: 6,
      rating: "★★★★★",
      text: "Customer service is exceptional and the chips are to die for! The Chilli Lemon flavor has the perfect kick. Love it!",
      name: "David Brown",
      initial: "D",
      color: "from-amber-500 to-yellow-600"
    }
  ];

  useEffect(() => {
    fetchProducts();
    
    // Auto-rotate testimonials
    testimonialIntervalRef.current = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => {
      if (testimonialIntervalRef.current) {
        clearInterval(testimonialIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      navigate("/admin");
    }
  }, [isAuthenticated, user, navigate]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/products");
      setProducts(response.data);
    } catch (err) {
      setError("Failed to fetch products. Please try again later.");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/9428362005`, "_blank");
  };

  const goToTestimonial = (index) => {
    setCurrentTestimonial(index);
    // Reset the auto-rotation timer
    if (testimonialIntervalRef.current) {
      clearInterval(testimonialIntervalRef.current);
    }
    testimonialIntervalRef.current = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
  };

  if (loading) {
    return <LoadingSpinner message="Loading delicious chips..." />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 page-transition">
        <div className="text-center glass-effect rounded-2xl sm:rounded-3xl p-8 sm:p-12 max-w-md mx-auto">
          <div className="text-red-500 text-2xl mb-6 animate-bounce">⚠️</div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-4">
            {error}
          </h2>
          <button onClick={fetchProducts} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-transition">
      {/* WhatsApp Floating Button */}
      <button
        onClick={handleWhatsAppClick}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-500 animate-pulse hover:animate-none group"
        aria-label="Chat on WhatsApp"
      >
        {/* Pulsing Ring Effect */}
        <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75 group-hover:opacity-100 group-hover:animate-none"></div>

        {/* Inner Container */}
        <div className="relative w-12 h-12 bg-green-500 rounded-full flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500">
          {/* WhatsApp Icon */}
          <svg
            className="w-6 h-6 text-white transform group-hover:scale-125 transition-transform duration-300"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893c0-3.189-1.248-6.189-3.515-8.444" />
          </svg>
        </div>

        {/* Enhanced Tooltip */}
        <div className="absolute right-20 bottom-1/2 transform translate-y-1/2 px-4 py-3 bg-slate-900 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none shadow-2xl border border-slate-700">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-semibold gradient-text bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Chat with Crunchywavez
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">We're here to help! 💬</p>
          <div className="absolute top-1/2 right-0 transform translate-x-1 -translate-y-1/2">
            <div className="border-4 border-transparent border-l-slate-900"></div>
          </div>
        </div>
      </button>

      {/* Hero Section with Background Carousel */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 py-8 sm:py-12 lg:py-16 min-h-[500px] sm:min-h-[550px] lg:min-h-[600px]">
        {/* Background Carousel Component */}
        <BackgroundCarousel />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-20">
          <div className="floating-animation">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6">
              Premium <span className="gradient-text">Chips</span> Store
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 px-4">
              Discover our collection of crispy, flavorful chips made from the
              finest ingredients. Perfect for snacking, parties, or any time you
              crave something delicious!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Link
                to="/products"
                className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
              >
                Shop Now
              </Link>
              <Link
                to="/about"
                className="btn-secondary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Featured Categories Section */}
        <div className="mb-16 sm:mb-20">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text mb-4">
              Shop by Category
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
              Explore our diverse range of premium snacks
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 max-w-6xl mx-auto">
            <Link to="/category/salty-hungama" className="group">
              <div className="glass-effect rounded-2xl p-6 text-center hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <div className="text-4xl mb-3">🧂</div>
                <h3 className="font-semibold text-slate-800 group-hover:text-indigo-600">
                  Salty Hungama
                </h3>
              </div>
            </Link>
            <Link to="/category/tomato-chatpata" className="group">
              <div className="glass-effect rounded-2xl p-6 text-center hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <div className="text-4xl mb-3">🍅</div>
                <h3 className="font-semibold text-slate-800 group-hover:text-indigo-600">
                  Tomato Chatpata
                </h3>
              </div>
            </Link>
            <Link to="/category/onion-tadka" className="group">
              <div className="glass-effect rounded-2xl p-6 text-center hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <div className="text-4xl mb-3">🧅</div>
                <h3 className="font-semibold text-slate-800 group-hover:text-indigo-600">
                  Onion Tadka
                </h3>
              </div>
            </Link>
            <Link to="/category/desi-garlic" className="group">
              <div className="glass-effect rounded-2xl p-6 text-center hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <div className="text-4xl mb-3">🧄</div>
                <h3 className="font-semibold text-slate-800 group-hover:text-indigo-600">
                  Desi Garlic
                </h3>
              </div>
            </Link>
            <Link to="/category/chilli-lemon" className="group">
              <div className="glass-effect rounded-2xl p-6 text-center hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <div className="text-4xl mb-3">🌶️</div>
                <h3 className="font-semibold text-slate-800 group-hover:text-indigo-600">
                  Chilli Lemon
                </h3>
              </div>
            </Link>
          </div>
        </div>

        {/* Products Grid */}
        <div className="mb-12 sm:mb-16">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text mb-4">
              Featured Products
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
              Handcrafted with love, delivered with care
            </p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="glass-effect rounded-2xl sm:rounded-3xl p-8 sm:p-12 max-w-md mx-auto">
                <div className="text-4xl sm:text-6xl mb-4">🥔</div>
                <p className="text-slate-600 text-base sm:text-lg">
                  No products available at the moment.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto auto-rows-fr items-stretch">
                {products.slice(0, 6).map((product, index) => (
                  <div
                    key={product._id}
                    className="opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards] h-full"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {products.length > 6 && (
                <div className="text-center mt-8 sm:mt-12">
                  <Link
                    to="/products"
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
                  >
                    <span>View All Products</span>
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>

        {/* Enhanced Testimonials Section */}
        <div className="mb-16 sm:mb-20">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
              Don't just take our word for it
            </p>
          </div>

          {/* Testimonial Carousel */}
          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-2xl sm:rounded-3xl">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div
                    key={testimonial.id}
                    className="w-full flex-shrink-0 px-4"
                  >
                    <div className="glass-effect rounded-2xl p-6 sm:p-8 lg:p-10 text-center">
                      <div className="flex justify-center mb-4">
                        <div className="flex text-yellow-400 text-lg sm:text-xl">
                          {testimonial.rating}
                        </div>
                      </div>
                      <p className="text-slate-600 mb-6 italic text-base sm:text-lg leading-relaxed">
                        "{testimonial.text}"
                      </p>
                      <div className="flex items-center justify-center">
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${testimonial.color} rounded-full flex items-center justify-center text-white font-semibold text-lg sm:text-xl mr-4`}>
                          {testimonial.initial}
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-slate-800 text-base sm:text-lg">
                            {testimonial.name}
                          </p>
                          <p className="text-sm text-slate-500">Verified Customer</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center mt-6 sm:mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? "bg-indigo-600 scale-125"
                      : "bg-slate-300 hover:bg-slate-400"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={() => goToTestimonial((currentTestimonial - 1 + testimonials.length) % testimonials.length)}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2 sm:-translate-x-4 w-10 h-10 sm:w-12 sm:h-12 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm"
              aria-label="Previous testimonial"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => goToTestimonial((currentTestimonial + 1) % testimonials.length)}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2 sm:translate-x-4 w-10 h-10 sm:w-12 sm:h-12 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm"
              aria-label="Next testimonial"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Newsletter Signup Section */}
        <div className="mb-16 sm:mb-20">
          <div className="glass-effect rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center bg-gradient-to-br from-indigo-50 to-purple-50">
            <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-4">
              Stay Updated
            </h2>
            <p className="text-lg text-slate-600 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter for exclusive offers, new product
              launches, and snacking tips!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button className="btn-primary px-6 py-3 whitespace-nowrap">
                Subscribe
              </button>
            </div>
            <p className="text-sm text-slate-500 mt-3">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="glass-effect rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 mt-12 sm:mt-20">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center gradient-text mb-8 sm:mb-12">
            Why Choose ChipsStore?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            <div className="text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg group-hover:shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                <span className="text-2xl sm:text-3xl">🥔</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3 sm:mb-4">
                Premium Quality
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Made from the finest potatoes and ingredients for the perfect
                crunch.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg group-hover:shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                <span className="text-2xl sm:text-3xl">🚚</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3 sm:mb-4">
                Fast Delivery
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Quick and reliable delivery to get your snacks to you fresh.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg group-hover:shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                <span className="text-2xl sm:text-3xl">💯</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3 sm:mb-4">
                100% Satisfaction
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                We guarantee you'll love our chips or your money back.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 sm:mt-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">
                50K+
              </div>
              <p className="text-slate-600">Happy Customers</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">
                25+
              </div>
              <p className="text-slate-600">Chip Varieties</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">
                99%
              </div>
              <p className="text-slate-600">Satisfaction Rate</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">
                24/7
              </div>
              <p className="text-slate-600">Customer Support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;