import React, { useEffect, useState } from "react";
import { GetAllTheatres, UpdateTheatre } from "../../apicalls/theatres";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { message, Table } from "antd";

function AdminTheatresList() {
  const [theatres, setTheatres] = useState([]);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetAllTheatres();
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

  const handleStatusChange = async (theatre) => {
    try {
      dispatch(ShowLoading());
      const response = await UpdateTheatre({
        theatreId: theatre._id,
        ...theatre,
        isActive: !theatre.isActive,
      });
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
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Address",
      dataIndex: "address",
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
      title: "Owner",
      dataIndex: "owner",
      render: (_, record) => record.owner?.name || "N/A",
    },
    {
  title: "Status",
  dataIndex: "isActive",
  render: (isActive) => (
    <span
      className={
        isActive
          ? "admin-status-approved"
          : "admin-status-pending"
      }
    >
      {isActive ? "Approved" : "Pending / Blocked"}
    </span>
  ),
},
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <div className="admin-theatre-actions">
          {record.isActive ? (
            <span
              className="admin-action-block"
              onClick={() => handleStatusChange(record)}
            >
              Block
            </span>
          ) : (
            <span
              className="admin-action-approve"
              onClick={() => handleStatusChange(record)}
            >
              Approve
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
    <div className="admin-theatres-card">
      <Table
        columns={columns}
        dataSource={theatres}
        rowKey="_id"
        className="admin-theatres-table"
        pagination={{ pageSize: 6 }}
      />
    </div>
  );
}

export default AdminTheatresList;
