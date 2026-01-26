import * as http from 'http';
import * as https from 'https';
import * as fs from 'fs';
//import {JSDOM} from 'jsdom';
import * as cheerio from 'cheerio';

const PORT_HTTPS = 5712;
const PORT_HTTP = 5714;

class Deferred {
    promise: Promise<any>;
    resolve: (value: any) => void;
    reject: (reason: any) => void;

    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}

const options: any = {
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
    "https://maxislav.github.io",
    "https://another-site.net",
];

let cookie;

const headers = {
    accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "accept-language": "en-US,en;q=0.9,ru-UA;q=0.8,ru;q=0.7",
    "cache-control": "no-cache",
    pragma: "no-cache",
    priority: "u=0, i",
    "sec-ch-ua":
        '"Google Chrome";v="143", "Chromium";v="143", "Not A(Brand";v="24"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "none",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
    "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
};

const serverHttps = https.createServer(options, async (reqq: any, ress: any) => {
    const origin = reqq.headers.origin || reqq.headers.referer;

    const baseURL = `https://${reqq.headers.host}`;

    const myURL = new URL(reqq.url, baseURL);
    const reqParams = {
        origin: myURL.searchParams.get("origin"),
        slot: myURL.searchParams.get("slot"),
    };
    if (ALLOWED_ORIGINS.includes(origin)) {
        ress.setHeader("Access-Control-Allow-Origin", origin);
    }
    ress.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    ress.setHeader("Access-Control-Allow-Headers", "Content-Type");
    // Проверяем путь запроса
    if (myURL.pathname === "/shutdown" && reqq.method === "GET") {
        try {
            const data = await getRegion(reqParams);
            ress.end(data);
        } catch (error) {
            console.error("Ошибка при запросе:", error);
            ress.end(error);
        }
    } else {
        // Обработка несуществующих путей
        ress.writeHead(404, {"Content-Type": "text/plain"});
        ress.end("Not Found. Use /shutdown");
    }
});

const serverHttp = http.createServer(async (reqq: any, ress: any) => {
    const origin = reqq.headers.origin;

    const baseURL = `http://${reqq.headers.host}`;

    const myURL = new URL(reqq.url, baseURL);
    const reqParams = {
        origin: myURL.searchParams.get("origin"),
        slot: myURL.searchParams.get("slot"),
    };

    console.log("reqParams ->>", reqParams);
    if (ALLOWED_ORIGINS.includes(origin)) {
        ress.setHeader("Access-Control-Allow-Origin", origin);
    }
    ress.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    ress.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (myURL.pathname === "/shutdown" && reqq.method === "GET") {
        try {
            const data = await getRegion(reqParams);
            ress.end(data);
        } catch (error) {
            console.error("Ошибка при запросе:", error);
            ress.end(error);
        }
    } else {
        // Обработка несуществующих путей
        ress.writeHead(404, {"Content-Type": "text/plain"});
        ress.end("Not Found. Use /shutdown");
    }
});

serverHttp.listen(PORT_HTTP, () => {
    console.log(`Сервер запущен на http://localhost:${PORT_HTTP}`);
    console.log(`Маршрут: http://localhost:${PORT_HTTP}/shutdown`);
});

if (options.cert) {
    serverHttps.listen(PORT_HTTPS, () => {
        console.log(`Сервер запущен на https://localhost:${PORT_HTTPS}`);
        console.log(`Маршрут: https://localhost:${PORT_HTTPS}/shutdown`);
    });
}

