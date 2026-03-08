import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api"; // Backend base URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication Service
export const authService = {
  login: async (credentials) => {
    const response = await api.post("/drivers/login", credentials);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post("/drivers/register", userData);
    return response.data;
  },
  getLoggedUser: async () => {
    try {
      const response = await api.get("/drivers/me"); // Replace "/drivers/me" with the actual endpoint if different
      return response.data;
    } catch (error) {
      console.error("Error fetching logged user:", error.response || error.message);
      throw new Error("Failed to fetch logged user. Please check the API endpoint.");
    }
  },
};

// Delivery Service
export const deliveryService = {
  createDelivery: async (deliveryData) => {
    const response = await api.post("/deliveries", deliveryData);
    return response.data;
  },
  assignDriver: async (deliveryId, driverData) => {
    const response = await api.put("/deliveries/assign", {
      deliveryId,
      ...driverData,
    });
    return response.data;
  },
  markAsDelivered: async (deliveryId) => {
    const response = await api.put("/deliveries/deliver", { deliveryId });
    return response.data;
  },
  updateDeliveryStatus: async (deliveryId, status) => {
    const response = await api.put("/deliveries/status", { deliveryId, status });
    return response.data;
  },
  getAllDeliveries: async () => {
    const response = await api.get("/deliveries");
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