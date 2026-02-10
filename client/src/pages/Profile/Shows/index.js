import { Col, Form, Modal, Row, Select, Table, message } from "antd";
import React, { useEffect } from "react";
import Button from "../../../components/Button";
import { GetAllMovies } from "../../../apicalls/movies";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loadersSlice";
import {
  AddShow,
  DeleteShow,
  GetAllShowsByTheatre,
} from "../../../apicalls/theatres";
import moment from "moment";

function Shows({ openShowsModal, setOpenShowsModal, theatre }) {
  const [view, setView] = React.useState("table");
  const [shows, setShows] = React.useState([]);
  const [movies, setMovies] = React.useState([]);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(ShowLoading());

      const moviesResponse = await GetAllMovies();
      if (moviesResponse.success) {
        setMovies(moviesResponse.data);
      }

      const showsResponse = await GetAllShowsByTheatre({
        theatreId: theatre._id,
      });
      if (showsResponse.success) {
        setShows(showsResponse.data);
      }

      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const handleAddShow = async (values) => {
  try {
    dispatch(ShowLoading());

    const payload = {
      ...values,
      name: `${values.showType} - ${values.time}`, 
      theatre: theatre._id,
    };

    const response = await AddShow(payload);

    if (response.success) {
      message.success(response.message);
      getData();
      setView("table");
    } else {
      message.error(response.message);
    }

    dispatch(HideLoading());
  } catch (error) {
    message.error(error.message);
    dispatch(HideLoading());
  }
};


  const handleDelete = async (id) => {
    try {
      dispatch(ShowLoading());
      const response = await DeleteShow({ showId: id });
      if (response.success) {
        message.success(response.message);
        getData();
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const columns = [
    { title: "Show", dataIndex: "name" },
    {
      title: "Date",
      dataIndex: "date",
      render: (d) => moment(d).format("MMM Do YYYY"),
    },
    { title: "Time", dataIndex: "time" },
    {
      title: "Movie",
      dataIndex: "movie",
      render: (m) => m?.title,
    },
    { title: "Price", dataIndex: "ticketPrice" },
    { title: "Seats", dataIndex: "totalSeats" },
    {
      title: "Available",
      render: (_, r) => r.totalSeats - r.bookedSeats.length,
    },
    {
      title: "Action",
      render: (_, r) =>
        r.bookedSeats.length === 0 && (
          <i
            className="ri-delete-bin-line show-delete"
            onClick={() => handleDelete(r._id)}
          />
        ),
    },
  ];

  useEffect(() => {
    if (theatre?._id) getData();
  }, [theatre]);

  return (
    <Modal
      open={openShowsModal}
      onCancel={() => setOpenShowsModal(false)}
      footer={null}
      width={1200}
      className="shows-modal"
    >
      <div className="shows-header">
        <h1>🎭 {theatre?.name}</h1>

        {view === "table" && (
          <Button
            variant="outlined"
            title="+ Add Show"
            onClick={() => setView("form")}
          />
        )}
      </div>

      {view === "table" && (
        <Table
          columns={columns}
          dataSource={shows}
          rowKey="_id"
          className="shows-table"
        />
      )}

      {view === "form" && (
        <div className="shows-form-card">
          <h2>Add New Show</h2>

          <Form layout="vertical" onFinish={handleAddShow}>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Form.Item
                  label="Show Type"
                  name="showType"
                  rules={[
                    { required: true, message: "Please select show type!" },
                  ]}
                >
                  <select>
                    <option value="">Select Show Type</option>
                    <option value="Morning Show">Morning Show</option>
                    <option value="Afternoon Show">Afternoon Show</option>
                    <option value="Evening Show">Evening Show</option>
                    <option value="Night Show">Night Show</option>
                  </select>
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  label="Date"
                  name="date"
                  rules={[{ required: true, message: "Select date" }]}
                >
                  <input type="date" />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  label="Time"
                  name="time"
                  rules={[{ required: true, message: "Select time" }]}
                >
                  <input type="time" />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  label="Movie"
                  name="movie"
                  rules={[{ required: true, message: "Select movie" }]}
                >
                  <select>
                    <option value="">Select Movie</option>
                    {movies.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.title}
                      </option>
                    ))}
                  </select>
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  label="Ticket Price"
                  name="ticketPrice"
                  rules={[{ required: true, message: "Enter price" }]}
                >
                  <input type="number" />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  label="Total Seats"
                  name="totalSeats"
                  rules={[{ required: true, message: "Enter seats" }]}
                >
                  <input type="number" />
                </Form.Item>
              </Col>
            </Row>

            <div className="shows-actions">
              <Button
                variant="outlined"
                title="Cancel"
                onClick={() => setView("table")}
              />
              <Button title="Save Show" htmlType="submit" />
            </div>
          </Form>
        </div>
      )}
    </Modal>
  );
}

export default Shows;
