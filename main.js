
const express = require('express');
const { Command } = require('commander');

const program = new Command();
program
  .requiredOption('-h, --host <host>', 'адреса сервера')
  .requiredOption('-p, --port <port>', 'порт сервера')
  .requiredOption('-c, --cache <path>', 'шлях до директорії з кешованими файлами');

program.parse(process.argv);
const options = program.opts();

if (!options.host || !options.port || !options.cache) {
  console.error('Помилка: необхідні параметри не задані');
  process.exit(1);
}

const app = express();

app.get('/', (req, res) => {
});

app.listen(options.port, options.host, () => {
  console.log(`Сервер запущено на http://${options.host}:${options.port}`)
});
