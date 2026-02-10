export type TGpv = "no" | "yes" | "second" | "first";

export enum EGpv {
    "yes" = "yes",
    "no" = "no",
    "second" = "second",
    "first" = "first",
}

export enum EslotType {
    DEFINITE = "Definite",
    NOTPLANNED = "NotPlanned",
}

export enum EStatus {
    SCHEDULEAPPLIES = "ScheduleApplies",
    WAITINGFORSCHEDULE = "WaitingForSchedule",
}

export interface ISlot {
    start: number;
    end: number;
    type: EslotType;
}

export interface IDay {
    date: string;
    slots: ISlot[];
    status: EStatus;
}

export interface ITodayTomorrow {
    today: IDay;
    tomorrow: IDay;
    updatedOn: string;
}

export interface IData {
    [key: string]: ITodayTomorrow;
}

export interface IArea {
    id: number;
    slot: string;
    origin: "city" | "region";
}

export interface IOpenMeteo {
    current: {
        time: string; //"2026-01-26T20:30",
        interval: number;
        temperature_2m: number;
        wind_speed_10m: number;
        wind_direction_10m: number;
        rain: number;
        showers: number;
        snowfall: number;
        cloud_cover: number;
        precipitation: number;
        is_day: 0 | 1;
    };
}

export interface IOpenWeather {
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number; // 98
        sea_level: number;
        grnd_level: number;
    };
    wind: {
        speed: number;
        deg: number;
        gust: number;
    };
    clouds: {
        all: number;
    };
}
