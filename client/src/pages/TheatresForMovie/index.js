import React, { useEffect } from "react";
import { message } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { GetMovieById } from "../../apicalls/movies";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { GetAllTheatresByMovie } from "../../apicalls/theatres";

function TheatresForMovie() {
  const tempDate = new URLSearchParams(window.location.search).get("date");
  const [date, setDate] = React.useState(
    tempDate || moment().format("YYYY-MM-DD"),
  );

  const [movie, setMovie] = React.useState(null);
  const [theatres, setTheatres] = React.useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetMovieById(params.id);
      if (response.success) {
        setMovie(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const getTheatres = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetAllTheatresByMovie({
        date,
        movie: params.id,
      });
      if (response.success) {
        setTheatres(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getTheatres();
  }, [date]);

  if (!movie) return null;

  return (
    <div>
      {/* 🎬 Movie Header */}
      <div className="movie-header">
        <div className="movie-info">
          <h1 className="text-2xl uppercase">
            {movie.title} ({movie.language?.join(", ")})
          </h1>

          <h1 className="text-md">
            Duration :{" "}
            {movie.duration
              ? `${movie.duration.hours} hr ${movie.duration.minutes} min`
              : "-"}
          </h1>

          <h1 className="text-md">
            Release Date : {moment(movie.releaseDate).format("MMM Do YYYY")}
          </h1>

          <h1 className="text-md">
            Genre :{" "}
            {Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre}
          </h1>

          <p className="text-sm mt-2 leading-relaxed max-w-3xl">
            {movie.description || "No description available"}
          </p>
        </div>

        {/* 📅 Date Picker */}
        <div className="date-picker">
          <h1>Select Date</h1>
          <input
            type="date"
            min={moment().format("YYYY-MM-DD")}
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              navigate(`/movie/${params.id}?date=${e.target.value}`);
            }}
          />
        </div>
      </div>

      <hr />

      {/* 🏛️ Theatres */}
      <div className="mt-2">
        <h1 className="text-xl uppercase theatres-title">Theatres</h1>
      </div>

      <div className="mt-1 flex flex-col gap-2">
        {theatres.map((theatre) => (
          <div className="theatre-card" key={theatre._id}>
            <h1 className="text-md uppercase">{theatre.name}</h1>
            <h1 className="text-sm">Address : {theatre.address}</h1>

            <div className="divider"></div>

            {/* ⏰ Show Timings */}
            <div className="flex gap-2 flex-wrap">
              {theatre.shows
                .sort(
                  (a, b) => moment(a.time, "HH:mm") - moment(b.time, "HH:mm"),
                )
                .map((show) => (
                  <div
                    key={show._id}
                    className="show-time cursor-pointer"
                    onClick={() => {
                      navigate(`/book-show/${show._id}`);
                    }}
                  >
                    {moment(show.time, "HH:mm").format("hh:mm A")}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TheatresForMovie;
