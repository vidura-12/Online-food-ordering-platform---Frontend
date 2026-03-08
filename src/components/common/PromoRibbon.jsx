import React from "react";
import { FaUtensils } from "react-icons/fa";

const PromoRibbon = () => {
  return (
    <div 
      className="w-full relative overflow-hidden"
      style={{ 
        height: "520px",  // Increased height
        backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSIzMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgY2xpcC1wYXRoPSJ1cmwoI2EpIj48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMCAwaDE0NDB2MzIwSDB6Ii8+PGcgZmlsdGVyPSJ1cmwoI2MpIj48cGF0aCBkPSJNNzIwIDYwYzM4MyAwIDk1MyAyNjAgOTUzIDI2MEgtMjMzUzMzNyA2MCA3MjAgNjBaIiBmaWxsPSJ1cmwoI2QpIiBmaWxsLW9wYWNpdHk9Ii4xNSIvPjwvZz48L2c+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMTQ0MCIgeTE9IjMyMCIgeDI9IjEwNTEuMjQiIHkyPSItMzk5Ljc2OSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiMwQ0IiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDdFODkiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iZCIgeDE9IjcyMCIgeTE9IjYwIiB4Mj0iNzIwIiB5Mj0iMzIwIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iI2ZmZiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2ZmZiIgc3RvcC1vcGFjaXR5PSIuNDgiLz48L2xpbmVhckdyYWRpZW50PjxjbGlwUGF0aCBpZD0iYSI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTAgMGgxNDQwdjMyMEgweiIvPjwvY2xpcFBhdGg+PGZpbHRlciBpZD0iYyIgeD0iLTI2NSIgeT0iMjgiIHdpZHRoPSIxOTcwIiBoZWlnaHQ9IjMyNCIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiPjxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAiIHJlc3VsdD0iQmFja2dyb3VuZEltYWdlRml4Ii8+PGZlQmxlbmQgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9InNoYXBlIi8+PGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMTYiIHJlc3VsdD0iZWZmZWN0MV9mb3JlZ3JvdW5kQmx1cl8xMDY4XzExNTI1MCIvPjwvZmlsdGVyPjwvZGVmcz48L3N2Zz4=')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      {/* Content container */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between text-white">
            {/* Left side - Main promo text */}
            <div className="mb-4 md:mb-0 md:mr-8 w-full md:w-2/3 lg:w-3/4">  {/* Increased width */}
              <div className="flex items-center mb-6">
                <FaUtensils className="text-4xl md:text-5xl mr-4 text-yellow-400" />  {/* Larger icon */}
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">  {/* Larger text */}
                  Up to <span className="text-yellow-400">25% OFF</span> Meal Deals This <span className="text-red-400">New Year!</span>
                </h2>
              </div>
              <p className="mt-4 text-xl md:text-2xl lg:text-3xl max-w-3xl leading-relaxed">  {/* Larger text */}
                Need a midweek pick-me-up, a break from cooking for the family, or just craving your favorite restaurant?
                <br />
                Now's the perfect time to treat yourself!
              </p>
              
              <div className="mt-6 text-lg md:text-xl opacity-90">  {/* Better spacing */}
                <p>Limited time offer. Subject to availability at participating restaurants.</p>
                <p>Service and delivery fees may apply. See terms for details.</p>
              </div>
              
              <button className="mt-8 px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-full text-lg md:text-xl transition duration-300 transform hover:scale-105"style={{ backgroundColor: "rgba(255,88,35,255)" }}>
                Order Now →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoRibbon;