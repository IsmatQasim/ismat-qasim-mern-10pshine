import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import BentoBox from "../components/BentoBox";
import { Link } from "react-router-dom";
import BentoImage from "../assets/image.png";
import {
  StickyNote,
  Plus,
  Heart,
  CalendarDays,
  FilePen,
  FileText,
  User2,
} from "lucide-react";

const Dashboard = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = currentDate.toLocaleTimeString();

  return (
    <Layout>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: "10px",
          maxWidth: "1400px",
          margin: "0px 0px 0px 100px",
        }}
      >
        <Link to="/notes/all" style={{ textDecoration: "none" }}>
          <BentoBox
            icon={<StickyNote size={24} />}
            title="All Notes"
            paragraph="Explore and manage all your saved notes in one place. Keep track of everything!"
            width="480px"
            backgroundColor="#5393df"
            color="#000"
          />
        </Link>

        <Link to="/editor" style={{ textDecoration: "none" }}>
          <BentoBox
            icon={<Plus size={24} />}
            title="Create Note"
            paragraph="Start writing a brand new note anytime, capture your thoughts, or ideas!"
            width="490px"
            margin="0px  0px 0px 22px"
            backgroundColor="#d8a2f9"
            color="#000"
          />
        </Link>
        <Link to="/profile" style={{ textDecoration: "none" }}>
          <BentoBox
            icon={<User2 size={24} />}
            title="Profile"
            paragraph="View your profile, and log out securely!"
            width="300px"
            margin="0px 0px 0px 60px"
            backgroundColor="#baccb2"
            color="#000"
          />
        </Link>

        <Link to="/notes/today" style={{ textDecoration: "none" }}>
          <BentoBox
            icon={<CalendarDays size={24} />}
            title="Today's Notes"
            paragraph="Check out the notes you’ve planned or written specifically for today."
            width="400px"
            backgroundColor="#ddc939"
            color="#000"
          />
        </Link>

        <Link to="/notes/favourite" style={{ textDecoration: "none" }}>
          <BentoBox
            icon={<Heart size={24} />}
            title="Favourite Notes"
            paragraph="View your favorite notes. Keep the notes you love just one click away for quick access."
            width="570px"
            margin="0px 0px 0px -55px"
            backgroundColor="#de6894"
            color="#000"
          />
        </Link>

        <div
          style={{
            width: "300px",
            height: "450px",
            margin: "0px 0px 0px 60px",
            borderRadius: "10px",
            overflow: "hidden",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
          }}
        >
          <img
            src={BentoImage}
            alt="Note illustration"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        <div
          style={{
            width: "470px",
            height: "220px",
            background: "#F2D2BD",
            borderRadius: "10px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            margin: "-230px 0px 0px 2px",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
            color: "#333",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "35px", marginBottom: "10px" }}>
            📅 {formattedDate}
          </div>
          <div style={{ fontSize: "35px", color: "#5f27cd" }}>
            🕒 {formattedTime}
          </div>
        </div>
        <Link to="/notes/drafts" style={{ textDecoration: "none" }}>
          <BentoBox
            icon={<FilePen size={24} />}
            title="Drafts"
            paragraph="Find all your saved drafts. Return to your unfinished notes anytime to complete."
            width="500px"
            margin="-230px 0px 0px 14px"
            backgroundColor="#cc6bbc"
            color="#000"
          />
        </Link>
      </div>
    </Layout>
  );
};

export default Dashboard;
