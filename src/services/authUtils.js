// services/authUtils.js
import { jwtDecode } from "jwt-decode";

export const getLoggedInUser = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return {
      email: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
      role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
    };
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};
