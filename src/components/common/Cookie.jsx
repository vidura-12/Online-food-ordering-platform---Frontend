import React, { useState, useEffect } from "react";
import { FaTimes, FaCookieBite } from "react-icons/fa";

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(true);
  const [showCustomize, setShowCustomize] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Add smooth entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleAcceptAll = () => {
    // Implement your cookie acceptance logic here
    setIsVisible(false);
    setTimeout(() => setShowConsent(false), 300);
  };

  const handleReject = () => {
    // Implement your cookie rejection logic here
    setIsVisible(false);
    setTimeout(() => setShowConsent(false), 300);
  };

  const toggleCustomize = () => {
    setShowCustomize(!showCustomize);
  };

  if (!showConsent) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50 transition-all duration-300 transform ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex flex-row items-start justify-between">
          {/* Left side - Description */}
          <div className="flex-1 pr-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-1">
                <FaCookieBite className="h-6 w-6 text-gray-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">We Value Your Privacy</h3>
                <p className="text-gray-700 leading-relaxed">
                  <span className="font-medium">Cookies:</span> We and our partners use cookies and similar technologies to analyse traffic, 
                  tailor and improve our content and services (like showing you great restaurants 
                  and shops we'd think you'd like), serve relevant ads and measure their effectiveness. 
                  To help make ads relevant we may share your data with advertising partners. 
                  <a href="#" className="text-blue-600 hover:text-blue-800 ml-1">
                    Learn more in our Cookie Policy
                  </a>.
                </p>
              </div>
            </div>

            {showCustomize && (
              <div className="mt-6 p-5 bg-gray-50 rounded-lg transition-all duration-200">
                <h4 className="font-medium text-gray-900 mb-4 text-lg">Customize Cookie Preferences</h4>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="essential"
                      name="essential"
                      type="checkbox"
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked
                      disabled
                    />
                    <label htmlFor="essential" className="ml-3 block text-gray-700">
                      <span className="font-medium">Essential Cookies</span>
                      <span className="text-sm text-gray-500 block">Required for basic site functionality</span>
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="analytics"
                      name="analytics"
                      type="checkbox"
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      defaultChecked
                    />
                    <label htmlFor="analytics" className="ml-3 block text-gray-700">
                      <span className="font-medium">Analytics Cookies</span>
                      <span className="text-sm text-gray-500 block">Help us improve our website</span>
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="marketing"
                      name="marketing"
                      type="checkbox"
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      defaultChecked
                    />
                    <label htmlFor="marketing" className="ml-3 block text-gray-700">
                      <span className="font-medium">Marketing Cookies</span>
                      <span className="text-sm text-gray-500 block">Used for personalized advertising</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right side - Buttons */}
          <div className="flex flex-col space-y-3 min-w-[280px] pl-4">
            {!showCustomize ? (
              <>
                <button
                  onClick={handleAcceptAll}
                  className="px-6 py-3 bg-gray-900 text-white font-medium rounded-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                >
                  Accept All Cookies
                </button>
                <button
                  onClick={handleReject}
                  className="px-6 py-3 border border-gray-300 bg-white font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                >
                  Reject Non-Essential
                </button>
                <button
                  onClick={toggleCustomize}
                  className="px-6 py-3 border border-gray-300 bg-white font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                >
                  Customize Settings
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleAcceptAll}
                  className="px-6 py-3 bg-gray-900 text-white font-medium rounded-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                >
                  Save Preferences
                </button>
                <button
                  onClick={toggleCustomize}
                  className="px-6 py-3 border border-gray-300 bg-white font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                >
                  Back
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;