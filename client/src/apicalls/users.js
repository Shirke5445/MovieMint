import { axiosInstance } from "./index";

// Register User
export const Registeruser = async (payload) => {
  try {
    console.log("Register API call:", payload);
    const response = await axiosInstance.post("/users/register", payload);
    console.log("Register response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Register error:", error.response?.data || error.message);
    return error.response?.data || { 
      success: false, 
      message: "Network error. Please try again." 
    };
  }
};

// Login User
export const Loginuser = async (payload) => {
  try {
    console.log("Login API call:", payload);
    const response = await axiosInstance.post("/users/login", payload);
    console.log("Login response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Login error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return error.response?.data || { 
      success: false, 
      message: "Network error. Please try again." 
    };
  }
};

// Get Current User
export const GetCurrentUser = async () => {
  try {
    console.log("GetCurrentUser API call");
    const response = await axiosInstance.get("/users/get-current-user");
    console.log("GetCurrentUser response:", response.data);
    return response.data;
  } catch (error) {
    console.error("GetCurrentUser error:", error.response?.data || error.message);
    return error.response?.data || { 
      success: false, 
      message: "Failed to get user data" 
    };
  }
};