async function getCity() {
    const deferred = new Deferred();

    const options = {
        hostname: "app.yasno.ua",
        path: "/api/blackout-service/public/shutdowns/regions/25/dsos/902/planned-outages",
        port: 443,
        method: "GET",
        headers: {...headers},
    };

    https
        .get(options, (res: any) => {
            let data = "";
            const headers = res.headers;
            //console.log("Set-Cookie:", headers["set-cookie"]);

            // Получаем части данных
            res.on("data", (chunk: any) => {
                data += chunk;
            });

            // Весь ответ получен
            res.on("end", () => {
                console.log("end ->> ok");
                //console.log(extractFactObject(data));
                //const resObj = (data);
                // const nn =  data.replace('/_Incapsula', 'https://www.dtek-kem.com.ua/_Incapsula')
                deferred.resolve(data);
            });
        })
        .on("error", (err: any) => {
            console.log("Ошибка: " + err.message);
            deferred.reject(err.message);
        });

    return deferred.promise;
}
async function getRegion({origin, slot}: { origin: any, slot: any }, acc?: any): Promise<any> {
    const deferred = new Deferred();

    const options = {
        hostname: "alerts.org.ua",
        path: origin === "city" ? "/kyiv/" : "/kyivska-oblast/",
        port: 443,
        method: "GET",
        headers: {...headers},
    };

    https
        .get(options, (res: any) => {
            let data = "";
            res.on("data", (chunk: any) => {
                data += chunk;
            });

            const selectorId = origin === "city" ? "r1g" : "r12g";
            res.on("end", () => {
                // 2. Загружаем данные в cheerio ($ - стандартное имя переменной для cheerio)
                const $ = cheerio.load(data);

                // 3. Ищем группу (синтаксис как в jQuery/querySelector)
                const group = $(`[data-group-id="${selectorId}${slot.replace(".", "-")}"]`);

                // Находим все ссылки в меню графиков
                const shMenuList = $(".shedule-menu > a");
                let tomorrowHref = null;

                shMenuList.each((i, el) => {
                    const text = $(el).text().toLowerCase().trim();
                    if (text === "завтра") {
                        tomorrowHref = $(el).attr("href");
                    }
                });

                if (tomorrowHref) {
                    console.log("Link to tomorrow:", tomorrowHref);
                }

                let dateIso = null;
                try {
                    const dateText = $(".description").text();
                    const regex = /(\d{2})\.(\d{2})\.(\d{4}) о (\d{2}):(\d{2})/;
                    const match = dateText.match(regex);

                    if (match) {
                        // match[0] - вся строка, [1]..[5] - группы
                        const [, day, month, year, hours, minutes] = match;
                        const dateObj = new Date(
                            Number(year),
                            Number(month) - 1,
                            Number(day),
                            Number(hours),
                            Number(minutes)
                        );
                        dateIso = dateObj.toISOString();
                    }
                } catch (e) {
                    dateIso = null;
                }

                try {
                    const slots: any[] = [];
                    const timeToMinutes = (time: string) => {
                        const [hours, minutes] = time.split(":").map(Number);
                        return hours * 60 + minutes;
                    };

                    // 4. Перебираем периоды внутри группы
                    group.find(".period > div").each((i, p) => {
                        const str = $(p).text();
                        const match = str.match(/^(.+)\s+(.+)$/);

                        if (match) {
                            const time = match[1].trim(); // '14:00 - 15:30'
                            const status = match[2].trim(); // 'OFF'

                            const [startStr, endStr] = time.split(/\s*-\s*/);
                            const timeObject = {
                                start: timeToMinutes(startStr),
                                end: timeToMinutes(endStr),
                                type: status === "OFF" ? "Definite" : "NotPlanned",
                            };
                            slots.push(timeObject);
                        }
                    });

                    const result: any = {
                        [slot]: {
                            today: {
                                slots,
                                status: "ScheduleApplies",
                            },
                            tomorrow: {
                                slots: [],
                                status: "WaitingForSchedule",
                            },
                            updatedOn: dateIso,
                        },
                    };

                    deferred.resolve(JSON.stringify(result));
                } catch (e) {
                    console.log("Error during parsing", e);
                    deferred.reject(JSON.stringify(e));
                }
            });
        })
        .on("error", (err: any) => {
            console.log("Ошибка запроса: " + err.message);
            deferred.reject(err.message);
        });

    return deferred.promise;
}
