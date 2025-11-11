"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { buildApiUrl } from "../config/api";
import ContactLink from "../components/ContactLink";

// Animation variants (same as AboutPage)
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// Animated component wrapper (same as AboutPage)
const AnimatedSection = ({ children, className = "" }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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
  );
};

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(buildApiUrl("api/contact"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("[v0] Contact form error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const mapAddress =
    "SF-228 Samanvay Symphony, Vaikunth Crossing, Waghodia Main Road, Ankhol, Vadodara, Gujarat, India, 390019";
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    mapAddress
  )}`;

  const contactInfo = [
    {
      icon: "📍",
      title: "Visit Us",
      details: [
        <a
          key="full-address"
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="no-underline text-gray-700 hover:text-blue-600 transition-colors duration-300"
        >
          <span>SF-228 Samanvay Symphony, Vaikunth Crossing</span>
          <br />
          <span>Waghodia Main Road, Ankhol</span>
          <br />
          <span>Vadodara, Gujarat, India, 390019</span>
        </a>,
      ],
    },
    {
      icon: "📞",
      title: "Call Us",
      details: [
        <ContactLink
          key="phone1"
          type="phone"
          value="+91 94283 62005"
          className="text-gray-800 hover:text-blue-600 font-medium no-underline transition-colors duration-300"
        />,
        <ContactLink
          key="phone2"
          type="phone"
          value="+91 79843 31939"
          className="text-gray-800 hover:text-blue-600 font-medium no-underline transition-colors duration-300"
        />,
        "Mon-Sat 9AM-7PM",
      ],
    },
    {
      icon: "✉️",
      title: "Email Us",
      details: [
        <ContactLink
          key="email1"
          type="email"
          value="crunchywavez.contact@gmail.com"
          className="text-gray-800 hover:text-blue-600 font-medium no-underline transition-colors duration-300"
        />,
        <ContactLink
          key="email2"
          type="email"
          value="booking.crunchywavezz@gmail.com"
          className="text-gray-800 hover:text-blue-600 font-medium no-underline transition-colors duration-300"
        />,
        "We reply within 24 hours",
      ],
    },
  ];

  const faqs = [
    {
      question: "What makes Crunchy Wavez different?",
      answer:
        "Our chips are sun-dried and roasted, not fried, crafted in small batches with authentic Indian seasonings for a light, healthy crunch.",
    },
    {
      question: "Are these chips healthy?",
      answer:
        "Yes! Low in oil, preservative-free, and naturally flavorful, they're a guilt-free snack for modern lifestyles.",
    },
    {
      question: "Who makes the chips?",
      answer:
        "Skilled rural women craft every batch, blending tradition with purpose and creating sustainable livelihoods.",
    },
    {
      question: "What ingredients are used?",
      answer:
        "We use 100% real potatoes, natural spices, and minimal oil — nothing artificial.",
    },
    {
      question: "Suitable for all ages?",
      answer:
        "Absolutely. Kids, adults, everyone can enjoy a wholesome, crunchy snack.",
    },
    {
      question: "How should I store them?",
      answer:
        "Keep in a cool, dry place and reseal after opening to maintain freshness.",
    },
    {
      question: "Can I place bulk or custom orders?",
      answer:
        "Yes! We offer bulk orders and custom packaging for events or gifting.",
    },
    {
      question: "Are your practices sustainable?",
      answer:
        "Absolutely. From artisan production to women-led empowerment, we focus on ethical, responsible snacking.",
    },
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Enhanced Hero Section with Background Image */}
      <div
        className="relative text-white overflow-hidden min-h-[70vh] flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1621447504864-d8686e12698c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="relative w-full max-w-6xl mx-auto px-4 py-20 text-center">
          <AnimatedSection>
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-2xl"
              variants={fadeInUp}
            >
              Get In Touch
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl leading-relaxed mb-8 max-w-4xl mx-auto text-gray-100 drop-shadow-lg"
              variants={fadeInUp}
            >
              Have a question, suggestion, or just want to say hello? We'd love
              to hear from you. Our friendly team is here to help make your
              snacking experience amazing.
            </motion.p>
          </AnimatedSection>
        </div>
      </div>

      {/* Contact Info Cards with Enhanced Design */}
      <div
        className="relative py-24 min-h-[600px] flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.90)), url('https://images.unsplash.com/photo-1556760544-74068565f05c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="w-full max-w-6xl mx-auto px-4">
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Crunchywavez
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Multiple ways to connect with our team. We're always here to help!
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
            variants={staggerContainer}
          >
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                className="group relative rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-xl transform hover:scale-[1.02] transition-all duration-500"
                variants={fadeInUp}
                whileHover={{ y: -8 }}
              >
                <div className="h-full flex flex-col justify-center items-center p-8 text-center relative z-10">
                  <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-500">
                    {info.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    {info.title}
                  </h3>
                  <div className="space-y-3">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-700 leading-relaxed">
                        {detail}
                      </p>
                    ))}
                  </div>
                </div>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <AnimatedSection className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-gray-100 self-start">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Send us a Message
              </h2>

              {submitStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6"
                >
                  Thank you for your message! We'll get back to you within 24
                  hours.
                </motion.div>
              )}

              {submitStatus === "error" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
                >
                  There was an error sending your message. Please try again or
                  email us directly at crunchywavez.contact@gmail.com
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div variants={fadeInUp}>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
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
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
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
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
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
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
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
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
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
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
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
                <div className="w-full h-80">
                  <iframe
                    title="Crunchywavez Location"
                    src="https://www.google.com/maps?q=SF-228%20Samanvay%20Symphony,%20Vaikunth%20Crossing,%20Waghodia%20Main%20Road,%20Ankhol,%20Vadodara,%20Gujarat,%20India,%20390019&z=16&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="text-gray-700 font-semibold">
                    SF-228 Samanvay Symphony, Vaikunth Crossing, Waghodia Main
                    Road, Ankhol, Vadodara, Gujarat, 390019
                  </div>
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=SF-228%20Samanvay%20Symphony,%20Vaikunth%20Crossing,%20Waghodia%20Main%20Road,%20Ankhol,%20Vadodara,%20Gujarat,%20India,%20390019"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline transition-colors duration-300"
                  >
                    Directions
                  </a>
                </div>
              </AnimatedSection>

              {/* Enhanced Business Hours */}
              <AnimatedSection className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Business Hours
                </h3>
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
                      <span className="text-gray-700 font-medium">
                        {schedule.day}
                      </span>
                      <span
                        className={`font-bold ${
                          schedule.open ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {schedule.time}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </AnimatedSection>

              {/* Enhanced Quick Links */}
              <AnimatedSection className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Quick Links
                </h3>
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
                    <motion.div
                      key={index}
                      whileHover={{ x: 5 }}
                      className="group"
                    >
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
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Quick answers to common questions. Can't find what you're looking
              for? Contact us directly.
            </p>
          </motion.div>

          <motion.div
            className="max-w-4xl mx-auto space-y-4"
            variants={staggerContainer}
          >
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
                  <h3 className="text-xl font-bold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openFaqIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <svg
                      className="w-6 h-6 text-yellow-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
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
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Additional CTA */}
          <AnimatedSection className="text-center mt-16">
            <motion.div variants={fadeInUp}>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Want to know more about us?
              </h3>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
              >
                <Link to="/about">Learn Our Story</Link>
              </motion.div>
            </motion.div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
