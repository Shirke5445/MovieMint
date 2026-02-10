import { message } from "antd";
import moment from "moment";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { GetShowById } from "../../apicalls/theatres";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import Button from "../../components/Button";
import { BookShowTickets, MakePayment } from "../../apicalls/bookings";

// 🔹 Load Razorpay script
const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

function BookShow() {
  const { user } = useSelector((state) => state.users);
  const [show, setShow] = React.useState(null);
  const [selectedSeats, setSelectedSeats] = React.useState([]);
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🔹 Get show data
  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetShowById({
        showId: params.id,
      });
      if (response.success) {
        setShow(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  // 🔹 Seat layout
  const getSeats = () => {
    const columns = 12;
    const totalSeats = show.totalSeats;
    const rows = Math.ceil(totalSeats / columns);

    return (
      <div className="flex gap-1 flex-col p-2 card">
        {Array.from(Array(rows).keys()).map((row) => (
          <div key={row} className="flex gap-1 justify-center">
            {Array.from(Array(columns).keys()).map((column) => {
              const seatNumber = row * columns + column + 1;
              let seatClass = "seat";

              if (selectedSeats.includes(seatNumber)) {
                seatClass += " selected-seat";
              }

              if (show.bookedSeats.includes(seatNumber)) {
                seatClass += " booked-seat";
              }

              return (
                seatNumber <= totalSeats && (
                  <div
                    key={seatNumber}
                    className={seatClass}
                    onClick={() => {
                      if (show.bookedSeats.includes(seatNumber)) return;

                      if (selectedSeats.includes(seatNumber)) {
                        setSelectedSeats(
                          selectedSeats.filter((s) => s !== seatNumber)
                        );
                      } else {
                        setSelectedSeats([...selectedSeats, seatNumber]);
                      }
                    }}
                  >
                    <h1 className="text-sm">{seatNumber}</h1>
                  </div>
                )
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  // 🔹 Save booking
  const book = async (transactionId) => {
    try {
      dispatch(ShowLoading());
      const response = await BookShowTickets({
        show: params.id,
        seats: selectedSeats,
        transactionId,
        user: user._id,
      });

      if (response.success) {
        message.success(response.message);
        navigate("/profile");
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  // 🔹 Razorpay payment
  const makePayment = async () => {
    try {
      dispatch(ShowLoading());

      const loaded = await loadRazorpay();
      if (!loaded) {
        message.error("Razorpay SDK failed to load");
        dispatch(HideLoading());
        return;
      }

      const amount = selectedSeats.length * show.ticketPrice * 100;

      const orderResponse = await MakePayment(amount);
      if (!orderResponse.success) {
        message.error(orderResponse.message);
        dispatch(HideLoading());
        return;
      }

      const options = {
        key: "rzp_test_SCOVhJwQxL0XJd", // 🔑 Razorpay TEST KEY
        amount: orderResponse.data.amount,
        currency: "INR",
        name: "MovieMint",
        description: "Movie Ticket Booking",
        order_id: orderResponse.data.id,
        handler: function (response) {
          book(response.razorpay_payment_id);
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    show && (
      <div>
        {/* 🎬 Show Information */}
        <div className="flex justify-between card p-2 items-center">
          <div>
            <h1 className="text-sm">{show.theatre.name}</h1> 
            <h1 className="text-sm-add">{show.theatre.address}</h1>
          </div>

          <div>
            <h1 className="text-2xl uppercase">
              {show.movie.title}</h1> 
              <span className="text-sm"> ( 
              {Array.isArray(show.movie.language)
                ? show.movie.language.join(", ")
                : show.movie.language}
              )
              </span>
            
          </div>

          <div>
            <h1 className="text-sm">
              {moment(show.date).format("MMM Do YYYY")} -{" "}
              {moment(show.time, "HH:mm").format("hh:mm A")}
            </h1>
          </div>
        </div>

        {/* 🪑 Seats */}
        <div className="flex justify-center mt-2">{getSeats()}</div>

        {/* 💳 Payment */}
        {selectedSeats.length > 0 && (
          <div className="mt-2 flex justify-center gap-2 items-center flex-col">
            <div className="flex justify-center">
              <div className="flex uppercase card p-2 gap-3">
                <h1 className="text-sm">
                  <b>Selected Seats</b> : {selectedSeats.join(", ")}
                </h1>

                <h1 className="text-sm">
                  <b>Total Price</b> : ₹
                  {selectedSeats.length * show.ticketPrice}
                </h1>
              </div>
            </div>

            <Button title="Book Now" onClick={makePayment} />
          </div>
        )}
      </div>
    )
  );
}

export default BookShow;
