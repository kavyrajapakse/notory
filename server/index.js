const express = require('express');
const cors = require('cors');
const db = require('./firebase/firebase');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// 1. Get all notes from Firestore
app.get('/api/notes', async (req, res) => {
  try {
    const notesSnapshot = await db.collection('notes').get();
    const notesList = notesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json(notesList);
  } catch (error) {
    console.error("Error fetching notes: ", error);
    res.status(500).json({ error: 'Failed to fetch notes from database' });
  }
});

// 2. Create a new note in Firestore
app.post('/api/notes', async (req, res) => {
  try {
    const { title, content, category } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const newNoteData = {
      title,
      content: content || '',
      category: category || 'General',
      createdAt: new Date().toISOString()
    };

    const docRef = await db.collection('notes').add(newNoteData);
    
    res.status(201).json({
      id: docRef.id,
      ...newNoteData
    });
  } catch (error) {
    console.error("Error creating note: ", error);
    res.status(500).json({ error: 'Failed to create note in database' });
  }
});

// 3. Update an existing note in Firestore
app.put('/api/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category } = req.body;

    const docRef = db.collection('notes').doc(id);
    const docSnap = await docRef.get();
    
    if (!docSnap.exists) {
      return res.status(404).json({ error: 'Note not found' });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (category !== undefined) updateData.category = category;

    await docRef.update(updateData);
    
    res.json({
      id,
      ...docSnap.data(),
      ...updateData
    });
  } catch (error) {
    console.error("Error updating note: ", error);
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// 4. Delete a note from Firestore
app.delete('/api/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = db.collection('notes').doc(id);
    const docSnap = await docRef.get();
    
    if (!docSnap.exists) {
      return res.status(404).json({ error: 'Note not found' });
    }

    await docRef.delete();
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error("Error deleting note: ", error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

// Status check endpoint
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', message: 'Notory API is running smoothly!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});