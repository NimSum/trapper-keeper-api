import express from 'express';
import cors from 'cors';
const app = express();
const uuidv4 = require('uuid/v4');
app.use(cors())
app.use(express.json());

app.locals.notes = [
  { 
    title: 'randomnote', 
    id: '1', 
    listItems: [
      { id: '1', body: 'asdf', completed: false }
    ]
  },
  { 
    title: 'randomnoteTWO', 
    id: '2', 
    listItems: [
      { id: '2', body: 'asdf', completed: false }                           
    ]
  }
];

app.get('/api/v1/notes', (request, response) => {
  const notes = app.locals.notes
  return response.status(200).json({ notes })
});

app.post('/api/v1/notes', (request, response) => {
  const note = request.body;
  const id = uuidv4();
  note.id = id;
  app.locals.notes.push(note);
  response.status(201).json({ id });
})

app.delete('/api/v1/notes/:id', (request, response) => {
  const id = request.params.id;
  const newNotes = app.locals.notes.filter(note => note.id !== id);
  if (newNotes.length !== app.locals.notes.length) {
    app.locals.notes = newNotes
    return response.sendStatus(204);
  } else {
    return response.status(404).json({ error: 'No notes found'})
  }
})

app.get('/api/v1/notes/:id', (request, response) => {
  const id = request.params.id;
  const note = app.locals.notes.find(note => note.id === id);
  if (!note) {
    return response.status(404).json({ error: 'No notes found'})
  }
  return response.status(200).json(note);
})

app.put('/api/v1/notes/:id', (request, response) => {
  const { title, listItems } = request.body;
  const id = request.params.id;
  let noteWasFound = false;
  const updatedNotes = app.locals.notes.map(note => {
    if (note.id === id)  {
      noteWasFound = true;
      return { title, listItems, id }
    } else {
      return note
    }
  });

  if (!title || !listItems) {
    return response.status(422).json('Please provide title and listItems')
  }

  if (!noteWasFound) {
    return response.status(404).json('No note found')
  }

  app.locals.notes = updatedNotes;
  return response.status(202).json('Successfully edited note');
})

export default app;