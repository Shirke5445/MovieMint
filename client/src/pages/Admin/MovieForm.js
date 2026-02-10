import React, { useEffect } from "react";
import {
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Space,
} from "antd";
import { useDispatch } from "react-redux";
import { ShowLoading, HideLoading } from "../../redux/loadersSlice";
import { AddMovie, UpdateMovie } from "../../apicalls/movies";
import { Button as AntButton } from "antd";
import moment from "moment";

function MovieForm({
  showMovieFormModal,
  setShowMovieFormModal,
  selectedMovie,
  setSelectedMovie,
  getData,
  formType,
}) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  // Prefill form in EDIT mode
  useEffect(() => {
    if (selectedMovie) {
      form.setFieldsValue({
        ...selectedMovie,
        releaseDate: selectedMovie.releaseDate
          ? moment(selectedMovie.releaseDate).format("YYYY-MM-DD")
          : null,
        durationHours: selectedMovie.duration?.hours,
        durationMinutes: selectedMovie.duration?.minutes,
      });
    } else {
      form.resetFields();
    }
  }, [selectedMovie, form]);

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());

      const payload = {
        ...values,
        duration: {
          hours: values.durationHours,
          minutes: values.durationMinutes,
        },
      };

      delete payload.durationHours;
      delete payload.durationMinutes;

      let response = null;

      if (formType === "add") {
        response = await AddMovie(payload);
      } else {
        response = await UpdateMovie({
          ...payload,
          movieId: selectedMovie._id,
        });
      }

      if (response.success) {
        message.success(response.message);
        getData();
        setShowMovieFormModal(false);
        setSelectedMovie(null);
      } else {
        message.error(response.message);
      }

      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
    
  };
  

  return (
    <Modal
      title={formType === "add" ? "ADD MOVIE" : "EDIT MOVIE"}
      open={showMovieFormModal}
      onCancel={() => {
        setShowMovieFormModal(false);
        setSelectedMovie(null);
      }}
      footer={null}
      width={800}
      className="movie-form-modal"
      centered
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item
              label="Movie Name"
              name="title"
              required
              className="movie-form-item"
            >
              <Input className="movie-input" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Movie Description"
              name="description"
              required
              className="movie-form-item"
            >
              <Input.TextArea rows={3} className="movie-input" />
            </Form.Item>
          </Col>

          {/* Duration */}
          <Col span={8}>
            <Form.Item label="Duration" className="movie-form-item">
              <Space.Compact style={{ width: "100%" }}>
                <Form.Item
                  name="durationHours"
                  noStyle
                  rules={[{ required: true, message: "Hours required" }]}
                >
                  <InputNumber
                    placeholder="Hours"
                    min={0}
                    className="movie-input"
                    style={{ width: "50%" }}
                  />
                </Form.Item>

                <Form.Item
                  name="durationMinutes"
                  noStyle
                  rules={[
                    { required: true, message: "Minutes required" },
                    {
                      validator: (_, value) =>
                        value >= 0 && value <= 59
                          ? Promise.resolve()
                          : Promise.reject(
                              new Error("Minutes must be between 0 and 59"),
                            ),
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="Minutes"
                    min={0}
                    max={59}
                    className="movie-input"
                    style={{ width: "50%" }}
                  />
                </Form.Item>
              </Space.Compact>
            </Form.Item>
          </Col>

          {/* Language */}
          <Col span={8}>
            <Form.Item
              label="Language"
              name="language"
              required
              className="movie-form-item"
            >
              <Select
                mode="multiple"
                placeholder="Select Language(s)"
                allowClear
                className="movie-input"
              >
                <Select.Option value="Marathi">Marathi</Select.Option>
                <Select.Option value="English">English</Select.Option>
                <Select.Option value="Hindi">Hindi</Select.Option>
                <Select.Option value="Kannada">Kannada</Select.Option>
                <Select.Option value="Tamil">Tamil</Select.Option>
                <Select.Option value="Malayalam">Malayalam</Select.Option>
                <Select.Option value="Gujrati">Gujrati</Select.Option>
                <Select.Option value="Telugu">Telugu</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          {/* Release Date */}
          <Col span={8}>
            <Form.Item
              label="Release Date"
              name="releaseDate"
              required
              className="movie-form-item"
            >
              <Input type="date" className="movie-input" />
            </Form.Item>
          </Col>

          {/* Genre */}
          <Col span={8}>
            <Form.Item
              label="Genre"
              name="genre"
              required
              className="movie-form-item"
            >
              <Select
                mode="multiple"
                placeholder="Select Genre"
                allowClear
                className="movie-input"
              >
                <Select.Option value="Action">Action</Select.Option>
                <Select.Option value="Comedy">Comedy</Select.Option>
                <Select.Option value="Drama">Drama</Select.Option>
                <Select.Option value="Adventure">Adventure</Select.Option>
                <Select.Option value="Fantasy">Fantasy</Select.Option>
                <Select.Option value="Sci-Fi">Sci-Fi</Select.Option>
                <Select.Option value="Romance">Romance</Select.Option>
                <Select.Option value="Psychological">
                  Psychological
                </Select.Option>
                <Select.Option value="Thriller">Thriller</Select.Option>
                <Select.Option value="Documentary">Documentary</Select.Option>
                <Select.Option value="Musical">Musical</Select.Option>
                <Select.Option value="Animation">Animation</Select.Option>
                <Select.Option value="Crime">Crime</Select.Option>
                <Select.Option value="Horror">Horror</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          {/* Poster */}
          <Col span={16}>
            <Form.Item
              label="Poster URL"
              name="poster"
              required
              className="movie-form-item"
            >
              <Input className="movie-input" />
            </Form.Item>
          </Col>
        </Row>

        {/* Actions */}
        <div className="movie-form-actions">
          <AntButton
            onClick={() => {
              setShowMovieFormModal(false);
              setSelectedMovie(null);
            }}
          >
            Cancel
          </AntButton>

          <AntButton type="primary" htmlType="submit">
            Save
          </AntButton>
        </div>
      </Form>
    </Modal>
  );
}

export default MovieForm;
