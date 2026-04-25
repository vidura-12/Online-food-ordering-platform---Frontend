import axios from "axios";

// Constants
const GATEWAY_URL = "https://deliveroo-api-gateway.onrender.com";
const API_BASE_URL = `${GATEWAY_URL}/gateway`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // Ensure there are no spaces or extra characters
      config.headers.Authorization = `Bearer ${token.trim()}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Global Errors (Like 401/403)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn("Authentication error. Clearing token...");
      // localStorage.removeItem("token"); // Uncomment to auto-logout on auth failure
    }
    return Promise.reject(error);
  }
);

/**
 * Authentication & Driver Identity Service
 * Merged authService and driverService for consistency
 */
export const authService = {
  login: async (credentials) => {
    const response = await api.post("/drivers/login", credentials);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      // If your backend returns driver info, store ID too
      if (response.data.driverId) {
        localStorage.setItem("driverId", response.data.driverId);
      }
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post("/drivers/register", userData);
    return response.data;
  },

  getLoggedUser: async () => {
    // Note: Ensure your Ocelot has a route for /gateway/drivers/me
    const response = await api.get("/drivers/me");
    return response.data;
  },

  getDriverLocation: async (driverId) => {
    const response = await api.get(`/drivers/location/${driverId}`);
    return response.data;
  }
};

/**
 * Delivery Management Service
 */
export const deliveryService = {
  // Get all available deliveries
  getAllDeliveries: async () => {
    const response = await api.get("/deliveries");
    return response.data;
  },

  // Get deliveries assigned to a specific driver
  getDeliveriesByDriver: async (driverId) => {
    const response = await api.get(`/deliveries/driver/${driverId}`);
    return response.data;
  },

  createDelivery: async (deliveryData) => {
    const response = await api.post("/deliveries", deliveryData);
    return response.data;
  },

  assignDriver: async (deliveryId, driverId) => {
    // Fixed: Standardizing payload to match common PUT patterns
    const response = await api.put("/deliveries/assign", {
      deliveryId,
      driverId,
    });
    return response.data;
  },

  updateDeliveryStatus: async (deliveryId, status) => {
    // Matches your Ocelot PUT /gateway/deliveries/status route
    const response = await api.put("/deliveries/status", { 
      deliveryId, 
      status 
    });
    return response.data;
  },

  trackDelivery: async (deliveryId) => {
    const response = await api.get(`/deliveries/track/${deliveryId}`);
    return response.data;
  },
};

// Driver Service
export const driverService = {
  registerDriver: async (driverData) => {
    const response = await api.post("/drivers/register", driverData);
    return response.data;
  },
  loginDriver: async (credentials) => {
    const response = await api.post("/drivers/login", credentials);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  },
  getDriverLocation: async (driverId) => {
    const response = await api.get(`/drivers/location/${driverId}`);
    return response.data;
  },
};