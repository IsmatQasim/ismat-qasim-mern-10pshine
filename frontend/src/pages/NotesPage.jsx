import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Heart,
  Heart as HeartFilled,
  Edit,
  Trash,
  Eye,
  SquarePlus,
  Home,
} from "lucide-react";
import truncate from "html-truncate";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { BASE_URL } from "../constants/constant.js";


const generateRandomLightColor = () => {
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 15) + 55;
  const lightness = Math.floor(Math.random() * 10) + 85;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};
const NotesPage = () => {
  const { type } = useParams();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [colorMap, setColorMap] = useState({});
  const [viewNote, setViewNote] = useState(null);
  const [popupColor, setPopupColor] = useState(""); 

  const titleMap = {
    all: "All Notes",
    favourite: "Favourite Notes",
    today: "Today's Notes",
    drafts: "Drafts",
  };
  const navigate = useNavigate();
  const currentTitle = titleMap[type] || "Notes";

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/notes/getNotes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        let filteredNotes = response.data;
        if (type === "favourite") {
          filteredNotes = response.data.filter((note) => note.favorite);
        } else if (type === "drafts") {
          filteredNotes = response.data.filter(
            (note) => note.status === "draft"
          );
        } else if (type === "today") {
          const today = new Date().toISOString().slice(0, 10);
          filteredNotes = response.data.filter(
            (note) => note.createdAt?.slice(0, 10) === today
          );
        } else {
          filteredNotes = response.data.filter(
            (note) => note.status !== "draft"
          );
        }

        setNotes(filteredNotes);
      } catch (err) {
        console.error("Error fetching notes:", err);
        setError("Failed to fetch notes. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [type]);

  useEffect(() => {
    const colors = {};
    notes.forEach((note) => {
      if (note._id) {
        colors[note._id] = generateRandomLightColor();
      }
    });
    setColorMap(colors);
  }, [notes]);

  const handleToggleFavourite = async (note) => {
    const newFavoriteStatus = note.favorite ? false : true;
    const token = localStorage.getItem("token");

    try {
    
      await axios.patch(
        `${BASE_URL}/api/notes/favorite/${note._id}`,
        { favorite: newFavoriteStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      toast.info(
        `Note marked as ${newFavoriteStatus ? "favourite" : "unfavourite"}`
      );

    
      setNotes((prevNotes) => {
       
        const updatedNotes = prevNotes.map((n) =>
          n._id === note._id ? { ...n, favorite: newFavoriteStatus } : n
        );

     
        if (!newFavoriteStatus && type === "favourite") {
          return updatedNotes.filter((n) => n._id !== note._id);
        }

        return updatedNotes;
      });
    } catch (err) {
      toast.error("Failed to update status!", err);
    }
  };

  const handleEditNote = (note) => {
    const { _id, title, content } = note;
    navigate("/editor", { state: { note: { _id, title, content } } });
  };

  const handleDeleteNote = (noteId) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      const token = localStorage.getItem("token");
      axios
        .delete(`${BASE_URL}/api/notes/delete/${noteId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          toast.success("Note deleted successfully!");
          setNotes((prev) => prev.filter((note) => note._id !== noteId));
        })
        .catch(() => toast.error("Failed to delete note."));
    }
  };

  if (loading) return <p style={{ color: "white" }}>Loading notes...</p>;
  if (error)
    return (
      <p className="error-message" style={{ color: "red" }}>
        {error}
      </p>
    );

  return (
    <>
      <div
        className="notes-container"
        style={{
          position: "relative",
          padding: "20px",
          backgroundColor: "#040404",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: "130px",
            display: "flex",
            gap: "20px",
            cursor: "pointer",
          }}
        >
          <div title="Create Notes">
            <SquarePlus
              size={45}
              color="white"
              onClick={() => navigate("/editor")}
            />
          </div>
          <div title="Go to Dashboard">
            <Home
              size={45}
              color="white"
              onClick={() => navigate("/dashboard")}
            />
          </div>
        </div>

        <h1 className="notes-heading" style={{ color: "white" }}>
          {currentTitle}
        </h1>

        {notes.length > 0 ? (
          <div
            className="notes-grid"
            style={{
              display: "flex",
              gap: "20px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {notes.map((note) => (
              <div
                key={note._id}
                className="note-box"
                style={{
                  backgroundColor: colorMap[note._id],
                  padding: "20px",
                  borderRadius: "10px",
                  minHeight: "250px",
                  width: "300px",
                  position: "relative",
                  color: "black",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                }}
              >
                <h3>{note.title}</h3>
                <p
                  dangerouslySetInnerHTML={{
                    __html: truncate(note.content, 100),
                  }}
                ></p>
                <div
                  className="note-icons"
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    display: "flex",
                    gap: "10px",
                  }}
                >
                  <Eye
                    size={24}
                    color="black"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setViewNote(note);
                      setPopupColor(colorMap[note._id]); 
                    }}
                  />
                  {note.favorite ? (
                    <HeartFilled
                      size={24}
                      color="black"
                      fill="black"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleToggleFavourite(note)}
                    />
                  ) : (
                    <Heart
                      size={24}
                      color="black"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleToggleFavourite(note)}
                    />
                  )}
                  <Edit
                    size={24}
                    color="black"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleEditNote(note)}
                  />
                  <Trash
                    size={24}
                    color="red"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDeleteNote(note._id)}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "white" }}>
            No {currentTitle.toLowerCase()} available!
          </p>
        )}
      </div>

      {/* Modal Popup */}
      {viewNote && (
        <div
          className="popup-modal"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            width: "100vw",
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
          onClick={() => setViewNote(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: popupColor,
              padding: "30px",
              borderRadius: "10px",
              maxWidth: "500px",
              width: "90%",
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            }}
          >
            <h2 style={{ textAlign: "center" }}>{viewNote.title}</h2>
            <p
              style={{ marginTop: "15px" }}
              dangerouslySetInnerHTML={{ __html: viewNote.content }}
            />
            <button
              style={{
                marginTop: "20px",
                marginLeft: "40%",
                padding: "10px 20px",
                borderRadius: "5px",
                backgroundColor: "#333",
                color: "white",
                cursor: "pointer",
              }}
              onClick={() => setViewNote(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <ToastContainer />
    </>
  );
};
export default NotesPage;
