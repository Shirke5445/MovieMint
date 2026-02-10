import React from "react";
import PageTitle from "../../components/PageTitle";
import { Tabs } from "antd";
import MoviesList from "./MoviesList";
import TheatresList from "./TheatresList";

function Admin() {
  return (
    <div className="admin-page">
      {/* Page Header */}
      <div className="admin-header">
        <PageTitle title="Admin Panel" />
      </div>

      {/* Tabs Card */}
      <div className="admin-card">
        <Tabs
          defaultActiveKey="1"
          size="large"
          className="admin-tabs"
        >
          <Tabs.TabPane
            tab={<span className="tab-label">🎬 Movies</span>}
            key="1"
          >
            <MoviesList />
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={<span className="tab-label">🏢 Theatres</span>}
            key="2"
          >
            <TheatresList />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default Admin;
