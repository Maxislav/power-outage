export function getSunPosition(date: Date, lat: number, lng: number): number {
  const rad = Math.PI / 180;

  // 1. Количество дней с начала года (исправлено для TS)
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime(); // <--- Исправление здесь
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  // 2. Склонение Солнца (delta)
  const declination =
    -23.44 * Math.cos(rad * ((360 / 365.25) * (dayOfYear + 10)));

  // 3. Часовой угол (H)
  const hours =
    date.getUTCHours() +
    date.getUTCMinutes() / 60 +
    date.getUTCSeconds() / 3600;
  const solarTime = hours + lng / 15;
  const hourAngle = (solarTime - 12) * 15;

  // 4. Расчет высоты
  const phi = lat * rad;
  const delta = declination * rad;
  const H = hourAngle * rad;

  const sinh =
    Math.sin(phi) * Math.sin(delta) +
    Math.cos(phi) * Math.cos(delta) * Math.cos(H);

  return Math.asin(sinh) / rad;
}

export function getSunColor(angle: number, top = true): string {
  // 1. Ограничиваем угол и нормализуем его в диапазон от 0 до 1
  const minAngle = -30;
  const maxAngle = 20;
  const clampedAngle = Math.max(minAngle, Math.min(maxAngle, angle));
  const t = (clampedAngle - minAngle) / (maxAngle - minAngle);

  // 2. Исходные цвета
  // #070308 -> RGB(7, 3, 8)
  // #73abff -> RGB(115, 171, 255)
  let colorStart = { r: 7, g: 3, b: 8 };
  let colorEnd = { r: 115, g: 171, b: 255 };

  if (!top) {
    // // const colorEnd = { r: 115, g: 171, b: 255 };
    colorStart = { r: 40, g: 26, b: 59 };
    colorEnd = { r: 255, g: 247, b: 224 };
  }

  // 3. Линейная интерполяция для каждого канала
  const r = Math.round(colorStart.r + (colorEnd.r - colorStart.r) * t);
  const g = Math.round(colorStart.g + (colorEnd.g - colorStart.g) * t);
  const b = Math.round(colorStart.b + (colorEnd.b - colorStart.b) * t);

  // 4. Конвертация обратно в HEX
  const toHex = (c: number) => c.toString(16).padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// function updateSkyDynamic(angle: number) {
//     // 1. Координаты Киева
//     const LAT = 50.4501;
//     const LNG = 30.5234;

//     // 2. Получаем угол солнца (используем функцию из предыдущих ответов)
//     //const angle = getSunPosition(new Date(), LAT, LNG);

//     // 3. Нормализация угла от -63 до +63 в диапазон [0, 1]
//     const t = Math.max(0, Math.min(1, (angle + 63) / (63 + 63)));

//     // 4. Цвета (переведенные в RGB)
//     // #281a3b -> rgb(40, 26, 59)
//     // #fff7e0 -> rgb(255, 247, 224)
//     const start = { r: 40, g: 26, b: 59 };
//     const end = { r: 255, g: 247, b: 224 };

//     // 5. Интерполяция
//     const r = Math.round(start.r + (end.r - start.r) * t);
//     const g = Math.round(start.g + (end.g - start.g) * t);
//     const b = Math.round(start.b + (end.b - start.b) * t);

//     const color = `rgb(${r}, ${g}, ${b})`;

//     // 6. Передаем в CSS переменную
//     document.documentElement.style.setProperty('--sky-color', color);
// }

// Запуск
//updateSkyDynamic();
