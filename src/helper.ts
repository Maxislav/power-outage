import { ISlot } from "./model";

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
export function formatMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);

  // Преобразуем числа в строки и добавляем ведущий ноль
  const hDisplay = String(hours).padStart(2, "0");
  const mDisplay = String(minutes).padStart(2, "0");

  return `${hDisplay}:${mDisplay}`;
}

export function timeUntil(targetMinutes: number, prefix: string): string {
  // Получаем текущее время в минутах от начала дня
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Вычисляем разницу с учетом 1440 минут в сутках
  // (targetMinutes - currentMinutes + 1440) % 1440
  let diff = (targetMinutes - currentMinutes + 1440) % 1440;

  if (diff < 0) {
    return "";
  }

  if (targetMinutes - currentMinutes <= 0) {
    return "Время наступило!";
  }

  const hours = Math.floor(diff / 60);
  const mins = diff % 60;

  return `${prefix}: ${hours} ч. ${mins} мин.`;
}

export function getCurrentSlot(data: ISlot[]): ISlot {
  // 1. Получаем текущее время
  const now = new Date();

  // 2. Считаем сколько минут прошло с начала дня
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // 3. Ищем слот, где текущие минуты >= start и < end
  return data.find(
    (slot) => currentMinutes >= slot.start && currentMinutes < slot.end
  );
}

export function timerFormatHtml(time: string) {
  const chars = [...time];

  return (
    '<div class="time-line">' +
    chars.reduce((acc, v) => {
      const syleClass = isNumeric(v) ? "digit" : "char";
      return acc + `<div class="time-cell ${syleClass}">${v}</div>`;
    }, "") +
    "</div>"
  );
}

function isNumeric(val: string) {
  return !isNaN(parseFloat(val));
}


export function isObjectEmpty(obj: any) {
  return (
    obj && // Проверка на null и undefined
    typeof obj === 'object' && // Проверка, что это объект
    !Array.isArray(obj) && // Исключаем массивы (у них тоже есть ключи)
    Object.keys(obj).length === 0 && // Проверка на отсутствие ключей
    obj.constructor === Object // Проверка, что это "простой" объект (не Date, не Map)
  );
}