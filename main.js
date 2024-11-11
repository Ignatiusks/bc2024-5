
const express = require('express');
const path = require('path');
const { program } = require("commander");

const app = express();
const notes = {};

// Налаштування параметрів командного рядка
program
  .requiredOption('-h, --host <host>', 'адреса сервера')
  .requiredOption('-p, --port <port>', 'порт сервера')
  .requiredOption('-c, --cache <cache>', 'шлях до кешу директорії');

program.parse(process.argv);
const { host, port, cache } = program.opts();

// Налаштування мідлверів для обробки JSON і form-urlencoded даних
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Маршрути для обробки запитів

// Повернення HTML форми для завантаження нотаток
app.get('/UploadForm.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'UploadForm.html'));
});

// Тестовий маршрут для перевірки запуску сервера
app.get('/', (req, res) => {
  res.send('Сервер працює!');
});

// Отримання всіх нотаток
app.get('/notes', (req, res) => {
  const notesList = Object.keys(notes).map(name => ({
    name,
    text: notes[name],
  }));
  res.status(200).json(notesList);
});

// Отримання конкретної нотатки
app.get('/notes/:noteName', (req, res) => {
  const noteName = req.params.noteName;
  if (notes[noteName]) {
    res.status(200).send(notes[noteName]);
  } else {
    res.status(404).send('Not found');
  }
});

// Оновлення тексту нотатки
app.put('/notes/:noteName', (req, res) => {
  const noteName = req.params.noteName;
  if (notes[noteName]) {
    notes[noteName] = req.body.note;
    res.status(200).send('Note updated');
  } else {
    res.status(404).send('Not found');
  }
});

// Видалення нотатки
app.delete('/notes/:noteName', (req, res) => {
  const noteName = req.params.noteName;
  if (notes[noteName]) {
    delete notes[noteName];
    res.status(200).send('Note deleted');
  } else {
    res.status(404).send('Not found');
  }
});

// Створення нової нотатки
app.post('/write', (req, res) => {
  const { note_name, note } = req.body;
  if (notes[note_name]) {
    return res.status(400).send('Note already exists');
  }
  notes[note_name] = note;
  res.status(201).send('Note created');
});

// Запуск сервера
app.listen(port, host, () => {
  console.log(`Сервер запущено на http://${host}:${port}`);
});
