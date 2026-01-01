const https = require('https');
const fs = require('fs');

const PORT = 5710;
const EXTERNAL_URL = 'https://www.dtek-kem.com.ua/ua/shutdowns';
//const ALLOWED_ORIGIN = 'http://localhost:3000';

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};


const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "https://maxislav.github.io/power-outage",
  "https://another-site.net",
];

const server = https.createServer(options, async (req, res) => {

  const origin = req.headers.origin;

  console.log('origin ->>',origin)
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  // Проверяем путь запроса
  if (req.url === '/shotdown' && req.method === 'GET') {
    try {
      console.log(`Получен запрос. Обращаюсь к ${EXTERNAL_URL}...`);

      // Делаем запрос к сайту ДТЭК
      const response = await fetch(EXTERNAL_URL);
      const data = await response.text();

      // Отправляем результат клиенту
      //res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      const dd = extractFactObject(data);
      console.log('результат клиенту->>', dd)
      res.end(dd);
    } catch (error) {
      console.error('Ошибка при запросе:', error.message);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Не удалось получить данные с сайта ДТЭК' }));
    }
  } else {
    // Обработка несуществующих путей
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found. Use /shotdown');
  }
});

server.listen(PORT, () => {
  console.log(`Сервер запущен на https://localhost:${PORT}`);
  console.log(`Маршрут: https://localhost:${PORT}/shotdown`);
});

function extractFactObject(html) {
  const startKeyword = "DisconSchedule.fact = ";
  const startIndex = html.indexOf(startKeyword);
  
  if (startIndex === -1) return null;

  // Смещение к началу самого объекта (к первой '{')
  const jsonStartIndex = html.indexOf('{', startIndex);
  if (jsonStartIndex === -1) return null;

  let braceCount = 0;
  let jsonEndIndex = -1;

  // Идем по строке и считаем скобки
  for (let i = jsonStartIndex; i < html.length; i++) {
    if (html[i] === '{') braceCount++;
    if (html[i] === '}') braceCount--;

    if (braceCount === 0) {
      jsonEndIndex = i + 1; // Конец объекта найден
      break;
    }
  }

  return html.substring(jsonStartIndex, jsonEndIndex);
  

  // if (jsonEndIndex !== -1) {
  //   const jsonString = html.substring(jsonStartIndex, jsonEndIndex);
  //   try {
  //     return JSON.parse(jsonString);
  //   } catch (e) {
  //     console.error("Ошибка парсинга вложенного JSON:", e.message);
  //     return null;
  //   }
  // }

  // return null;
}