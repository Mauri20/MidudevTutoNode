const express = require("express");
require("colors");
const logger = require("./loggerMiddleware");
//Para que mi api sea publica a cualquier dominio
const cors = require("cors");

const app = express();
//Middlewares
app.use(express.json());
app.use(cors());
app.use(logger);

const date = new Date();

let notes = [
  {
    id: 1,
    content: "Contenido de la nota 1",
    date: date.toLocaleDateString(),
    important: true,
  },
  {
    id: 2,
    content: "Contenido de la nota 2",
    date: date.toLocaleDateString(),
    important: true,
  },
  {
    id: 3,
    content: "Contenido de la nota 3",
    date: date.toLocaleDateString(),
    important: true,
  },
];

app.get("/", (request, response) => {
  response.send("Holiiiiis");
});

app.get("/api/notes", (request, response) => {
  response.json(notes);
});
app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((note) => note.id === id);
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

app.post("/api/notes", (request, response) => {
  const note = request.body;
  if (!note || !note.content) {
    return response.status(400).json({
      error: "note content is missing",
    });
  }
  const ids = notes.map((note) => note.id);
  const maxId = Math.max(...ids);
  const newNote = {
    id: maxId + 1,
    content: note.content,
    date: date.toISOString(),
    important: typeof note.important != "undefined" ? note.important : false,
  };
  notes = [...notes, newNote];
  response.json(newNote);
});

app.delete("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  notes = notes.filter((note) => note.id != id);
  response.json(notes);
});

//Middleware que controla el 404
app.use((req, res, next) => {
  console.log(req.path);
  res.status(404).json({
    error: "Página no encontrada",
  });
  next();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log("Server running on port ".cyan, PORT);
});
