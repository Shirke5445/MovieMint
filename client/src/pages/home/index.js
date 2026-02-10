import React, { useEffect } from "react";
import { Col, message, Row, Table } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { GetAllMovies } from "../../apicalls/movies";
import { useNavigate } from "react-router-dom";
import moment from "moment";

function Home() {
  const [searchText = "", setSearchText] = React.useState("");
  const [movies, setMovies] = React.useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetAllMovies();
      if (response.success) {
        setMovies(response.data);
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
  return (
    <div>
      <div className="search-container-full">
  <i className="ri-search-line search-icon-full"></i>
  <input
    type="text"
    className="search-input-full"
    placeholder="Search for movies"
    value={searchText}
    onChange={(e) => setSearchText(e.target.value)}
  />
</div>

   <Row gutter={[20]} className="mt-2">
  {movies
    .filter((movie) =>
      movie.title.toLowerCase().includes(searchText.toLowerCase())
    )
    .map((movie) => (
      <Col xs={12} sm={8} md={6} lg={4} key={movie._id}>
        {/* Movie Poster Card */}
        <div
          className="movie-card"
          onClick={() =>
            navigate(
              `/movie/${movie._id}?date=${moment().format("YYYY-MM-DD")}`
            )
          }
        >
          <img src={movie.poster} alt={movie.title} />
        </div>

        {/* Movie Title Below Poster */}
        <h1 className="movie-title-below">
          {movie.title}
        </h1>
      </Col>
    ))}
</Row>

    </div>
  );
}

export default Home;