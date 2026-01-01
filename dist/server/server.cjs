const http = require("http");
const https = require("https");
const fs = require("fs");

const PORT_HTTPS = 5710;
const PORT_HTTP = 5711;
const EXTERNAL_URL = "https://www.dtek-kem.com.ua/ua/shutdowns";
//const ALLOWED_ORIGIN = 'http://localhost:3000';

const options = {
  key: null,
  cert: null,
};
try {
  options.key = fs.readFileSync("key.pem");
  options.cert = fs.readFileSync("cert.pem");
} catch (e) {
  console.log("no sert");
}

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "https://maxislav.github.io/power-outage",
  "https://another-site.net",
];

const headers = {
  'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  'accept-language': 'en-US,en;q=0.9,ru-UA;q=0.8,ru;q=0.7',
  'cache-control': 'max-age=0',
  'priority': 'u=0, i',
  'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Linux"',
  'sec-fetch-dest': 'document',
  'sec-fetch-mode': 'navigate',
  'sec-fetch-site': 'none',
  'sec-fetch-user': '?1',
  'upgrade-insecure-requests': '1',
  'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
  'cookie': 'visid_incap_2224657=C4qg3tynR46X3ZinBES6SsXXVmkAAAAAQUIPAAAAAACkinURo/gzrOpJBRB1llIW; incap_ses_689_2224657=U4yMY05tHhat3DqrS9KPCcXXVmkAAAAA2QNLvabOxdACNwjD06yLmg==; dtek-kem=1gccm48kedg9qd696ss06anmu3; _language=1f011804d107a9f0f6fa36417ed49140e5bc2106c740e65666f3a94e857201cca%3A2%3A%7Bi%3A0%3Bs%3A9%3A%22_language%22%3Bi%3A1%3Bs%3A2%3A%22uk%22%3B%7D; _csrf-dtek-kem=39e2be2a9d4597c71ba9a56342e622da0e0c2e7402689161494dfdd43baa7604a%3A2%3A%7Bi%3A0%3Bs%3A14%3A%22_csrf-dtek-kem%22%3Bi%3A1%3Bs%3A32%3A%22mJHXwWO23-MKA2yzHl6XZxyN_Fil2pQi%22%3B%7D; _ga=GA1.3.334945741.1767299050; _gid=GA1.3.763767310.1767299051; _hjSessionUser_5026684=eyJpZCI6ImYwNDI1MTZiLWIzOTMtNWIwOS04YjIzLTFiYTAyZjczNGYxYSIsImNyZWF0ZWQiOjE3NjcyOTkwNTA5NjIsImV4aXN0aW5nIjpmYWxzZX0=; _hjSession_5026684=eyJpZCI6IjE1OTBmYWMxLWU1NGQtNDcwYi04ODBiLWEyYTcxODZhZGYxMSIsImMiOjE3NjcyOTkwNTA5NjQsInMiOjAsInIiOjAsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjoxLCJzcCI6MH0=; incap_wrt_373=69dWaQAAAAC5je1eGgAI9QIQlfLVz4oCGJey28oGIAIox6/bygYwAVL7gYqHxQlMRQoTnNldEDs=; _ga_DLFSTRRPM2=GS2.1.s1767299050$o1$g1$t1767299121$j60$l0$h0'
};

// Пример вызова
fetch('https://www.dtek-kem.com.ua/ua/shutdowns', {
  method: 'GET',
  headers: headers
})
.then(res => res.text())
.then(console.log);


const server = https.createServer(options, async (req, res) => {
  const origin = req.headers.origin;

  console.log("origin ->>", origin);
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  // Проверяем путь запроса
  if (req.url === "/shotdown" && req.method === "GET") {
    try {
      console.log(`Получен запрос. Обращаюсь к ${EXTERNAL_URL}...`);

      // Делаем запрос к сайту ДТЭК
      const response = await fetch(EXTERNAL_URL, {headers});
      const data = await response.text();
      console.log(data);

      // Отправляем результат клиенту
      //res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      const dd = extractFactObject(data);
      console.log("результат клиенту->>", dd);
      if (!dd) {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(data);
      } else {
        res.end(dd);
      }
    } catch (error) {
      console.error("Ошибка при запросе:", error.message);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ error: "Не удалось получить данные с сайта ДТЭК" })
      );
    }
  } else {
    // Обработка несуществующих путей
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found. Use /shotdown");
  }
});

const server2 = http.createServer(async (req, res) => {
  const origin = req.headers.origin;

  console.log("origin ->>", origin);
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  // Проверяем путь запроса
  if (req.url === "/shotdown" && req.method === "GET") {
    try {
      console.log(`Получен запрос. Обращаюсь к ${EXTERNAL_URL}...`);

      // Делаем запрос к сайту ДТЭК
      const response = await fetch(EXTERNAL_URL, {headers});
      const data = await response.text();
      console.log(data);

      // Отправляем результат клиенту
      //res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      const dd = extractFactObject(data);
      console.log("результат клиенту->>", dd);
      if (!dd) {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(data);
      } else {
        res.end(dd);
      }
    } catch (error) {
      console.error("Ошибка при запросе:", error.message);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ error: "Не удалось получить данные с сайта ДТЭК" })
      );
    }
  } else {
    // Обработка несуществующих путей
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found. Use /shotdown");
  }
});

server2.listen(PORT_HTTP, () => {
  console.log(`Сервер запущен на https://localhost:${PORT_HTTP}`);
  console.log(`Маршрут: https://localhost:${PORT_HTTP}/shotdown`);
});

if (options.cert) {
  server.listen(PORT_HTTPS, () => {
    console.log(`Сервер запущен на https://localhost:${PORT_HTTPS}`);
    console.log(`Маршрут: https://localhost:${PORT_HTTPS}/shotdown`);
  });
}

function extractFactObject(html) {
  const startKeyword = "DisconSchedule.fact = ";
  const startIndex = html.indexOf(startKeyword);

  if (startIndex === -1) return null;

  // Смещение к началу самого объекта (к первой '{')
  const jsonStartIndex = html.indexOf("{", startIndex);
  if (jsonStartIndex === -1) return null;

  let braceCount = 0;
  let jsonEndIndex = -1;

  // Идем по строке и считаем скобки
  for (let i = jsonStartIndex; i < html.length; i++) {
    if (html[i] === "{") braceCount++;
    if (html[i] === "}") braceCount--;

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
