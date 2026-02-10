import { Form, Modal, message, Row, Col } from "antd";
import React from "react";
import { AddTheatre, UpdateTheatre } from "../../apicalls/theatres";
import Button from "../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";

function TheatreForm({
  showTheatreFormModal,
  setShowTheatreFormModal,
  formType,
  setFormType,
  selectedTheatre,
  setSelectedTheatre,
  getData,
}) {
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    values.owner = user._id;
    try {
      dispatch(ShowLoading());
      let response = null;

      if (formType === "add") {
        response = await AddTheatre(values);
      } else {
        values.theatreId = selectedTheatre._id;
        response = await UpdateTheatre(values);
      }

      if (response.success) {
        message.success(response.message);
        setShowTheatreFormModal(false);
        setSelectedTheatre(null);
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

  return (
    <Modal
      title={
        <h2 className="theatre-form-title">
          {formType === "add" ? "🏢 Add Theatre" : "✏️ Edit Theatre"}
        </h2>
      }
      open={showTheatreFormModal}
      onCancel={() => {
        setShowTheatreFormModal(false);
        setSelectedTheatre(null);
      }}
      footer={null}
      width={700}
      centered
    >
      <Form
        layout="vertical"
        onFinish={onFinish}
        initialValues={selectedTheatre}
        className="theatre-form"
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item
              label="Theatre Name"
              name="name"
              rules={[
                { required: true, message: "Please input theatre name!" },
              ]}
            >
              <input className="theatre-input" placeholder="eg. PVR Cinemas" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please input theatre email!" },
              ]}
            >
              <input
                className="theatre-input"
                placeholder="eg. theatre@email.com"
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Phone Number"
              name="phone"
              rules={[
                {
                  required: true,
                  message: "Please input theatre phone number!",
                },
              ]}
            >
              <input
                className="theatre-input"
                placeholder="Enter Mobile Number"
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Address"
              name="address"
              rules={[
                {
                  required: true,
                  message: "Please input theatre address!",
                },
              ]}
            >
              <textarea
                rows={3}
                className="theatre-textarea"
                placeholder="Full theatre address"
              />
            </Form.Item>
          </Col>
        </Row>

        <div className="theatre-form-actions">
          <Button
            title="Cancel"
            variant="outlined"
            htmlType="button"
            onClick={() => {
              setShowTheatreFormModal(false);
              setSelectedTheatre(null);
            }}
          />
          <Button title="Save Theatre" htmlType="submit" />
        </div>
      </Form>
    </Modal>
  );
}

export default TheatreForm;
