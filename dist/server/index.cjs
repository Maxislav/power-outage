require('./sourcemap-register.cjs');/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 896:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 611:
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ 692:
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
const http = __nccwpck_require__(611);
const https = __nccwpck_require__(692);
const fs = __nccwpck_require__(896);


const PORT_HTTPS = 5710;
const PORT_HTTP = 5711;


class Deferred {
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}


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

let cookie;

const serverHttps = https.createServer(options, async (reqq, ress) => {
    const origin = reqq.headers.origin || reqq.headers.referer;

    console.log("origin ->>", origin);
    if (ALLOWED_ORIGINS.includes(origin)) {
        ress.setHeader("Access-Control-Allow-Origin", origin);
    }
    ress.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    ress.setHeader("Access-Control-Allow-Headers", "Content-Type");
    // Проверяем путь запроса
    if (reqq.url === "/shutdown" && reqq.method === "GET") {
        try {
            const data = await myRequest();
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

const serverHttp = http.createServer(async (reqq, ress) => {
    const origin = reqq.headers.origin;


    if (reqq.url === "/shutdown" && reqq.method === "GET") {
        try {
            const data = await myRequest();
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
    console.log(`Сервер запущен на https://localhost:${PORT_HTTP}`);
    console.log(`Маршрут: https://localhost:${PORT_HTTP}/shutdown`);
});

if (options.cert) {
    serverHttps.listen(PORT_HTTPS, () => {
        console.log(`Сервер запущен на https://localhost:${PORT_HTTPS}`);
        console.log(`Маршрут: https://localhost:${PORT_HTTPS}/shutdown`);
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
}



async function myRequest() {

    const deferred = new Deferred();

    const options = {
        hostname: 'app.yasno.ua',
        path: '/api/blackout-service/public/shutdowns/regions/25/dsos/902/planned-outages',
        port: 443,
        method: 'GET',
        headers: {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'accept-language': 'en-US,en;q=0.9,ru-UA;q=0.8,ru;q=0.7',
            'cache-control': 'no-cache',
            // _language=1f011804d107a9f0f6fa36417ed49140e5bc2106c740e65666f3a94e857201cca%3A2%3A%7Bi%3A0%3Bs%3A9%3A%22_language%22%3Bi%3A1%3Bs%3A2%3A%22uk%22%3B%7D; Domain=dtek-kem.com.ua; incap_wrt_373=l4ZXaQAAAAAVyqQeGgAI9QIQ19KJ+IoCGMOP3soGIAIol43eygYwAcI97KunruIFdFbLUVxCTvE=
            // 'cookie': 'Domain=dtek-kem.com.ua; _language=1f011804d107a9f0f6fa36417ed49140e5bc2106c740e65666f3a94e857201cca%3A2%3A%7Bi%3A0%3Bs%3A9%3A%22_language%22%3Bi%3A1%3Bs%3A2%3A%22uk%22%3B%7D; _csrf-dtek-kem=c8f39373a7774952fd97b02a7f43cc2ac9e324e318f7dcc772d7a8a0e3bad787a%3A2%3A%7Bi%3A0%3Bs%3A14%3A%22_csrf-dtek-kem%22%3Bi%3A1%3Bs%3A32%3A%22V34z7YvlMC38q_x6V5lmODnzaXzxYN2z%22%3B%7D; incap_ses_608_2224657=ADCQBtph4nMECpJR2gxwCAV2V2kAAAAATsGxAx1IHVBJ0E9pvJaz7g==; _gid=GA1.3.687185050.1767339528; _hjSession_5026684=eyJpZCI6ImVjYmE4YzgyLTdhNzAtNDcxYS1iYTdhLWI0MzUyNWY4NGYxYSIsImMiOjE3NjczMzk1Mjc5MjIsInMiOjAsInIiOjAsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjoxLCJzcCI6MX0=; incap_ses_689_2224657=7JGtWNRVzk0+GqurS9KPCY95V2kAAAAA9FA8iYF/1+dyneFu2VNTZg==; _hjSessionUser_5026684=eyJpZCI6IjkyZGE5NjI4LWU2OWUtNTY2My04MjRhLTU5OTJiM2U3N2E4MSIsImNyZWF0ZWQiOjE3NjczMzk1Mjc5MjEsImV4aXN0aW5nIjp0cnVlfQ==; Domain=dtek-kem.com.ua; dtek-kem=ijdn71j2j7rd07kohj08qh9mqu; incap_ses_184_2224657=7F3zcUdr/jQaiWOyarONAgOBV2kAAAAA3BzxLegvPYebi1yzRDb7oA==; visid_incap_2224657=I2r5ysVoStilW4lHadL7AQV2V2kAAAAAQkIPAAAAAACAWXXBAVXf0RLLatMOoJcvJXZOhO7X2G5m; _ga_DLFSTRRPM2=GS2.1.s1767339527$o1$g1$t1767342346$j55$l0$h0; _ga=GA1.3.793052785.1767339528; _gat_gtag_UA_121351636_1=1; incap_wrt_373=CYFXaQAAAAASnJYnGgAI9QIQ/bzm9ooCGLWE3soGIAIohYLeygYwASsTGroGYIlb8Cl66SYX3nk=',
            //'cookie': '_language=1f011804d107a9f0f6fa36417ed49140e5bc2106c740e65666f3a94e857201cca%3A2%3A%7Bi%3A0%3Bs%3A9%3A%22_language%22%3Bi%3A1%3Bs%3A2%3A%22uk%22%3B%7D; incap_wrt_373=DYFXaQAAAAC4zvQ5GgAI9QIQ/bzm9ooCGLmE3soGIAIohYLeygYwARBZGNX0CeGPiUR1Cf2fBZU=',
            'pragma': 'no-cache',
            'priority': 'u=0, i',
            'sec-ch-ua': '"Google Chrome";v="143", "Chromium";v="143", "Not A(Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'none',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36'
        }
    };

    https.get(options, (res) => {
        let data = '';
        const headers = res.headers;
        console.log('Set-Cookie:', headers['set-cookie']);


        // Получаем части данных
        res.on('data', (chunk) => {
            data += chunk;
        });

        // Весь ответ получен
        res.on('end', () => {
            console.log('end ->>');
            //console.log(extractFactObject(data));
            //const resObj = (data);
            // const nn =  data.replace('/_Incapsula', 'https://www.dtek-kem.com.ua/_Incapsula')
            deferred.resolve(data);
        });

    }).on('error', (err) => {
        console.log('Ошибка: ' + err.message);
        deferred.reject(err.message);
    });

    return deferred.promise
}
module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=index.cjs.js.map