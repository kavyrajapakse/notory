const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');
const db = require('./firebase/firebase');
require('dotenv').config();

const app = express();

// Initialize Groq SDK (only if key exists to prevent crashing during local tests)
const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

// Middleware
app.use(cors());
app.use(express.json());

// ==========================================
// Database Endpoints (CRUD)
// ==========================================

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

// ==========================================
// AI Endpoints (Groq + Llama 3)
// ==========================================

// 1. AI Title Generator
app.post('/api/ai/title', async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Content is required' });
    }
    if (!groq) {
      return res.status(503).json({ error: 'AI service not configured' });
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `Analyze this note and generate a short, clean, professional title (under 6 words). Output ONLY the title itself. Do not use quotation marks, do not output explanations, and do not use prefixes like "Suggested Title:".\n\nNote content:\n${content}`
        }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 20
    });

    const title = chatCompletion.choices[0].message.content.trim();
    res.json({ title });
  } catch (error) {
    console.error('Error generating title:', error);
    res.status(500).json({ error: 'Failed to generate title' });
  }
});

// 2. AI Note Summarizer
app.post('/api/ai/summarize', async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Content is required' });
    }
    if (!groq) {
      return res.status(53).json({ error: 'AI service not configured' });
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `You are an AI assistant helping a user summarize their personal notes. Generate a concise summary of the following note. Use 3 to 5 clear bullet points starting with '•'. Do not output any intro or outro text.\n\nNote Title: ${title || 'Untitled'}\n\nNote Content:\n${content}`
        }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.5,
      max_tokens: 150
    });

    const summary = chatCompletion.choices[0].message.content.trim();
    res.json({ summary });
  } catch (error) {
    console.error('Error summarizing note:', error);
    res.status(500).json({ error: 'Failed to summarize note' });
  }
});

// 3. AI Writing Enhancer
app.post('/api/ai/enhance', async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Content is required' });
    }
    if (!groq) {
      return res.status(503).json({ error: 'AI service not configured' });
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `Improve this note by correcting grammar, fixing spelling mistakes, and polishing the tone to be professional, clear, and engaging. Do not change the core meaning. Output ONLY the improved text. No introductions, no explanations, no surrounding quotes.\n\nText to improve:\n${content}`
        }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.3,
      max_tokens: 1000
    });

    const enhancedText = chatCompletion.choices[0].message.content.trim();
    res.json({ enhancedText });
  } catch (error) {
    console.error('Error enhancing writing:', error);
    res.status(500).json({ error: 'Failed to enhance writing' });
  }
});

// ==========================================
// Status Check
// ==========================================
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', message: 'Notory API is running smoothly!' });
});

module.exports = app;