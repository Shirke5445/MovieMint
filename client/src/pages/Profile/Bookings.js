import React, { useEffect, useState } from "react";
import { Row, Col, message } from "antd";
import { useDispatch } from "react-redux";
import { ShowLoading, HideLoading } from "../../redux/loadersSlice";
import { GetBookingsOfUser } from "../../apicalls/bookings";
import moment from "moment";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const dispatch = useDispatch();

  const getBookings = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetBookingsOfUser();
      dispatch(HideLoading());

      if (response?.success && Array.isArray(response.data)) {
        const safeBookings = response.data.filter(
          (b) => b?.show?.movie && b?.show?.theatre && b?.seats?.length
        );
        setBookings(safeBookings);
      } else {
        setBookings([]);
        message.error(response?.message || "Failed to load bookings");
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
      setBookings([]);
    }
  };

  useEffect(() => {
    getBookings();
  }, []);

  if (!bookings.length) {
    return (
      <div className="bk-empty text-center mt-5">
        <h2>No bookings yet</h2>
        <p>Book your first movie and it will appear here 🎬</p>
      </div>
    );
  }

  return (
    <Row gutter={[20, 20]}>
      {bookings.map((booking, index) => (
        <Col span={12} key={index}>
          <div className="bk-card">
            {/* LEFT */}
            <div className="bk-info">
              <h1 className="bk-title">
                {booking.show.movie.title} (
                {Array.isArray(booking.show.movie.language)
                  ? booking.show.movie.language.join(", ")
                  : booking.show.movie.language}
                )
              </h1>

              <p className="bk-theatre">
                {booking.show.theatre.name},{" "}
                <span className="bk-address">{booking.show.theatre.address}</span>
              </p>

              {/* SIMPLE TEXT */}
              <div className="bk-datetime">
                <span>
                  {moment(booking.show.date).format("MMM Do YYYY")}
                </span>
                <span>
                  {moment(booking.show.time, "HH:mm").format("hh:mm A")}
                </span>
              </div>

              <p className="bk-seats">
                🎟 Seats: <strong>{booking.seats.join(", ")}</strong>
              </p>

              <p className="bk-amount">
                💰 Amount: ₹
                {booking.show.ticketPrice * booking.seats.length}
              </p>

              <p className="bk-id">Booking ID: {booking._id}</p>
            </div>

            {/* RIGHT */}
            <div className="bk-poster-wrap">
              <img
                src={booking.show.movie.poster}
                alt="poster"
                className="bk-poster"
              />
            </div>
          </div>
        </Col>
      ))}
    </Row>
  );
}

export default Bookings;
