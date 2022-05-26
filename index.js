require("dotenv").config();
require("./mongo");
const express = require("express");
require("colors");
const logger = require("./loggerMiddleware");
const Note = require("./models/Note");

//Para que mi api sea publica a cualquier dominio
const cors = require("cors");
const NotFound = require("./middlewares/NotFound");
const HandleErrors = require("./middlewares/HandleErrors");

const app = express();
//Middlewares
app.use(express.json());
app.use(cors());
app.use(logger);

//Routes
app.get("/", (request, response) => {
  response.send("Holiiiiis");
});

app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});
app.get("/api/notes/:id", (request, response, next) => {
  const { id } = request.params;
  Note.findById(id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.post("/api/notes", (request, response) => {
  const note = request.body;
  if (!note || !note.content) {
    return response.status(400).json({
      error: "note content is missing",
    });
  }
  const newNote = Note({
    content: note.content,
    date: new Date(),
    important: typeof note.important != "undefined" ? note.important : false,
  });
  newNote.save().then((savedNote) => {
    response.json(savedNote);
  });
});
app.put("/api/notes/:id", (request, response, next) => {
  const { id } = request.params;
  const note = request.body;
  const newNoteUpdate = {
    content: note.content,
    important: note.important,
  };
  Note.findByIdAndUpdate(id, newNoteUpdate, { new: true })
    .then((result) => {
      response.status(200).json(result);
    })
    .catch((error) => next(error));
});
app.delete("/api/notes/:id", (request, response, next) => {
  const { id } = request.params;
  Note.findByIdAndDelete(id)
    .then((result) => {
      response.status(204).json(result).end();
    })
    .catch((error) => next(error));
});

//Middleware que controla el 404
app.use(NotFound);
app.use(HandleErrors);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Server running on port ".cyan, PORT);
});
