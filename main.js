const express = require("express");
const path = require("path");
const { program } = require("commander");
const bodyParser = require("body-parser");
const multer = require("multer");
const app = express();
const upload = multer(); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json()); 

program
  .requiredOption("-h, --host <host>", "адреса сервера")
  .requiredOption("-p, --port <port>", "порт сервера")
  .requiredOption("-c, --cache <cache>", "шлях до кешу");

program.parse(process.argv);
const { host, port, cache } = program.opts();

const notes = {};

app.get("/UploadForm.html", (req, res) => {
  const formPath = path.join(__dirname, "UploadForm.html");
  res.sendFile(formPath);
});

app.get("/notes", (req, res) => {
  const notesList = Object.entries(notes).map(([name, text]) => ({
    name,
    text,
  }));
  res.status(200).json(notesList);
});

app.get("/notes/:noteName", (req, res) => {
  const noteName = req.params.noteName;
  if (notes[noteName]) {
    res.status(200).send(notes[noteName]);
  } else {
    res.status(404).send("Not found");
  }
});

app.put("/notes/:noteName", (req, res) => {
  const noteName = req.params.noteName;
  if (notes[noteName]) {
    notes[noteName] = req.body.note || "";
    res.status(200).send("Note updated");
  } else {
    res.status(404).send("Not found");
  }
});

app.delete("/notes/:noteName", (req, res) => {
  const noteName = req.params.noteName;
  if (notes[noteName]) {
    delete notes[noteName];
    res.status(200).send("Note deleted");
  } else {
    res.status(404).send("Not found");
  }
});

app.post("/write", upload.none(), (req, res) => {
  const { note_name, note } = req.body;

  if (!note_name || !note) {
    return res.status(400).send("Note name and text are required");
  }
  if (notes[note_name]) {
    return res.status(400).send("Note already exists");
  }
  notes[note_name] = note;
  res.status(201).send("Note created");
});

app.listen(port, host, () => {
  console.log(`Сервер запущено на http://${host}:${port}`);
});
