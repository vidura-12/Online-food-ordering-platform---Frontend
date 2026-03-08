import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import Header from '../../components/common/headerlanding'
import Footer from '../../components/common/footerLanding'
// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const routes = {
  malabe: {
    path: [
      [6.9097, 79.9644],
      [6.9150, 79.9572],
      [6.9200, 79.9500],
      [6.9250, 79.9450],
    ],
    name: "Malabe"
  },
  athurugiriya: {
    path: [
      [6.8631, 79.9772],
      [6.8680, 79.9720],
      [6.8730, 79.9670],
      [6.8780, 79.9620],
    ],
    name: "Athurugiriya"
  },
  kaduwela: {
    path: [
      [6.9357, 79.9857],
      [6.9300, 79.9800],
      [6.9250, 79.9750],
      [6.9200, 79.9700],
    ],
    name: "Kaduwela"
  },
  battaramulla: {
    path: [
      [6.8964, 79.9181],
      [6.9010, 79.9130],
      [6.9060, 79.9080],
      [6.9110, 79.9030],
    ],
    name: "Battaramulla"
  },
  rajagiriya: {
    path: [
      [6.9067, 79.8947],
      [6.9110, 79.8990],
      [6.9160, 79.9040],
      [6.9210, 79.9090],
    ],
    name: "Rajagiriya"
  },
  borella: {
    path: [
      [6.9304, 79.8798],
      [6.9250, 79.8840],
      [6.9200, 79.8890],
      [6.9150, 79.8940],
    ],
    name: "Borella"
  },
};

const DriverTracking = () => {
  const [currentLocation, setCurrentLocation] = useState(routes.malabe.path[0]);
  const [deliveryArea, setDeliveryArea] = useState('malabe');
  const [progress, setProgress] = useState(0);
  const [isDelivered, setIsDelivered] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (progress < routes[deliveryArea].path.length - 1) {
        setProgress(prev => prev + 1);
        setCurrentLocation(routes[deliveryArea].path[progress]);
      } else {
        setIsDelivered(true);
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [progress, deliveryArea, isPaused]);

  const resetDelivery = () => {
    setProgress(0);
    setCurrentLocation(routes[deliveryArea].path[0]);
    setIsDelivered(false);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
   
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
       <Header/>
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Delivery Tracking System</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Area</label>
                <select 
                  value={deliveryArea}
                  onChange={(e) => {
                    setDeliveryArea(e.target.value);
                    resetDelivery();
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  {Object.entries(routes).map(([key, area]) => (
                    <option key={key} value={key}>{area.name}</option>
                  ))}
                </select>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Delivery Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${isDelivered ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {isDelivered ? 'Delivered' : 'In Transit'}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${isDelivered ? 'bg-green-500' : 'bg-blue-500'} transition-all duration-500 ease-out`}
                      style={{ width: `${(progress / (routes[deliveryArea].path.length - 1)) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-right mt-1 text-sm text-gray-600">
                    {Math.round((progress / (routes[deliveryArea].path.length - 1)) * 100)}% Complete
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={togglePause}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium ${isPaused ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-yellow-500 hover:bg-yellow-600 text-white'}`}
                  >
                    {isPaused ? 'Resume' : 'Pause'}
                  </button>
                  <button
                    onClick={resetDelivery}
                    className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium text-gray-800 transition"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            <div className="h-80 md:h-full rounded-lg overflow-hidden shadow-md border border-gray-200">
              <MapContainer 
                center={currentLocation} 
                zoom={14} 
                className="h-full w-full"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={currentLocation}>
                  <Popup className="font-medium">Your current location</Popup>
                </Marker>
                <Polyline 
                  positions={routes[deliveryArea].path} 
                  color="#3b82f6" 
                  weight={3}
                  dashArray="5, 5"
                />
              </MapContainer>
            </div>
          </div>

          <div className="mt-6 bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">Delivery Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Current Area:</p>
                <p className="font-medium">{routes[deliveryArea].name}</p>
              </div>
              <div>
                <p className="text-gray-600">Next Stop:</p>
                <p className="font-medium">
                  {progress < routes[deliveryArea].path.length - 1 ? 
                    `${routes[deliveryArea].path[progress + 1][0].toFixed(4)}, ${routes[deliveryArea].path[progress + 1][1].toFixed(4)}` : 
                    'Destination reached'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default DriverTracking;