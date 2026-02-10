import React, { useEffect } from "react";
import Button from "../../components/Button";
import MovieForm from "./MovieForm";
import moment from "moment";
import { message, Table } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { DeleteMovie, GetAllMovies } from "../../apicalls/movies";

function MoviesList() {
  const [movies, setMovies] = React.useState([]);
  const [showMovieFormModal, setShowMovieFormModal] = React.useState(false);
  const [selectedMovie, setSelectedMovie] = React.useState(null);
  const [formType, setFormType] = React.useState("add");
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

  const handleDelete = async (movieId) => {
    try {
      dispatch(ShowLoading());
      const response = await DeleteMovie({ movieId });
      if (response.success) {
        message.success(response.message);
        getData();
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "Poster",
      dataIndex: "poster",
      align: "center",
      render: (_, record) => (
        <img
          src={record.poster}
          alt="poster"
          className="movie-poster"
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "title",
      align: "center",
    },
    {
      title: "Description",
      dataIndex: "description",
      align: "center",
      ellipsis: true,
    },
    {
      title: "Duration",
      align: "center",
      render: (_, record) =>
        `${record.duration?.hours || 0} hr ${record.duration?.minutes || 0} min`,
    },
    {
      title: "Genre",
      dataIndex: "genre",
      align: "center",
      render: (genre) => genre.join(", "),
    },
    {
      title: "Language",
      dataIndex: "language",
      align: "center",
      render: (languages) => languages.join(", "),
    },
    {
      title: "Release Date",
      dataIndex: "releaseDate",
      align: "center",
      render: (date) => moment(date).format("DD-MM-YYYY"),
    },
    {
      title: "Action",
      align: "center",
      render: (_, record) => (
        <div className="movie-action-icons">
          <i
            className="ri-pencil-line edit-icon"
            onClick={() => {
              setSelectedMovie(record);
              setFormType("edit");
              setShowMovieFormModal(true);
            }}
          />
          <i
            className="ri-delete-bin-line delete-icon"
            onClick={() => handleDelete(record._id)}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="movies-list-wrapper">
      <div className="movies-list-header">
        <Button
          title="Add Movie"
          variant="outlined"
          onClick={() => {
            setFormType("add");
            setShowMovieFormModal(true);
          }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={movies}
        rowKey="_id"
        className="movies-table"
        pagination={{ pageSize: 6 }}
      />

      {showMovieFormModal && (
        <MovieForm
          showMovieFormModal={showMovieFormModal}
          setShowMovieFormModal={setShowMovieFormModal}
          selectedMovie={selectedMovie}
          setSelectedMovie={setSelectedMovie}
          formType={formType}
          getData={getData}
        />
      )}
    </div>
  );
}

export default MoviesList;
