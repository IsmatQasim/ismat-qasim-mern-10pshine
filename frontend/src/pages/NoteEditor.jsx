import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import JoditEditor from "jodit-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../constants/constant.js";

const NoteEditor = () => {
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [noteId, setNoteId] = useState(null);
  const [favorite, setFavorite] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const config = {
    readonly: false,
    height: 500,
    toolbarButtonSize: "middle",
    buttons: ["bold", "italic", "underline", "link", "unlink", "source"],
    uploader: {
      insertImageAsBase64URI: true,
    },
  };
  document.body.style.backgroundColor = "#000";

  useEffect(() => {
    if (location.state?.note) {
      const { _id, title, content, favourite } = location.state.note;
      setNoteId(_id);
      setTitle(title);
      setContent(content);
      setFavorite(favourite); 
    }
  }, [location.state]);

  const saveNote = async (status) => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      toast.error("Title and Content cannot be empty!");
      return;
    }

    const noteData = {
      title: trimmedTitle,
      content: trimmedContent,
      status: status,
      favourite: favorite, 
    };

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Authentication required! Please login.");
        return;
      }

      if (noteId) {
        await axios.put(`${BASE_URL}/api/notes/update/${noteId}`, noteData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success(
          status === "saved" ? "Note updated successfully!" : "Saved as Draft"
        );
      } else {
        await axios.post(`${BASE_URL}/api/notes`, noteData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success(
          status === "saved" ? "Note saved successfully!" : "Saved as Draft"
        );
      }

      setTimeout(() => {
        if (status === "saved") {
          navigate("/notes/all");
        } else if (status === "draft") {
          navigate("/notes/drafts");
        }
      }, 1500);
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error("Failed to save note! Please check your input or backend.");
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto",
        backgroundColor: "#000",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <h2
        style={{
          color: "#fff",
          fontSize: "48px",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        {noteId ? "Edit Note" : "Create Note"}
      </h2>

      <input
        type="text"
        placeholder="Enter title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "15px",
          fontSize: "18px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          backgroundColor: "#fff",
          color: "#000",
        }}
      />

      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        tabIndex={1}
        data-testid="content-editor"
        onBlur={(newContent) => setContent(newContent)}
        onChange={() => {}}
      />

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          gap: "10px",
          justifyContent: "center",
        }}
      >
        <button
          onClick={() => saveNote("saved")}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {noteId ? "Update Note" : "Save Note"}
        </button>

        <button
          onClick={() => saveNote("draft")}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#ffc107",
            color: "#000",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Save as Draft
        </button>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default NoteEditor;
