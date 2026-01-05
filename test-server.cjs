const https = require('https');

class Deferred {
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}

async function myRequest() {

    const deferred = new Deferred();

    const options = {
        hostname: 'www.dtek-kem.com.ua',
        path: '/ua/shutdowns',
        port: 443,
        method: 'GET',
        headers: {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'accept-language': 'en-US,en;q=0.9,ru-UA;q=0.8,ru;q=0.7',
            'cache-control': 'no-cache',
            'cookie': 'Domain=dtek-kem.com.ua; dtek-kem=cphlc79c11btdu485dldr0mopi; _language=1f011804d107a9f0f6fa36417ed49140e5bc2106c740e65666f3a94e857201cca%3A2%3A%7Bi%3A0%3Bs%3A9%3A%22_language%22%3Bi%3A1%3Bs%3A2%3A%22uk%22%3B%7D; _csrf-dtek-kem=c8f39373a7774952fd97b02a7f43cc2ac9e324e318f7dcc772d7a8a0e3bad787a%3A2%3A%7Bi%3A0%3Bs%3A14%3A%22_csrf-dtek-kem%22%3Bi%3A1%3Bs%3A32%3A%22V34z7YvlMC38q_x6V5lmODnzaXzxYN2z%22%3B%7D; visid_incap_2224657=I2r5ysVoStilW4lHadL7AQV2V2kAAAAAQUIPAAAAAABqbTlsFglIkhqR/mwG4gE9; incap_ses_608_2224657=ADCQBtph4nMECpJR2gxwCAV2V2kAAAAATsGxAx1IHVBJ0E9pvJaz7g==; _ga_DLFSTRRPM2=GS2.1.s1767339527$o1$g0$t1767339527$j60$l0$h0; _ga=GA1.3.793052785.1767339528; _gid=GA1.3.687185050.1767339528; _hjSessionUser_5026684=eyJpZCI6IjkyZGE5NjI4LWU2OWUtNTY2My04MjRhLTU5OTJiM2U3N2E4MSIsImNyZWF0ZWQiOjE3NjczMzk1Mjc5MjEsImV4aXN0aW5nIjpmYWxzZX0=; _hjSession_5026684=eyJpZCI6ImVjYmE4YzgyLTdhNzAtNDcxYS1iYTdhLWI0MzUyNWY4NGYxYSIsImMiOjE3NjczMzk1Mjc5MjIsInMiOjAsInIiOjAsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjoxLCJzcCI6MX0=; incap_ses_689_2224657=7JGtWNRVzk0+GqurS9KPCY95V2kAAAAA9FA8iYF/1+dyneFu2VNTZg==',
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

        // Получаем части данных
        res.on('data', (chunk) => {
            data += chunk;
        });

        // Весь ответ получен
        res.on('end', () => {
            console.log('end ->>');
            console.log((data));
            deferred.resolve(data);
        });

    }).on('error', (err) => {
        console.log('Ошибка: ' + err.message);
        deferred.reject(err.message);
    });

    return deferred.promise
}

myRequest()