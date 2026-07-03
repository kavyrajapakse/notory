import React, { useState, useEffect } from 'react';
import ListView from './components/ListView.jsx';
import EditorView from './components/EditorView';

export default function App() {
  const [notes, setNotes] = useState([]);
  const [currentPage, setCurrentPage] = useState('list'); // 'list' or 'editor'
  const [activeNote, setActiveNote] = useState(null); // holds the note object being edited, or null for a new note

  const API_URL = 'http://localhost:5000/api/notes';

  // Fetch all notes from the backend on load
  const fetchNotes = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch notes');
      const data = await response.json();
      
      // Sort notes: newest first
      const sortedNotes = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotes(sortedNotes);
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Create or Update a note via API
  const handleSaveNote = async (noteData) => {
    try {
      let response;
      if (noteData.id) {
        // Edit Mode (PUT request)
        response = await fetch(`${API_URL}/${noteData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: noteData.title,
            content: noteData.content,
            category: noteData.category
          })
        });
      } else {
        // Create Mode (POST request)
        response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: noteData.title,
            content: noteData.content,
            category: noteData.category
          })
        });
      }

      if (!response.ok) throw new Error('Failed to save note');
      
      // Reload notes and return to the list screen
      await fetchNotes();
      setCurrentPage('list');
      setActiveNote(null);
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Could not save note. Make sure the server is running!');
    }
  };

  // Delete a note via API
  const handleDeleteNote = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note permanently?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete note');
      
      // Reload notes and return to list screen
      await fetchNotes();
      setCurrentPage('list');
      setActiveNote(null);
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Could not delete note.');
    }
  };

  // Render the correct screen based on state
  return (
    <div className="min-h-screen bg-zinc-950 font-sans">
      {currentPage === 'list' ? (
        <ListView
          notes={notes}
          onCreateNote={() => {
            setActiveNote(null); // Indicates a new note
            setCurrentPage('editor');
          }}
          onSelectNote={(note) => {
            setActiveNote(note); // Load selected note
            setCurrentPage('editor');
          }}
        />
      ) : (
        <EditorView
          note={activeNote}
          onSave={handleSaveNote}
          onDelete={handleDeleteNote}
          onBack={() => {
            setCurrentPage('list');
            setActiveNote(null);
          }}
        />
      )}
    </div>
  );
}