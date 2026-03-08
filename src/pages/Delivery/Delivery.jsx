import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const routes = {
  malabe: [
    [6.9097, 79.9644], // Starting point
    [6.9150, 79.9572],
    [6.9200, 79.9500],
    [6.9250, 79.9450], // Destination
  ],
  athurugiriya: [
    [6.8631, 79.9772],
    [6.8680, 79.9720],
    [6.8730, 79.9670],
    [6.8780, 79.9620],
  ],
  kaduwela: [
    [6.9357, 79.9857],
    [6.9300, 79.9800],
    [6.9250, 79.9750],
    [6.9200, 79.9700],
  ],
  battaramulla: [
    [6.8964, 79.9181],
    [6.9010, 79.9130],
    [6.9060, 79.9080],
    [6.9110, 79.9030],
  ],
  rajagiriya: [
    [6.9067, 79.8947],
    [6.9110, 79.8990],
    [6.9160, 79.9040],
    [6.9210, 79.9090],
  ],
  borella: [
    [6.9304, 79.8798],
    [6.9250, 79.8840],
    [6.9200, 79.8890],
    [6.9150, 79.8940],
  ],
};

const DriverTracking = () => {
  const [currentLocation, setCurrentLocation] = useState([6.9097, 79.9644]);
  const [deliveryArea, setDeliveryArea] = useState('malabe');
  const [progress, setProgress] = useState(0);
  const [isDelivered, setIsDelivered] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (progress < routes[deliveryArea].length - 1) {
        setProgress(prev => prev + 1);
        setCurrentLocation(routes[deliveryArea][progress]);
      } else {
        setIsDelivered(true);
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [progress, deliveryArea]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-md overflow-hidden p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Track Your Delivery</h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Delivery Area:</label>
          <select 
            value={deliveryArea} 
            onChange={(e) => {
              setDeliveryArea(e.target.value);
              setProgress(0);
              setCurrentLocation(routes[e.target.value][0]);
              setIsDelivered(false);
            }}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            {Object.keys(routes).map(area => (
              <option key={area} value={area}>
                {area.charAt(0).toUpperCase() + area.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="h-96 w-full mb-6 rounded-lg overflow-hidden shadow-md">
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
              <Popup className="font-medium">Your delivery is here</Popup>
            </Marker>
          </MapContainer>
        </div>

        <div className="text-center space-y-4">
          <p className={`text-lg font-medium ${isDelivered ? 'text-green-600' : 'text-blue-600'}`}>
            {isDelivered ? 'Delivered!' : 'On the way...'}
          </p>
          
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className={`h-4 rounded-full ${isDelivered ? 'bg-green-500' : 'bg-blue-500'} transition-all duration-500 ease-in-out`}
              style={{ width: `${(progress / (routes[deliveryArea].length - 1)) * 100}%` }}
            ></div>
          </div>
          
          <p className="text-gray-700">
            Progress: <span className="font-semibold">{Math.round((progress / (routes[deliveryArea].length - 1)) * 100)}%</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DriverTracking;