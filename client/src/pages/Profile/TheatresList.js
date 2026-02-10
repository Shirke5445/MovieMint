import React, { useEffect, useState } from "react";
import Button from "../../components/Button";
import TheatreForm from "./TheatreForm";
import {
  DeleteTheatre,
  GetAllTheatresByOwner,
} from "../../apicalls/theatres";
import { useDispatch, useSelector } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { message, Table, Tag } from "antd";
import Shows from "./Shows";

function TheatresList() {
  const { user } = useSelector((state) => state.users);

  const [showTheatreFormModal, setShowTheatreFormModal] = useState(false);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [formType, setFormType] = useState("add");
  const [theatres, setTheatres] = useState([]);
  const [openShowsModal, setOpenShowsModal] = useState(false);

  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetAllTheatresByOwner({ owner: user._id });
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

  const handleDelete = async (id) => {
    try {
      dispatch(ShowLoading());
      const response = await DeleteTheatre({ theatreId: id });
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
      title: "Theatre",
      dataIndex: "name",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Address",
      dataIndex: "address",
      ellipsis: true,
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (isActive) =>
        isActive ? (
          <Tag color="green">Approved</Tag>
        ) : (
          <Tag color="orange">Pending</Tag>
        ),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <div className="theatre-actions">
          <i
            className="ri-pencil-line edit-icon"
            title="Edit"
            onClick={() => {
              setFormType("edit");
              setSelectedTheatre(record);
              setShowTheatreFormModal(true);
            }}
          />
          <i
            className="ri-delete-bin-line delete-icon"
            title="Delete"
            onClick={() => handleDelete(record._id)}
          />

          {record.isActive && (
            <span
              className="shows-link"
              onClick={() => {
                setSelectedTheatre(record);
                setOpenShowsModal(true);
              }}
            >
              Shows
            </span>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="theatres-wrapper">
      <div className="theatres-header">
        <h2 className="section-title">🎭 My Theatres</h2>
        <Button
          title="Add Theatre"
          variant="outlined"
          onClick={() => {
            setFormType("add");
            setShowTheatreFormModal(true);
          }}
        />
      </div>

      <div className="theatres-card">
        <Table
          columns={columns}
          dataSource={theatres}
          rowKey="_id"
          pagination={{ pageSize: 6 }}
        />
      </div>

      {showTheatreFormModal && (
        <TheatreForm
          showTheatreFormModal={showTheatreFormModal}
          setShowTheatreFormModal={setShowTheatreFormModal}
          formType={formType}
          setFormType={setFormType}
          selectedTheatre={selectedTheatre}
          setSelectedTheatre={setSelectedTheatre}
          getData={getData}
        />
      )}

      {openShowsModal && (
        <Shows
          openShowsModal={openShowsModal}
          setOpenShowsModal={setOpenShowsModal}
          theatre={selectedTheatre}
        />
      )}
    </div>
  );
}

export default TheatresList;
