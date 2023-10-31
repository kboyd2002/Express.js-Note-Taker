const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3006;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// API routes
app.get('/api/notes', (req, res) => {
  // Read the notes from the db.json file
  const notes = JSON.parse(fs.readFileSync(path.join(__dirname, './db/db.json'), 'utf8'));
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  // Read the existing notes from the db.json file
  const notes = JSON.parse(fs.readFileSync(path.join(__dirname, './db/db.json'), 'utf8'));

  // Create a new note with the request body
  const newNote = {
    id: notes.length + 1,
    title: req.body.title,
    text: req.body.text
  };

  // Push the new note to the existing notes array
  notes.push(newNote);

  // Write the updated notes array to the db.json file
  fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(notes));

  res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
  // Read the existing notes from the db.json file
  const notes = JSON.parse(fs.readFileSync(path.join(__dirname, './db/db.json'), 'utf8'));

  // Find the note with the specified id
  const noteIndex = notes.findIndex(note => note.id === parseInt(req.params.id));

  // If the note exists, remove it from the array
  if (noteIndex !== -1) {
    notes.splice(noteIndex, 1);

    // Write the updated notes array to the db.json file
    fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(notes));

    res.json({ message: 'Note deleted successfully' });
  } else {
    res.status(404).json({ error: 'Note not found' });
  }
});

// HTML routes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});