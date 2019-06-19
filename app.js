// import needed libraries for the app to work
import express from 'express'; // for the server
import cors from 'cors'; // for the server
import uuidv4 from 'uuid/v4'; // for generating unique id's

// create a variable with express as it's value
const app = express(); // initiate express
app.use(cors()) // use cors
app.use(express.json()); // support JSON parsing

// set notes storage using locals that is provided by express
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

// get request method
app.get('/api/v1/notes', (request, response) => { // listen for get requests within this  url
  const notes = app.locals.notes // create a notes variable with local notes as master copy
  return response.status(200).json({ notes }) // return a response with a status code of 200
  // use json to parse the notes and include it with the response
});

// post request method
app.post('/api/v1/notes', (request, response) => { // listen for post requests within this url
  const id = uuidv4(); // generate a unique id 
  const { listItems, title } = request.body // create listItems and title variables from the request body

  // check if listItems and title both don't have a value,
  // if so return error status code 422 and a message
  if(!listItems && !title) return response.status(422).json('Please provide a title or a list item.')

  // create a new note
  const newNote = {
    id, // attach id that was created above
    title: title || '', // title prop is optional and is an empty string by default
    listItems: listItems || [] // listItems is also optional and is an empty array by default
  }

  // push the new notes into local notes(pushing from the front)
  app.locals.notes.unshift(newNote);
  // return a response with status code 201 and the newNote with it
  response.status(201).json(newNote);
})

// delete request method
app.delete('/api/v1/notes/:id', (request, response) => { // listen for delete requests within this url, id being the note identifier for deletion
  const id = request.params.id; // take the id from request parameters
  const newNotes = app.locals.notes.filter(note => note.id !== id); // filter out ids that matched the param recieved

  // check if the filter did/did not filter out the id param recieved
  if (newNotes.length !== app.locals.notes.length) {
    app.locals.notes = newNotes // re-assign local notes to the filtered notes
    return response.sendStatus(204); // return a response with a status of 204(success)
  } else {
    return response.status(404).json({ error: 'No notes found'}) // return status code 404(not found) and the error message with it
  }
})

// get request method
app.get('/api/v1/notes/:id', (request, response) => {// listen for get requests within this url, id being the notes identifier for deletion
  const id = request.params.id; // take the id from request parameters
  const note = app.locals.notes.find(note => note.id === id); // find the note within locals that matches the requested id
  
  // if there is no note found
  if (!note) {
    // return a response with 404(not found) and an error message object
    return response.status(404).json({ error: 'No notes found'})
  }
  // if the statement above is not met, return a response with status code 200(ok) with the note found
  return response.status(200).json(note);
})

// put request method
app.put('/api/v1/notes/:id', (request, response) => { // listen for put requests from this url, id being the notes identifier for editing
  const { title, listItems } = request.body; // create title and listItems variables from the request body 
  const id = request.params.id; // take the id from the request parameters
  let noteWasFound = false; // create variable for found note and by default set to false
  
  // map through the notes
  const updatedNotes = app.locals.notes.map(note => {
    if (note.id === id)  {  // if request param id matches the current note iteration
      noteWasFound = true; // re-assign the notewasfound to true
      // return the new object with the new title/listItems and not touch the note id
      // if there are no title/listItems, return the existing listItem/title
      return { title: title || note.title, listItems: listItems || note.listItems, id: note.id }
    } else {
      // return the note if it does not match the id
      return note
    }
  });

  // check if there was an edited note
  if (!noteWasFound) {
    // return response 404(note found) and error message
    return response.status(404).json('No note found')
  }

  app.locals.notes = updatedNotes; //re -assign the local notes to the updated notes
  return response.status(202).json('Successfully edited note'); // return status 202 and a message if all goes well
})

// export the app to be used within server js
export default app;