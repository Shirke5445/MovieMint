const { axiosInstance } = require(".");

// Register
export const Registeruser = async (payload) => {
  try {
    const response = await axiosInstance.post("/users/register", payload);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

// Login
export const Loginuser = async (payload) => {
  try {
    const response = await axiosInstance.post("/users/login", payload);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

// Get current user
export const GetCurrentUser = async () => {
  try {
    const response = await axiosInstance.get(
      "/users/get-current-user",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return error.response?.data || error;
  }
};
