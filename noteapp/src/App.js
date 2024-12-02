import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noteInput, setNoteInput] = useState({ title: "", content: "" });
  const [editingNoteId, setEditingNoteId] = useState(null);

  // Load notes from local storage on mount
  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    setNotes(savedNotes);
  }, []);

  // Save notes to local storage on change
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  // Add a new note
  const handleAddNote = () => {
    if (!noteInput.title || !noteInput.content) {
      alert("Please fill out both fields!");
      return;
    }

    if (editingNoteId !== null) {
      // Editing existing note
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === editingNoteId
            ? { ...note, title: noteInput.title, content: noteInput.content }
            : note
        )
      );
      setEditingNoteId(null);
    } else {
      // Adding a new note
      const newNote = {
        id: Date.now(),
        title: noteInput.title,
        content: noteInput.content,
      };
      setNotes([...notes, newNote]);
    }
    setNoteInput({ title: "", content: "" });
  };

  // Delete a note
  const handleDeleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  // Start editing a note
  const handleEditNote = (note) => {
    setEditingNoteId(note.id);
    setNoteInput({ title: note.title, content: note.content });
  };

  // Filter notes by search query
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app">
      <h1> Note Application</h1>

      <div className="note-input-section">
        <input
          type="text"
          placeholder="Title"
          value={noteInput.title}
          onChange={(e) => setNoteInput({ ...noteInput, title: e.target.value })}
        />
        <textarea
          placeholder="Content"
          value={noteInput.content}
          onChange={(e) =>
            setNoteInput({ ...noteInput, content: e.target.value })
          }
        ></textarea>
        <button onClick={handleAddNote}>
          {editingNoteId ? "Update Note" : "Add Note"}
        </button>
      </div>

      <div className="search-section">
        <input
          type="text"
          placeholder="Search Notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="notes-container">
        {filteredNotes.map((note) => (
          <div className="note" key={note.id}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <div className="note-actions">
              <button onClick={() => handleEditNote(note)}>Edit</button>
              <button onClick={() => handleDeleteNote(note.id)}>Delete</button>
            </div>
          </div>
        ))}
        {filteredNotes.length === 0 && <p>No notes found.</p>}
      </div>
    </div>
  );
}

export default App;
