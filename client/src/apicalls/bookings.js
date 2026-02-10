import { axiosInstance } from ".";

// make payment (Razorpay order)
export const MakePayment = async (amount) => {
  try {
    const response = await axiosInstance.post("/bookings/make-payment", {
      amount,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// book shows
export const BookShowTickets = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/bookings/book-show",
      payload
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// get bookings
export const GetBookingsOfUser = async () => {
  try {
    const response = await axiosInstance.get("/bookings/get-bookings");
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
