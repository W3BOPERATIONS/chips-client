import { Link } from "react-router-dom"
import ContactLink from "./ContactLink"

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-900 text-white py-12 mt-16 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%239C92AC' fillOpacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        ></div>
      </div>

      <div className="container mx-auto px-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <h3 className="text-2xl font-bold gradient-text">ChipsStore</h3>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Your favorite destination for premium quality chips and snacks. Fresh, crispy, and delicious!
            </p>
            
            {/* Social Media Links */}
            <div className="pt-4">
              <h4 className="text-lg font-semibold text-white mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>

                {/* Email */}
                <a
                  href="mailto:crunchywavez.contact@gmail.com"
                  className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg"
                  aria-label="Email"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gradient-to-br from-blue-700 to-blue-900 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-slate-300 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center space-x-2"
                >
                  <span>→</span>
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="text-slate-300 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center space-x-2"
                >
                  <span>→</span>
                  <span>Cart</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-slate-300 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center space-x-2"
                >
                  <span>→</span>
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-slate-300 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center space-x-2"
                >
                  <span>→</span>
                  <span>Contact</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-slate-300 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center space-x-2"
                >
                  <span>→</span>
                  <span>All Products</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* NEW: Legal Links Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-6">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/terms" 
                  className="text-slate-300 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center space-x-2"
                >
                  <span>⚖️</span>
                  <span>Terms & Conditions</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy" 
                  className="text-slate-300 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center space-x-2"
                >
                  <span>🔒</span>
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/refund" 
                  className="text-slate-300 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center space-x-2"
                >
                  <span>💰</span>
                  <span>Refund Policy</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/track-order" 
                  className="text-slate-300 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center space-x-2"
                >
                  <span>📦</span>
                  <span>Track Order</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/orders" 
                  className="text-slate-300 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center space-x-2"
                >
                  <span>📋</span>
                  <span>My Orders</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-6">Contact Info</h3>
            <div className="space-y-4">
              {/* Emails */}
              <div className="flex items-center space-x-3 text-slate-300 hover:text-white transition-colors duration-300">
                <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                  <span>📧</span>
                </div>
                <div className="flex flex-col">
                  <ContactLink
                    type="email"
                    value="crunchywavez.contact@gmail.com"
                    className="no-underline hover:no-underline text-sm"
                  />
                  <ContactLink
                    type="email"
                    value="booking.crunchywavezz@gmail.com"
                    className="no-underline hover:no-underline text-sm"
                  />
                </div>
              </div>

              {/* Phones */}
              <div className="flex items-center space-x-3 text-slate-300 hover:text-white transition-colors duration-300">
                <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                  <span>📞</span>
                </div>
                <div className="flex flex-col">
                  <ContactLink 
                    type="phone" 
                    value="+91 94283 62005" 
                    className="no-underline hover:no-underline text-sm" 
                  />
                  <ContactLink 
                    type="phone" 
                    value="+91 79843 31939" 
                    className="no-underline hover:no-underline text-sm" 
                  />
                </div>
              </div>

              {/* Address (single link) */}
              <div className="flex items-start space-x-3 text-slate-300 hover:text-white transition-colors duration-300">
                <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center mt-1">
                  <span>📍</span>
                </div>
                <a
                  href="https://www.google.com/maps?q=SF-228%20Samanvay%20Symphony,%20Vaikunth%20Crossing,%20Waghodia%20Main%20Road,%20Ankhol,%20Vadodara,%20Gujarat,%20India,%20390019"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="no-underline hover:no-underline text-sm leading-relaxed"
                >
                  SF-228 Samanvay Symphony, Vaikunth Crossing, Waghodia Main Road, Ankhol, Vadodara, Gujarat, 390019
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700/50 mt-12 pt-8 text-center">
          <p className="text-slate-400 text-sm">
            &copy; 2024 Crunchy Wavez. All rights reserved. Made with ❤️ for chip lovers everywhere.
          </p>
          <p className="text-slate-500 text-xs mt-2">
            By using our site, you acknowledge that you have read and agree to our 
            <Link to="/terms" className="text-slate-300 hover:text-white ml-1">Terms</Link>, 
            <Link to="/privacy" className="text-slate-300 hover:text-white ml-1">Privacy Policy</Link>, and 
            <Link to="/refund" className="text-slate-300 hover:text-white ml-1">Refund Policy</Link>.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer