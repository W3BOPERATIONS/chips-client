"use client";

import { Link } from "react-router-dom";

const TermsConditionPage = () => {
  const termsSections = [
    {
      id: 1,
      title: "Definitions",
      content: `"Company" refers to Shiv Hari Chips Pvt. Ltd.\n"You"/"User" refers to any person accessing or using this website.\n"Products" refers to packaged food items sold under the Crunchy Wavez brand.\n"Website" refers to www.crunchywavez.com`
    },
    {
      id: 2,
      title: "Eligibility",
      content: `You must be:\n- At least 18 years old, or\n- Using the website under parental/guardian supervision\n\nBy using this website, you confirm that you are legally capable of entering into a binding agreement.`
    },
    {
      id: 3,
      title: "Product Information",
      content: `All products are food-grade, FSSAI compliant, and manufactured under hygienic conditions.\nImages shown on the website are for illustration purposes only.\nActual product packaging, weight, and color may slightly vary.\nNutritional values are approximate and may vary by batch.`
    },
    {
      id: 4,
      title: "Pricing & Taxation",
      content: `All prices are in Indian Rupees (₹).\nPrices are inclusive of applicable GST, unless stated otherwise.\nThe company reserves the right to change prices without prior notice.\nAny pricing error may result in order cancellation.`
    },
    {
      id: 5,
      title: "Order Confirmation & Acceptance",
      content: `Placing an order does not guarantee acceptance.\nOrders may be cancelled due to:\n- Stock unavailability\n- Incorrect pricing\n- Payment failure\n- Suspected fraudulent activity\n\nThe company reserves full rights to refuse or cancel any order.`
    },
    {
      id: 6,
      title: "Shipping & Delivery",
      content: `Delivery timelines depend on location and courier service.\nEstimated delivery time is 3–7 working days.\nDelays due to natural calamities, strikes, or logistics issues are not under our control.\nIncorrect address provided by the customer may result in delivery failure.`
    },
    {
      id: 7,
      title: "Food Safety & Allergy Disclaimer",
      content: `Our products may contain or be processed in facilities that handle:\n- Milk\n- Nuts\n- Gluten\n- Spices\n\nCustomers with allergies should carefully read ingredient labels before consumption.\nThe company shall not be responsible for allergic reactions.`
    },
    {
      id: 8,
      title: "Intellectual Property",
      content: `All content including:\n- Brand name\n- Logo\n- Taglines\n- Images\n- Text\n- Packaging design\n\nare the intellectual property of Shiv Hari Chips Pvt. Ltd.\nAny unauthorized use is strictly prohibited.`
    },
    {
      id: 9,
      title: "Limitation of Liability",
      content: `The company shall not be liable for:\n- Any indirect or incidental damages\n- Delay in delivery\n- Product misuse\n- Allergic reactions\n- Loss due to incorrect storage`
    },
    {
      id: 10,
      title: "Governing Law",
      content: `These Terms shall be governed by and interpreted in accordance with the laws of India.\nAll disputes shall be subject to Vadodara / Gujarat jurisdiction only.`
    }
  ];

  const keyPrinciples = [
    {
      icon: "👤",
      title: "Eligibility",
      description: "18+ years or parental supervision required"
    },
    {
      icon: "📦",
      title: "Delivery",
      description: "3-7 working days across India"
    },
    {
      icon: "⚖️",
      title: "Jurisdiction",
      description: "Vadodara/Gujarat jurisdiction applies"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section - Matches Privacy Policy */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid"></div>
        <div className="container relative mx-auto px-4 py-20 md:py-28">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Last Updated: {new Date().toLocaleDateString('en-IN', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              Terms & <span className="text-green-400">Conditions</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              For Crunchy Wavez – Shiv Hari Chips Pvt. Ltd. Welcome to www.crunchywavez.com, owned and operated by Shiv Hari Chips Pvt. Ltd.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">FSSAI Compliant</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Legal Binding</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          {/* Introduction Card - Same as Privacy Policy */}
          <div className="relative group mb-16">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white rounded-2xl p-8 md:p-10 shadow-xl border border-gray-100">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl flex items-center justify-center shadow-md">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Important <span className="text-green-600">Notice</span>
                  </h2>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    By accessing or using this website, you agree to be bound by these Terms & Conditions. 
                    If you do not agree, please do not use the website. These terms govern your access to and use 
                    of our website, products, and services.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Terms Sections - Same styling as Privacy Policy */}
          <div className="space-y-8 mb-20">
            {termsSections.map((section) => (
              <div 
                key={section.id} 
                className="group cursor-pointer relative"
              >
                <div className="absolute -inset-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 blur-xl"></div>
                <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-200 group-hover:border-green-200 transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                  <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                    {/* Section Number - Same style */}
                    <div className="flex-shrink-0 relative">
                      <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                        <span className="text-2xl font-bold text-white">{section.id}</span>
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>

                    {/* Content - Same style */}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-700 transition-colors duration-300">
                        {section.title}
                      </h3>
                      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 group-hover:bg-green-50/50 group-hover:border-green-100 transition-all duration-300">
                        <div className="space-y-3">
                          {section.content.split('\n').map((paragraph, index) => (
                            paragraph.trim() && (
                              <div key={index} className="flex items-start">
                                {paragraph.startsWith('- ') ? (
                                  <>
                                    <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    <span className="text-gray-600">{paragraph.substring(2)}</span>
                                  </>
                                ) : paragraph.startsWith('"') ? (
                                  <span className="text-gray-600 font-medium">{paragraph}</span>
                                ) : (
                                  <span className="text-gray-600">{paragraph}</span>
                                )}
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Key Points Section - Same as Data Protection Principles */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Key <span className="text-green-600">Highlights</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Important aspects of our terms that you should know
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {keyPrinciples.map((principle, index) => (
                <div 
                  key={index}
                  className="group relative"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                  <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-200 group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl text-3xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md">
                        {principle.icon}
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors duration-300">
                        {principle.title}
                      </h4>
                      <p className="text-gray-600">
                        {principle.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section - Exact same as Privacy Policy */}
          <div className="relative group mb-16">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-10 text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/10 rounded-full translate-y-20 -translate-x-20"></div>
              
              <div className="relative text-center max-w-2xl mx-auto">
                <h3 className="text-3xl font-bold mb-6">
                  Questions About Our Terms?
                </h3>
                <p className="text-gray-300 mb-10 text-lg">
                  Need clarification on any of our terms? Reach out to our legal team for assistance.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl mx-auto">
                  {/* Email - Exact same styling */}
                  <div className="group/item relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl blur opacity-0 group-hover/item:opacity-50 transition duration-500"></div>
                    <div className="relative bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-green-400/50 transition-all duration-300 group-hover/item:bg-white/15">
                      <div className="flex flex-col items-center gap-4 text-center">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Email</h4>
                          <a 
                            href="mailto:crunchywavez.contact@gmail.com" 
                            className="text-green-300 hover:text-green-200 transition-colors duration-300 group-hover/item:underline inline-block px-2 py-1 bg-white/5 rounded"
                          >
                            crunchywavez.contact@gmail.com
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Phone - Exact same styling */}
                  <div className="group/item relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl blur opacity-0 group-hover/item:opacity-50 transition duration-500"></div>
                    <div className="relative bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-green-400/50 transition-all duration-300 group-hover/item:bg-white/15">
                      <div className="flex flex-col items-center gap-4 text-center">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Phone</h4>
                          <a 
                            href="tel:+919428362005" 
                            className="text-green-300 hover:text-green-200 transition-colors duration-300 group-hover/item:underline inline-block px-2 py-1 bg-white/5 rounded"
                          >
                            +91 94283 62005
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links - Same styling */}
          <div className="pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <p className="text-gray-600 text-lg">
                  Need to review our other policies?
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Complete transparency across all our legal documents
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/privacy"
                  className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl font-medium hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-600 to-gray-800 rounded-xl blur opacity-0 group-hover:opacity-50 transition duration-500"></div>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="relative">Privacy Policy</span>
                </Link>
                <Link 
                  to="/refund"
                  className="group relative inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-800 rounded-xl font-medium hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 border border-gray-300 hover:border-green-300"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl blur opacity-0 group-hover:opacity-50 transition duration-500"></div>
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2h1v2a2 2 0 01-2 2H3a1 1 0 110-2h1V8a1 1 0 00-1-1H3a1 1 0 110-2h1a2 2 0 012-2h8a2 2 0 012 2v1a1 1 0 11-2 0V6a1 1 0 00-1-1H7a1 1 0 100 2h8a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2v-1a1 1 0 10-2 0v1a4 4 0 004 4h8a4 4 0 004-4V8a4 4 0 00-4-4H7a4 4 0 00-4 4z" clipRule="evenodd" />
                  </svg>
                  <span className="relative">Refund Policy</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditionPage;