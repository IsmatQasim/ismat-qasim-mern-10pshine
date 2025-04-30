import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import profileImage from "../assets/profilee.png";
import { BASE_URL } from "../constants/constant.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/");
          return;
        }

        const res = await axios.get(`${BASE_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile(res.data);
      } catch (error) {
        console.error(error);
        navigate("/");
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("New and confirm passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${BASE_URL}/api/auth/change-password`,
        {
          currentPassword,
          newPassword,
          confirmPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(res.data.message);
      setShowModal(false);

      toast.success("Password changed successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error changing password");

      toast.error("Error changing password!");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setMessage("");
  };

  return (
    <div
      style={{
        backgroundColor: "#121212",
        color: "#f5f5f5",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: "20px",
      }}
    >
      <h1
        style={{
          color: "white",
          marginBottom: "20px",
          textAlign: "center",
          fontSize: "48px",
        }}
      >
        User Profile
      </h1>

      {profile ? (
        <div
          style={{
            backgroundColor: "#1f1f1f",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0,0,0,0.5)",
            textAlign: "center",
            minWidth: "500px",
            paddingTop: "30px",
            height: "560px",
          }}
        >
          <img
            src={profileImage}
            alt="Profile"
            style={{
              borderRadius: "50%",
              width: "250px",
              height: "250px",
              marginBottom: "10px",
            }}
          />

          <p style={{ fontSize: "25px" }}>
            <strong>Name:</strong> {profile.name}
          </p>
          <p style={{ fontSize: "25px" }}>
            <strong>Email:</strong> {profile.email}
          </p>

          <button
            onClick={handleLogout}
            style={{
              marginTop: "20px",
              padding: "15px 30px",
              border: "none",
              borderRadius: "5px",
              backgroundColor: "#F9629F",
              color: "black",
              cursor: "pointer",
              fontSize: "20px",
            }}
          >
            Logout
          </button>
          <br />
          <button
            onClick={() => setShowModal(true)}
            style={{
              marginTop: "20px",
              padding: "15px 30px",
              border: "none",
              borderRadius: "5px",
              backgroundColor: "#FFFFFF",
              color: "#121212",
              cursor: "pointer",
              fontSize: "20px",
            }}
          >
            Change Password
          </button>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "10px",
              width: "400px",
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <h2 style={{ color: "#121212", textAlign: "center" }}>
              Change Password
            </h2>

            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              style={{ padding: "10px" }}
            />

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ padding: "10px" }}
            />

            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ padding: "10px" }}
            />

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                onClick={closeModal}
                style={{
                  padding: "10px",
                  backgroundColor: "#ccc",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                style={{
                  padding: "10px",
                  backgroundColor: "#F9629F",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  color: "#fff",
                }}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>

            {message && (
              <p style={{ color: "red", textAlign: "center" }}>{message}</p>
            )}
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Profile;
