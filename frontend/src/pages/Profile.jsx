import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import profileImage from "../assets/profilee.png";
import { BASE_URL } from "../constants/constant.js";

const Profile = () => {
  const [profile, setProfile] = useState(null);
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
            height: "500px",
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
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default Profile;
