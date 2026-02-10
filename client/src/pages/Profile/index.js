import React from "react";
import { Tabs } from "antd";
import PageTitle from "../../components/PageTitle";
import TheatresList from "./TheatresList";
import Bookings from "./Bookings";

function Profile() {
  return (
    <div className="profile-page">
      <PageTitle title="My Profile" />

      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="🎟️ Bookings" key="1">
          <Bookings />
        </Tabs.TabPane>

        <Tabs.TabPane tab="🏢 My Theatres" key="2">
          <TheatresList />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

export default Profile;
