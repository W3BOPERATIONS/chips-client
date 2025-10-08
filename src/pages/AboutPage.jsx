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
      name: "Rajesh Kumar",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
      description: "Passionate about bringing authentic Indian snacks to the world.",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "#"
      }
    },
    {
      name: "Priya Sharma",
      role: "Head of Operations",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
      description: "Ensures quality and freshness in every product we deliver.",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "#"
      }
    },
    {
      name: "Amit Patel",
      role: "Product Manager",
      image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=400&fit=crop&crop=face",
      description: "Curates the best snacks from across India for our customers.",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "#"
      }
    },
  ]

  const values = [
    {
      icon: "🌿",
      title: "Dried & Roasted",
      description: "Never fried. Our traditional slice-dry-roast technique preserves natural flavors without excess oil.",
      bgImage: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      icon: "👩‍🍳",
      title: "Women-Led Production",
      description: "Empowering rural women through sustainable livelihood and preserving traditional craftsmanship.",
      bgImage: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      icon: "💫",
      title: "Authentic Seasonings",
      description: "Traditional Indian flavors curated with precision for the modern palate.",
      bgImage: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      icon: "❤️",
      title: "Mindful Craftsmanship",
      description: "Small-batch production with care for both people and planet.",
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
                { number: "500", label: "Craftswomen Empowered" },
                { number: "50", label: "Traditional Recipes" }
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
                    "Crunchy Wavez is a celebration of India's culinary heritage — reimagined for the modern, health-conscious consumer. Rooted in traditional wisdom, our chips are crafted using the classic slice–dry–roast technique, preserving the natural essence of real potatoes without the excess oil of conventional frying.",
                    "Each batch is patiently dried, gently roasted and delicately seasoned, resulting in a light yet deeply flavourful crunch. We proudly partner with skilled rural women, transforming age-old home-style preparation into a sustainable livelihood model.",
                    "Every pack represents not just a snack — but a craft, a culture and a cause. We're here to protect memories, preserve wisdom, and pass on a legacy with every bite."
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
              The art of creating snacks that nourish both body and soul
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
            To create healthy, mindful, and culturally-rooted snacks that nourish both body and soul.
          </p>
          <p className="text-lg md:text-xl leading-relaxed mb-12 text-gray-200 drop-shadow-lg max-w-4xl mx-auto">
            We believe that food is more than taste — it is culture, care, and connection. The slice–dry–roast technique 
            we follow is not an industry process; it is a tradition passed down through Indian households for generations.
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
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The passionate guardians of tradition who work to bring you an elevated snacking experience.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
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
                    
                    {/* Social Links */}
                    <div className="absolute top-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                      {Object.entries(member.social).map(([platform, link]) => (
                        <button
                          key={platform}
                          className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-all duration-200 shadow-lg hover:scale-110 transform"
                        >
                          <span className="w-5 h-5 text-gray-700">🔗</span>
                        </button>
                      ))}
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