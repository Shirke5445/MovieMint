import { message } from "antd";
import React, { useEffect, useState } from "react";
import { GetCurrentUser } from "../apicalls/users";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SetUser } from "../redux/usersSlice";
import { HideLoading, ShowLoading } from "../redux/loadersSlice";

function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.users);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const getCurrentUser = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetCurrentUser();
      console.log("GetCurrentUser response:", response);
      dispatch(HideLoading());

      if (response.success) {
        dispatch(SetUser(response.user));
      } else {
        throw new Error("Session expired");
      }
    } catch (error) {
      dispatch(HideLoading());
      dispatch(SetUser(null));
      localStorage.removeItem("token");
      message.error("Session expired");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getCurrentUser();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // ✅ VERY IMPORTANT
  if (loading) return null;

  // ✅ Redirect instead of blank screen
  if (!user) {
    return null;
  }

  return (
    <div className="layout p-1">
      <div className="header bg-primary flex justify-between p-2">
        <div>
          <h1 className="site-title-cinema" onClick={() => navigate("/")}>
            🎬Movie<span>Mint</span>
          </h1>
        </div>

        <div className="user-menu">
  <div
    className="user-info"
    onClick={() => {
      if (user.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/profile");
      }
    }}
  >
    <i className="ri-shield-user-line"></i>
    <span>{user.name}</span>
  </div>

  <div
    className="logout-btn"
    onClick={() => {
      localStorage.removeItem("token");
      navigate("/login");
    }}
  >
    <i className="ri-logout-box-r-line"></i>
  </div>
</div>

      </div>

      <div className="content mt-1 p-1">{children}</div>
    </div>
  );
}

export default ProtectedRoute;
