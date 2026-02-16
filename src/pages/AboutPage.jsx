"use client"

import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useEffect, useState } from "react"

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } }
}

// Animated component wrapper
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

// Counter component for live counting
const Counter = ({ end, duration = 2 }) => {
  const [count, setCount] = useState(0)
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  useEffect(() => {
    if (inView) {
      let start = 0
      const increment = end / (duration * 60) // 60fps
      const timer = setInterval(() => {
        start += increment
        if (start >= end) {
          setCount(end)
          clearInterval(timer)
        } else {
          setCount(Math.ceil(start))
        }
      }, 1000 / 60) // 60fps

      return () => clearInterval(timer)
    }
  }, [end, duration, inView])

  return <span ref={ref}>{count}+</span>
}

const AboutPage = () => {
  const teamMembers = [
    {
      name: "Bhatt Devanshi",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
      description: "Passionate about bringing authentic Indian snacks to the world.",
      social: {
        linkedin: "#",
        instagram: "#",
        email: "#"
      }
    },
    {
      name: "Parth Parekh",
      role: "Founder & CFO",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
      description: "Ensures quality and freshness in every product we deliver.",
      social: {
        linkedin: "#",
        instagram: "#",
        email: "#"
      }
    },
    // {
    //   name: "Amit Patel",
    //   role: "Product Manager",
    //   image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=400&fit=crop&crop=face",
    //   description: "Curates the best snacks from across India for our customers.",
    //   social: {
    //     linkedin: "#",
    //     twitter: "#",
    //     email: "#"
    //   }
    // },
  ]

  const values = [
    {
      icon: "🌿",
      title: "Sun Dried & Roasted",
      description: "Crafted with the slice-dry-roast method for natural, oil-light crunch.",
      bgImage: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      icon: "👩‍🍳",
      title: "Empowering Women",
      description: "Partnering with rural women to preserve skills and create sustainable livelihoods.",
      bgImage: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      icon: "💫",
      title: "True Indian Flavours",
      description: "Authentic spices and seasonings, thoughtfully layered for a modern taste.",
      bgImage: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      icon: "❤️",
      title: "Care in Every Bite",
      description: "Small-batch, mindful production that honors people, tradition, and the planet.",
      bgImage: "https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
  ]

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Enhanced Hero Section */}
      <div
        className="relative text-white overflow-hidden min-h-[80vh] flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1556760544-74068565f05c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="relative w-full max-w-6xl mx-auto px-4 py-20 text-center">
          <AnimatedSection>
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-2xl"
              variants={fadeInUp}
            >
              About Crunchy Wavez
            </motion.h1>
            <motion.p className="text-xl md:text-2xl leading-relaxed mb-8 max-w-4xl mx-auto text-gray-100 drop-shadow-lg" variants={fadeInUp}>
              A celebration of India's culinary heritage — reimagined for the modern, health-conscious consumer.
              Tradition, Elevated.
            </motion.p>

            <motion.div
              className="flex flex-wrap justify-center gap-12 md:gap-16 text-center"
              variants={staggerContainer}
            >
              {[
                { number: "10000", label: "Happy Customers" },
                { number: "10", label: "Craftswomen Empowered" },
                { number: "5", label: "Authentic Indian flavours. " }
              ].map((stat, index) => (
                <motion.div key={index} variants={fadeInUp} className="group">
                  <div className="text-4xl md:text-6xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300 text-yellow-400 drop-shadow-lg">
                    <Counter end={parseInt(stat.number)} duration={2} />
                  </div>
                  <div className="text-gray-200 font-medium text-lg mt-4">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatedSection>
        </div>
      </div>

      {/* Our Story Section with Unique Background Image */}
      <div
        className="relative py-24 min-h-[700px] flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.90)), url('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="w-full max-w-6xl mx-auto px-4">
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Where tradition meets innovation in every crunch
            </p>
          </motion.div>

          <AnimatedSection className="relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div variants={staggerContainer}>
                <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
                  {[
                    "Crunchy Wavez began as a simple experiment — two friends, a traditional sun-dried potato recipe, and a desire to innovate. Baked, not fried, and layered with bold Indian flavours, the chips captured hearts even before the brand existed.",
                    "We saw a world of fried, unhealthy snacks and fading traditional methods. Crunchy Wavez was born to make wholesome, roasted snacks, celebrate authentic Indian flavours, and empower rural women by turning their culinary skills into sustainable livelihoods.",
                    "From school competitions to PIERC incubation and pitching at TiE Women Vadodara, every step strengthened our bond as founders. Today, Crunchy Wavez is more than a snack — it's a craft, a culture, and a cause, one crunch at a time."
                  ].map((paragraph, index) => (
                    <motion.div
                      key={index}
                      variants={fadeInUp}
                      className="relative group"
                    >
                      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border-l-4 border-green-500 transition-all duration-300 group-hover:shadow-xl group-hover:bg-white group-hover:border-green-600">
                        <p className="text-gray-700">{paragraph}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div className="relative" variants={scaleIn}>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                  <img
                    src="https://t3.ftcdn.net/jpg/04/15/15/64/360_F_415156437_VNwaQnydu0FRpG4jAmndvbqspNIoIard.jpg"
                    alt="Traditional Indian snacks"
                    className="w-full h-96 object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Craft Philosophy Section */}
      <div
        className="relative py-24 min-h-[800px] flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.88), rgba(255,255,255,0.92)), url('https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="w-full max-w-6xl mx-auto px-4">
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Craft Philosophy</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Snacks that celebrate tradition, taste, and conscious living
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="group relative h-80 rounded-3xl overflow-hidden shadow-2xl transform hover:scale-102 transition-all duration-500"
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${value.bgImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-500">
                    {value.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{value.title}</h3>
                  <p className="text-gray-200 leading-relaxed">{value.description}</p>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Mission Section with Unique Background Image */}
      <div
        className="relative py-24 text-white min-h-[600px] flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.8)), url('https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <motion.div
          className="relative w-full max-w-5xl mx-auto px-4 text-center"
          variants={fadeInUp}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white drop-shadow-2xl">Our Mission</h2>
          <p className="text-xl md:text-2xl leading-relaxed mb-8 text-gray-100 drop-shadow-lg max-w-4xl mx-auto">
            To make healthier snacking accessible by blending traditional Indian food practices with modern, responsible production.
          </p>
          <p className="text-lg md:text-xl leading-relaxed mb-12 text-gray-200 drop-shadow-lg max-w-4xl mx-auto">
            We are committed to preserving the slice–dry–roast method, developing authentic Indian flavours, and creating value through ethical sourcing, women-led production, and thoughtful craftsmanship — without compromising on taste or quality
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-gradient-to-r from-green-400 to-emerald-600 text-white px-10 py-4 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-300"
          >
            <Link to="/">
              Experience Tradition
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Team Section with Unique Background Image */}
      <div
        className="relative py-24 min-h-[800px] flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.90), rgba(255,255,255,0.94)), url('https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="w-full max-w-6xl mx-auto px-4">
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">The Team Behind Crunchy Wavez</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The team that brings tradition, care, and crunch together.
            </p>
          </motion.div>

          {/* Centered team cards with max-width constraint */}
          <div className="flex justify-center">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl"
              variants={staggerContainer}
            >
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  className="group relative"
                  variants={fadeInUp}
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-100 transform group-hover:shadow-xl transition-all duration-500 h-full">
                    <div className="relative h-80 overflow-hidden">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

                      {/* Social Links with proper icons */}
                      <div className="absolute top-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                        <a
                          href={member.social.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-blue-50 transition-all duration-200 shadow-lg hover:scale-110 transform"
                        >
                          <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </a>
                        <a
                          href={member.social.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-pink-50 transition-all duration-200 shadow-lg hover:scale-110 transform"
                        >
                          <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>
                        </a>
                        <a
                          href={`mailto:${member.social.email}`}
                          className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-green-50 transition-all duration-200 shadow-lg hover:scale-110 transform"
                        >
                          <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 5.712v-9.458l4.623 3.746zm-4.141-5.929h19.035l-9.517 7.713-9.518-7.713zm5.694 7.188l3.824 3.099 3.83-3.104 5.612 6.817h-18.779l5.513-6.812zm9.208-1.264l4.616-3.741v9.348l-4.616-5.607z"/>
                          </svg>
                        </a>
                      </div>
                    </div>

                    <div className="p-8 bg-white">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{member.name}</h3>
                      <div className="text-green-600 font-semibold text-lg mb-4">{member.role}</div>
                      <p className="text-gray-600 leading-relaxed text-base">{member.description}</p>

                      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Contact CTA with Unique Background Image */}
      <div
        className="relative py-20 min-h-[400px] flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.88), rgba(255,255,255,0.92)), url('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <AnimatedSection className="relative w-full max-w-4xl mx-auto px-4 text-center">
          <motion.div variants={fadeInUp}>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Join Our Journey</h2>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Experience snacks crafted with tradition, care, and purpose. Get in touch to learn more about our story.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-gradient-to-r from-green-400 to-emerald-600 text-white px-10 py-4 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-300"
            >
              <Link to="/contact">
                Connect With Us
              </Link>
            </motion.div>
          </motion.div>
        </AnimatedSection>
      </div>
    </div>
  )
}

export default AboutPage