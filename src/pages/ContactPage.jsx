"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { buildApiUrl } from "../config/api"

// Animation variants (same as AboutPage)
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
}

// Animated component wrapper (same as AboutPage)
const AnimatedSection = ({ children, className = "" }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeInUp}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [openFaqIndex, setOpenFaqIndex] = useState(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(buildApiUrl("api/contact"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSubmitStatus("success")
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        })
      } else {
        setSubmitStatus("error")
      }
    } catch (error) {
      console.error("[v0] Contact form error:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  const contactInfo = [
    {
      icon: "📍",
      title: "Visit Us",
      details: ["123 Snack Street", "Mumbai, Maharashtra 400001", "India"],
      bgImage: "https://www.shutterstock.com/image-illustration/visit-us-map-pin-location-600nw-704724958.jpg",
    },
    {
      icon: "📞",
      title: "Call Us",
      details: ["+91 98765 43210", "+91 87654 32109", "Mon-Sat 9AM-7PM"],
      bgImage: "https://i.pinimg.com/564x/c1/39/9a/c1399a01e6d764a7271da11dd6974778.jpg",
    },
    {
      icon: "✉️",
      title: "Email Us",
      details: ["hello@crunchywavez.com", "support@crunchywavez.com", "We reply within 24 hours"],
      bgImage:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    },
  ]

  const faqs = [
    {
      question: "What are your delivery timings?",
      answer: "We deliver between 9 AM to 8 PM, Monday to Saturday. Sunday deliveries are available in select cities.",
    },
    {
      question: "Do you deliver pan-India?",
      answer: "Yes, we deliver to over 50 cities across India. Check our delivery page for the complete list.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer a 7-day return policy for unopened products. For quality issues, we provide immediate replacement or refund.",
    },
    {
      question: "Are your products fresh?",
      answer: "We maintain strict quality control and most products are manufactured within 7 days of delivery.",
    },
  ]

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Enhanced Hero Section */}
      <div
        className="relative text-white overflow-hidden min-h-[70vh] flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1556760544-74068565f05c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="relative w-full max-w-6xl mx-auto px-4 py-20 text-center">
          <AnimatedSection>
            <motion.h1 className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-2xl" variants={fadeInUp}>
              Get In Touch
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl leading-relaxed mb-8 max-w-4xl mx-auto text-gray-100 drop-shadow-lg"
              variants={fadeInUp}
            >
              Have a question, suggestion, or just want to say hello? We'd love to hear from you. Our friendly team is
              here to help make your snacking experience amazing.
            </motion.p>
          </AnimatedSection>
        </div>
      </div>

      {/* Contact Info Cards with Enhanced Design */}
      <div
        className="relative py-24 min-h-[600px] flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.90)), url('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="w-full max-w-6xl mx-auto px-4">
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Crunchywavez</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Multiple ways to connect with our team. We're always here to help!
            </p>
          </motion.div>

          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16" variants={staggerContainer}>
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                className="group relative h-80 rounded-3xl overflow-hidden shadow-2xl transform hover:scale-102 transition-all duration-500"
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${info.bgImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 flex flex-col justify-center items-center p-8 text-white text-center">
                  <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-500">
                    {info.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-6">{info.title}</h3>
                  <div className="space-y-3">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-200 leading-relaxed">
                        {detail}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Contact Form and Map Section */}
      <div
        className="relative py-24 min-h-[800px] flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.88), rgba(255,255,255,0.92)), url('https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="w-full max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <AnimatedSection className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>

              {submitStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6"
                >
                  Thank you for your message! We'll get back to you within 24 hours.
                </motion.div>
              )}

              {submitStatus === "error" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
                >
                  There was an error sending your message. Please try again or email us directly at
                  crunchywavez.contact@gmail.com
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div variants={fadeInUp}>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                      placeholder="Your full name"
                    />
                  </motion.div>

                  <motion.div variants={fadeInUp}>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                      placeholder="your@email.com"
                    />
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div variants={fadeInUp}>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                      placeholder="+91 98765 43210"
                    />
                  </motion.div>

                  <motion.div variants={fadeInUp}>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="order">Order Support</option>
                      <option value="product">Product Question</option>
                      <option value="partnership">Partnership</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </motion.div>
                </div>

                <motion.div variants={fadeInUp}>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </motion.div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold py-4 px-6 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" fill="none" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending Message...
                    </div>
                  ) : (
                    "Send Message"
                  )}
                </motion.button>
              </form>
            </AnimatedSection>

            {/* Map and Additional Info */}
            <div className="space-y-8">
              {/* Enhanced Map Placeholder */}
              <AnimatedSection className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-100">
                <div className="h-80 bg-gradient-to-br from-yellow-50 to-orange-100 flex items-center justify-center relative">
                  <div className="text-center">
                    <div className="text-5xl mb-4">🗺️</div>
                    <p className="text-gray-700 text-lg font-semibold">Interactive Map</p>
                    <p className="text-gray-600">123 Snack Street, Mumbai</p>
                  </div>

                  {/* Floating Location Pin */}
                  <motion.div
                    className="absolute bottom-8 right-8 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-2xl shadow-2xl text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="text-lg font-bold">Our Location</div>
                    <div className="text-sm">Click to explore</div>
                  </motion.div>
                </div>
              </AnimatedSection>

              {/* Enhanced Business Hours */}
              <AnimatedSection className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Business Hours</h3>
                <div className="space-y-4">
                  {[
                    {
                      day: "Monday - Friday",
                      time: "9:00 AM - 7:00 PM",
                      open: true,
                    },
                    {
                      day: "Saturday",
                      time: "10:00 AM - 6:00 PM",
                      open: true,
                    },
                    {
                      day: "Sunday",
                      time: "Closed",
                      open: false,
                    },
                  ].map((schedule, index) => (
                    <motion.div
                      key={index}
                      className="flex justify-between items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
                      whileHover={{ x: 5 }}
                    >
                      <span className="text-gray-700 font-medium">{schedule.day}</span>
                      <span className={`font-bold ${schedule.open ? "text-green-600" : "text-red-500"}`}>
                        {schedule.time}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </AnimatedSection>

              {/* Enhanced Quick Links */}
              <AnimatedSection className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Links</h3>
                <div className="space-y-4">
                  {[
                    {
                      label: "Track Your Order",
                      href: "/track-order",
                    },
                    {
                      label: "Returns & Refunds",
                      href: "/returns",
                    },
                    {
                      label: "Shipping Information",
                      href: "/shipping",
                    },
                    {
                      label: "Bulk Orders",
                      href: "/bulk-orders",
                    },
                  ].map((link, index) => (
                    <motion.div key={index} whileHover={{ x: 5 }} className="group">
                      <Link
                        to={link.href}
                        className="block text-gray-700 hover:text-yellow-600 transition-all duration-300 py-2 border-b border-gray-100 group-hover:border-yellow-200"
                      >
                        <span className="font-medium">{link.label}</span>
                        <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          →
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced FAQ Section with Accordion */}
      <div
        className="relative py-24 min-h-[600px] flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.90), rgba(255,255,255,0.94)), url('https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="w-full max-w-6xl mx-auto px-4">
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Quick answers to common questions. Can't find what you're looking for? Contact us directly.
            </p>
          </motion.div>

          <motion.div className="max-w-4xl mx-auto space-y-4" variants={staggerContainer}>
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 hover:border-yellow-300 transition-all duration-300 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-300"
                >
                  <h3 className="text-xl font-bold text-gray-900 pr-4">{faq.question}</h3>
                  <motion.div
                    animate={{ rotate: openFaqIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </button>

                <motion.div
                  initial={false}
                  animate={{
                    height: openFaqIndex === index ? "auto" : 0,
                    opacity: openFaqIndex === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-8 pb-6 pt-2 border-t border-gray-100">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Additional CTA */}
          <AnimatedSection className="text-center mt-16">
            <motion.div variants={fadeInUp}>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Still have questions?</h3>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
              >
                <Link to="/contact">Contact Support</Link>
              </motion.div>
            </motion.div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
