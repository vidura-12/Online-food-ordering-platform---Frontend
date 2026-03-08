import React, { useState, useEffect } from 'react';
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = "AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao"; // Ensure it's in your .env file

const CitiesNearMe = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '12px',
    marginTop: '20px'
  };

  const defaultCenter = { lat: 6.9271, lng: 79.8612 }; // Default to Colombo, Sri Lanka

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLoading(false);
      },
      (err) => {
        setError("Unable to retrieve your location. Please enable location services.");
        setLoading(false);
        console.error(err);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  }, []);

  return (
    <div className="max-w-10x7 mx-auto px-8 py-1  rounded-xl shadow-md">
      <h2 className="text-3xl font-bold ">
        Cities Near me

      </h2>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-600"></div>
          <p className="text-gray-600 dark:text-gray-300 mt-4">Finding your location...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md text-center">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-green-600 font-medium hover:underline"
          >
            Try again
          </button>
        </div>
      ) : (
        <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={userLocation || defaultCenter}
            zoom={12}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false
            }}
          >
            {userLocation && (
              <Marker 
                position={userLocation}
                label="You"
                icon={{
                  url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                }}
              />
            )}
          </GoogleMap>
        </LoadScript>
      )}
    </div>
  );
};

export default CitiesNearMe;
